import React, { useContext, useState } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  MapPin, 
  Phone, 
  ShoppingCart, 
  CreditCard, 
  CheckCircle,
  User 
} from "lucide-react";

const PlaceOrder = () => {
    const location = useLocation();
    const { navigate, cartItems, products } = useContext(ShopContext);
    const delivery_fee = 100;
    
    const directPurchaseItem = location.state?.product;

    const [formData, setFormData] = useState({
      username: '',
      address: '',
      phone: '',
    });

    const onchangeHandler = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setFormData(data => ({...data, [name]: value}));
    }
    
    const handleSubmit = async (e) => {
      e.preventDefault();

      // Validate all fields
      if (!formData.username.trim() || !formData.address.trim() || !formData.phone.trim()) {
        toast.error("Please fill in all fields");
        return;
      }

      try {
        let orderItems = [];
           
        if (directPurchaseItem) {
          orderItems.push({
            ...directPurchaseItem,
            quantity: 1
          });
        } else {
          for(const items in cartItems) {
            for(const item in cartItems[items]) {
              if (cartItems[items][item] > 0) {
                const itemInfo = structuredClone(products.find(product => product._id === items))
                if (itemInfo) {
                  itemInfo.size = item;
                  itemInfo.quantity = cartItems[items][item];
                  orderItems.push(itemInfo)
                }
              }
            }
          }
        }

        if (orderItems.length === 0) {
          toast.error("No items in order!");
          return;
        }

        const subtotal = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
        const totalAmount = subtotal + delivery_fee;

        const orderData = { 
          shippingDetails: {
            uname: formData.username,
            address: formData.address,
            phone: formData.phone
          },
          items: orderItems.map(item => ({
            ...item,
            pname: item.name || item.pname,
            image: item.image,
            orderDate: new Date().toISOString()
          })),
          subtotal: subtotal,
          shippingCost: delivery_fee,
          totalAmount: totalAmount,
          orderDate: new Date().toISOString()
        }

        // Log the data to verify it's structured correctly
        console.log('Order Data:', orderData);

        navigate('/payment', { 
          state: { orderData }
        });

      } catch (error) {
        console.log(error);
        toast.error(error.message)
      }
    }

    const calculateTotal = () => {
      if (directPurchaseItem) {
        return directPurchaseItem.price;
      }

      let total = 0;
      for(const items in cartItems) {
        for(const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const product = products.find(p => p._id === items);
            if (product) {
              total += product.price * cartItems[items][item];
            }
          }
        }
      }
      return total;
    };

    const productTotal = calculateTotal();
    const finalTotal = productTotal + delivery_fee;

    React.useEffect(() => {
      if (!directPurchaseItem && Object.keys(cartItems).length === 0) {
        toast.error("No items to purchase!");
        navigate('/');
      }
    }, [directPurchaseItem, cartItems, navigate]);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
        <div className="md:flex">
          {/* Delivery Information Section */}
          <div className="md:w-1/2 p-8 bg-gradient-to-tr from-blue-50 to-blue-100">
            <div className="mb-8">
              <Title text1={"DELIVERY"} text2={"INFORMATION"} className="text-2xl sm:text-3xl text-blue-900" />
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  required 
                  onChange={onchangeHandler} 
                  name='username' 
                  value={formData.username}
                  className="pl-10 w-full border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 rounded-lg py-3 px-4 transition duration-300 ease-in-out"
                  type="text"
                  placeholder="Full Name"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  required 
                  onChange={onchangeHandler} 
                  name='address' 
                  value={formData.address}
                  className="pl-10 w-full border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 rounded-lg py-3 px-4 transition duration-300 ease-in-out"
                  type="text"
                  placeholder="Delivery Address"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  required 
                  onChange={onchangeHandler} 
                  name='phone' 
                  value={formData.phone}
                  className="pl-10 w-full border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 rounded-lg py-3 px-4 transition duration-300 ease-in-out"
                  type="tel"
                  placeholder="Phone Number"
                />
              </div>
            </form>
          </div>

          {/* Order Summary Section */}
          <div className="md:w-1/2 p-8 bg-white">
            <div className="bg-gray-50 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center mb-6">
                <ShoppingCart className="h-6 w-6 mr-3 text-blue-600" />
                <div className="text-2xl font-bold text-gray-800">Order Summary</div>
              </div>

              {/* Order Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {directPurchaseItem ? (
                  <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                    <span className="font-medium text-gray-800">{directPurchaseItem.name}</span>
                    <span className="text-gray-600">x 1</span>
                  </div>
                ) : (
                  Object.entries(cartItems).map(([productId, sizes]) => 
                    Object.entries(sizes).map(([size, quantity]) => {
                      if (quantity > 0) {
                        const product = products.find(p => p._id === productId);
                        return product ? (
                          <div key={`${productId}-${size}`} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                            <span className="font-medium text-gray-800">{product.name} ({size})</span>
                            <span className="text-gray-600">x {quantity}</span>
                          </div>
                        ) : null;
                      }
                      return null;
                    })
                  )
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Product Total:</span>
                  <span className="font-semibold">NPR {productTotal}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee:</span>
                  <span className="font-semibold">NPR {delivery_fee}</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between text-xl font-bold text-blue-800">
                  <span>Total Amount:</span>
                  <span>NPR {finalTotal}</span>
                </div>
              </div>

              {/* Proceed to Payment Button */}
              <button 
                type="submit" 
                onClick={handleSubmit}
                className="w-full flex items-center justify-center bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg"
              >
                <CreditCard className="mr-3 h-5 w-5" />
                PROCEED TO PAYMENT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;