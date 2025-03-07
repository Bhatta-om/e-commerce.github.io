import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = 'Rs. ';
  const delivery_fee = 100;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Function to fetch products data from the backend
  const getProductsData = async () => {
    try {
      const response = await fetch("https://zd88bbhd-5000.inc1.devtunnels.ms/api/products/");
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get user ID from token
  const getUserIdFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Function to calculate cart count
  const calculateCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
            totalCount += cartItems[itemId][size]; // Sum the quantity of each item by size
        }
    }
    return totalCount;
  };

  // Function to load cart items from localStorage
  const loadCartItems = async () => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        setToken(storedToken);
        const id = getUserIdFromToken(storedToken);
        setUserId(id);

        // Fetch user data including cart items from the backend
        try {
          const response = await fetch('https://zd88bbhd-5000.inc1.devtunnels.ms/api/users/userdata', {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          });

          const data = await response.json();
          
          if (data.success && data.user && data.user.cart) {
            // Convert backend cart format to our local format
            const cartData = {};
            data.user.cart.forEach(item => {
              if (!cartData[item.productId]) {
                cartData[item.productId] = {};
              }
              cartData[item.productId][item.size] = item.quantity;
            });
            
            setCartItems(cartData);
            console.log("Loaded cart items from backend:", cartData);
          } else {
            // If no cart data from backend, initialize empty
            setCartItems({});
          }
        } catch (error) {
          console.error('Error fetching user cart data:', error);
          // Fallback to localStorage if API fails
          const storedCartItems = localStorage.getItem('cartItems');
          if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
          } else {
            setCartItems({});
          }
        }
      } else {
        // No token, check localStorage
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
          setCartItems(JSON.parse(storedCartItems));
        } else {
          setCartItems({});
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems({});
    } finally {
      setIsLoading(false);
    }
  };

  // Load cart items and products on component mount
  useEffect(() => {
    loadCartItems();
    getProductsData();
  }, []); 

  // useEffect to update cart count whenever cartItems change
  useEffect(() => {
    const totalCount = calculateCartCount();
    setCartCount(totalCount);
    
    // Save cart items to localStorage whenever cartItems change
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Function to check login status
  const checkLoginStatus = () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      toast.warning('Please login to add items to the cart');
      navigate('/login');
      return false;
    }
    return true;
  };

  // Function to add/update items in the cart
  const addToCart = async (itemId, size, quantity = 1) => {
    if (!size) {
        toast.error('Select product size');
        return;
    }

    // Check if user is logged in
    if (!checkLoginStatus()) {
      return null;
    }

    let cartData = structuredClone(cartItems);
    
    // Handle the case when adding a specific quantity
    if (cartData[itemId]) {
        if (cartData[itemId][size]) {
            cartData[itemId][size] += quantity; // Update existing quantity
        } else {
            cartData[itemId][size] = quantity; // Add new size
        }
    } else {
        cartData[itemId] = {};
        cartData[itemId][size] = quantity; // Add new item
    }

    setCartItems(cartData); // Update cartItems state

    if (token && userId) {
      try {
        const response = await fetch(`https://zd88bbhd-5000.inc1.devtunnels.ms/api/users/cart/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            productId: itemId, 
            quantity,
            size
          })
        });
        
        const responseText = await response.text();
        console.log('Full response:', responseText);

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          throw new Error('Invalid response from server');
        }

        if (!response.ok) {
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        if (data.success === false) {
          throw new Error(data.message || 'Failed to add item to cart');
        }
        
        toast.success('Item added to cart successfully');
        return data;
      } catch (error) {
        // Keep the local cart state even if API fails
        console.error('Error adding to cart on server:', error);
        toast.info('Item added to local cart, but server sync failed');
      }
    }
  };

  // Function to remove items from the cart
  const removeFromCart = async (itemId, size) => {
    // Check if user is logged in
    if (!checkLoginStatus()) {
      return null;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId] && cartData[itemId][size]) {
      if (cartData[itemId][size] > 1) {
        cartData[itemId][size] -= 1;
      } else {
        delete cartData[itemId][size];
      }

      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }

      setCartItems(cartData); // Update cartItems state

      // Sync with backend if user is logged in
      if (token && userId) {
        try {
          const response = await fetch(`https://zd88bbhd-5000.inc1.devtunnels.ms/api/users/del_cart/${userId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
              productId: itemId,
              size 
            })
          });
          
          // Check if the response is OK
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Remove cart response:', errorText);
            throw new Error(`Failed to remove item from cart: ${response.status} ${response.statusText}`);
          }

          const responseText = await response.text();
          console.log('Remove cart response:', responseText);

          let data;
          try {
            data = JSON.parse(responseText);
          } catch (parseError) {
            console.error('Error parsing remove cart response:', parseError);
            throw new Error('Invalid response from server');
          }

          if (data.success === false) {
            throw new Error(data.message || 'Failed to remove item from cart');
          }
          
          toast.success('Item removed from cart successfully');
          return data;
        } catch (error) {
          // Keep the local cart state even if API fails
          console.error('Error removing from cart on server:', error);
          toast.info('Item removed from local cart, but server sync failed');
        }
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (!itemInfo) continue;
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          totalAmount += itemInfo.price * cartItems[items][item];
        }
      }
    }
    return totalAmount;
  };

  const value = {
    products, 
    currency, 
    delivery_fee,
    search, 
    setSearch, 
    showSearch, 
    setShowSearch,
    cartItems, 
    addToCart, 
    removeFromCart, 
    setCartItems,
    cartCount,
    getCartAmount, 
    navigate, 
    backendUrl,
    isLoading,
    token,
    checkLoginStatus
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;