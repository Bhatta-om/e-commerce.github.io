import React, { useContext, useState, useEffect, useMemo } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import Image from '../components/common/Image';
import { toast } from "react-toastify";
import CartTotal from '../components/CartTotal';
import { Loader2 } from 'lucide-react'; // Assuming you're using lucide-react for icons

const CartItemSkeleton = () => (
  <div className="flex items-center py-4 border-t border-b text-gray-700 gap-4 animate-pulse">
    <div className="w-6 h-6 bg-gray-300 rounded"></div>
    <div className="w-16 h-16 bg-gray-300"></div>
    <div className="flex-1">
      <div className="h-4 bg-gray-300 mb-2 w-3/4"></div>
      <div className="h-3 bg-gray-300 w-1/2"></div>
    </div>
    <div className="w-16 h-8 bg-gray-300"></div>
    <div className="w-4 h-4 bg-gray-300"></div>
  </div>
);

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    addToCart,
    removeFromCart,
    navigate,
    isLoading: contextLoading,
    token,
    checkLoginStatus,
    reloadCart
  } = useContext(ShopContext);

  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const baseUrl = 'https://zd88bbhd-5000.inc1.devtunnels.ms/';

  // Memoized cart data to prevent unnecessary re-renders
  const cartData = useMemo(() => {
    return Object.entries(cartItems).flatMap(([itemId, sizes]) =>
      Object.entries(sizes).map(([size, quantity]) =>
        quantity > 0 ? { _id: itemId, size, quantity } : null
      ).filter(Boolean)
    );
  }, [cartItems]);

  // Efficient cart data loading
  useEffect(() => {
    const loadCart = async () => {
      try {
        setIsLocalLoading(true);
        if (token) {
          await reloadCart();
        }
      } catch (error) {
        console.error('Failed to load cart:', error);
        toast.error('Failed to load cart. Please try again.');
      } finally {
        setIsLocalLoading(false);
      }
    };

    loadCart();
  }, [token, reloadCart]);

  const handleQuantityChange = (itemId, size, newValue) => {
    if (!checkLoginStatus()) return;

    const value = Math.max(1, parseInt(newValue) || 0);
    const currentQty = cartItems[itemId]?.[size] || 0;

    if (value !== currentQty) {
      addToCart(itemId, size, value - currentQty);
    }
  };

  const handleRemoveItem = (itemId, size) => {
    if (!checkLoginStatus()) return;
    removeFromCart(itemId, size);
  };

  const handleSelectItem = (itemId, size) => {
    setSelectedItems(prev => ({
      ...prev,
      [`${itemId}-${size}`]: !prev[`${itemId}-${size}`]
    }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.keys(selectedItems).length === cartData.length;
    setSelectedItems(allSelected ? {} : Object.fromEntries(
      cartData.map(item => [`${item._id}-${item.size}`, true])
    ));
  };

  const selectedCartData = cartData.filter(item => selectedItems[`${item._id}-${item.size}`]);

  const handleCheckout = () => {
    if (selectedCartData.length === 0) {
      toast.error('Please select at least one item to proceed.');
      return;
    }
    navigate('/place-order');
  };

  // Render loading state
  if (isLocalLoading || contextLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500 mb-4" />
        <p className="text-xl text-gray-700">Loading your cart...</p>
      </div>
    );
  }

  // Render empty cart
  if (cartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <img src={assets.empty_cart} alt="Empty Cart" className="w-64 mb-4" />
        <p className="text-xl text-gray-700">Your cart is empty</p>
        <button 
          onClick={() => navigate('/shop')} 
          className="mt-4 bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      <div className="flex-1 bg-white p-4 rounded shadow-md">
        <div className="flex items-center justify-between mb-4">
          <Title text1={'YOUR'} text2={'CART'} />
          <label className="flex items-center">
            <input
              type="checkbox"
              onChange={handleSelectAll}
              checked={Object.keys(selectedItems).length === cartData.length}
              className="mr-2"
            />
            <span>Select All</span>
          </label>
        </div>
        {cartData.map((item, index) => {
          const productData = products.find((product) => product._id === item._id);
          if (!productData) return null;
          return (
            <div
              key={`${item._id}-${item.size}-${index}`}
              className="flex items-center py-4 border-t border-b text-gray-700 gap-4"
            >
              <input
                type="checkbox"
                onChange={() => handleSelectItem(item._id, item.size)}
                checked={!!selectedItems[`${item._id}-${item.size}`]}
              />
              <Image
                className="w-16 sm:w-20"
                src={`${baseUrl}${productData.image}`}
                alt={productData.name}
              />
              <div className="flex-1">
                <p className="text-xs sm:text-lg font-medium">{productData.name}</p>
                <div className="flex items-center gap-5 mt-2">
                  <p>{currency}{productData.price}</p>
                  <p className="px-2 sm:px-3 sm:py-1 bg-slate-50">{item.size}</p>
                </div>
              </div>
              <input
                onChange={(e) => handleQuantityChange(item._id, item.size, e.target.value)}
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                type="number"
                min={1}
                value={item.quantity}
              />
              <Image
                onClick={() => handleRemoveItem(item._id, item.size)}
                className="w-4 cursor-pointer"
                src={assets.bin_icon}
                alt="Remove"
              />
            </div>
          );
        })}
      </div>
      <div className="w-full md:w-1/3 bg-white p-4 rounded shadow-md">
        <CartTotal items={selectedCartData.map(item => ({
          price: products.find(product => product._id === item._id)?.price || 0,
          quantity: item.quantity
        }))} />
        <button
          onClick={handleCheckout}
          className="w-full mt-4 bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
        >
          PROCEED TO CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default Cart;