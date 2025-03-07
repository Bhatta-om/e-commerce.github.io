import { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = 'Rs. ';
  const delivery_fee = 100;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const apiUrl = "https://zd88bbhd-5000.inc1.devtunnels.ms/api";

  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [cartSynced, setCartSynced] = useState(false);
  const navigate = useNavigate();

  // Function to check if token is valid and not expired
  const isTokenValid = useCallback((token) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  }, []);

  // Function to fetch products data from the backend
  const getProductsData = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/products/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error(error.message || 'Network error when fetching products');
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  // Function to get user ID from token
  const getUserIdFromToken = useCallback((token) => {
    if (!isTokenValid(token)) {
      localStorage.removeItem('token');
      return null;
    }
    try {
      const decoded = jwtDecode(token);
      return decoded.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.removeItem('token');
      return null;
    }
  }, [isTokenValid]);

  // Function to calculate cart count
  const calculateCartCount = useCallback(() => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        totalCount += cartItems[itemId][size]; // Sum the quantity of each item by size
      }
    }
    return totalCount;
  }, [cartItems]);

  // Function to fetch user cart data from API
  const fetchUserCartData = useCallback(async (userId, userToken) => {
    if (!userId || !isTokenValid(userToken)) return null;

    try {
      const response = await fetch(`${apiUrl}/users/usersdata/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to fetch user data:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const userData = await response.json();
      
      if (userData.success && userData.data && userData.data.cart) {
        // Transform the API cart format to our local format
        const serverCart = userData.data.cart;
        const transformedCart = {};
        
        serverCart.forEach(item => {
          const { productId, size, quantity } = item;
          
          if (!transformedCart[productId]) {
            transformedCart[productId] = {};
          }
          
          transformedCart[productId][size] = quantity;
        });
        
        console.log("Loaded cart items from API:", transformedCart);
        return transformedCart;
      }
      
      return {};
    } catch (error) {
      console.error('Error fetching user cart data:', error);
      if (error.message && error.message.includes('401')) {
        // Token might be expired or invalid
        localStorage.removeItem('token');
        setToken('');
        setUserId(null);
      }
      return null;
    }
  }, [apiUrl, isTokenValid]);

  // Function to merge local cart with server cart
  const mergeCartData = useCallback((localCart, serverCart) => {
    if (!serverCart) return localCart;
    if (!localCart || Object.keys(localCart).length === 0) return serverCart;

    const mergedCart = structuredClone(serverCart);

    // Add items from localCart that aren't in serverCart or update quantities
    for (const productId in localCart) {
      if (!mergedCart[productId]) {
        mergedCart[productId] = {};
      }

      for (const size in localCart[productId]) {
        if (!mergedCart[productId][size]) {
          mergedCart[productId][size] = localCart[productId][size];
        } else {
          // Take the higher quantity if the item exists in both carts
          mergedCart[productId][size] = Math.max(
            mergedCart[productId][size],
            localCart[productId][size]
          );
        }
      }
    }

    return mergedCart;
  }, []);

  // Function to load cart items from localStorage and API
  const loadCartItems = useCallback(async () => {
    setIsLoading(true);
    setCartSynced(false);
    
    try {
      // Get token from localStorage
      const storedToken = localStorage.getItem('token');
      
      // Check if token is valid
      if (storedToken && isTokenValid(storedToken)) {
        setToken(storedToken);
        const id = getUserIdFromToken(storedToken);
        setUserId(id);
        
        // Get local cart data
        let localCartData = {};
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
          try {
            const parsedItems = JSON.parse(storedCartItems);
            if (typeof parsedItems === 'object' && parsedItems !== null) {
              localCartData = parsedItems;
              console.log("Loaded cart items from localStorage:", parsedItems);
            }
          } catch (error) {
            console.error("Error parsing cart items from localStorage:", error);
          }
        }
        
        // If user is logged in, fetch cart from API
        if (id) {
          const apiCartData = await fetchUserCartData(id, storedToken);
          
          if (apiCartData) {
            // Merge local cart with server cart
            const mergedCart = mergeCartData(localCartData, apiCartData);
            setCartItems(mergedCart);
            
            // If local cart has items not in server, sync them to server
            if (Object.keys(localCartData).length > 0) {
              await syncLocalCartToServer(localCartData, apiCartData, id, storedToken);
            }
            
            setCartSynced(true);
            return;
          }
        }
        
        // If we couldn't get cart data from API, use localStorage
        setCartItems(localCartData);
      } else {
        // No valid token, clear user data but keep local cart
        if (storedToken) {
          localStorage.removeItem('token');
        }
        setToken('');
        setUserId(null);
        
        // Use localStorage cart
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
          try {
            const parsedItems = JSON.parse(storedCartItems);
            if (typeof parsedItems === 'object' && parsedItems !== null) {
              setCartItems(parsedItems);
              console.log("Loaded cart items from localStorage:", parsedItems);
            }
          } catch (error) {
            console.error("Error parsing cart items from localStorage:", error);
            setCartItems({});
          }
        } else {
          setCartItems({});
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      // Fallback to empty cart in case of errors
      setCartItems({});
    } finally {
      setIsLoading(false);
      setCartSynced(true);
    }
  }, [fetchUserCartData, getUserIdFromToken, isTokenValid, mergeCartData]);

  // Function to sync local cart to server after login
  const syncLocalCartToServer = useCallback(async (localCart, serverCart, userId, token) => {
    if (!userId || !token || !isTokenValid(token)) return;
    
    // Create an array of operations to perform
    const operations = [];
    
    // For each product in local cart
    for (const productId in localCart) {
      for (const size in localCart[productId]) {
        const localQuantity = localCart[productId][size];
        const serverQuantity = serverCart && serverCart[productId] && serverCart[productId][size] 
          ? serverCart[productId][size] 
          : 0;
        
        // If local quantity is higher, add the difference to the server
        if (localQuantity > serverQuantity) {
          operations.push({
            productId,
            size,
            quantity: localQuantity - serverQuantity
          });
        }
      }
    }
    
    // Perform all operations in sequence
    for (const op of operations) {
      try {
        await fetch(`${apiUrl}/users/cart/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            productId: op.productId, 
            quantity: op.quantity,
            size: op.size
          })
        });
      } catch (error) {
        console.error('Error syncing cart item to server:', error);
      }
    }
    
    if (operations.length > 0) {
      console.log(`Synced ${operations.length} cart items to server`);
    }
  }, [apiUrl, isTokenValid]);

  // Load cart items and products on component mount
  useEffect(() => {
    loadCartItems();
    getProductsData();
    
    // Set up event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        // Token changed in another tab, reload cart
        loadCartItems();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadCartItems, getProductsData]);

  // useEffect to update cart count whenever cartItems change
  useEffect(() => {
    const totalCount = calculateCartCount();
    setCartCount(totalCount);
    
    // Only save to localStorage if cart is synced (to prevent overwriting with empty data)
    if (cartSynced) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, calculateCartCount, cartSynced]);

  // Function to check login status
  const checkLoginStatus = useCallback(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken || !isTokenValid(storedToken)) {
      localStorage.removeItem('token');
      setToken('');
      setUserId(null);
      toast.warning('Please login to add items to the cart');
      navigate('/login');
      return false;
    }
    
    if (storedToken !== token) {
      setToken(storedToken);
      const id = getUserIdFromToken(storedToken);
      setUserId(id);
    }
    
    return true;
  }, [navigate, token, getUserIdFromToken, isTokenValid]);

  // Function to add/update items in the cart
  const addToCart = useCallback(async (itemId, size, quantity = 1) => {
    if (!size) {
        toast.error('Select product size');
        return;
    }

    // Create a new cart state
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

    // Update local state immediately for better UX
    setCartItems(cartData);
    
    // Sync with backend if user is logged in
    let syncSuccess = false;
    const storedToken = localStorage.getItem('token');
    const id = storedToken ? getUserIdFromToken(storedToken) : null;
    
    if (storedToken && id && isTokenValid(storedToken)) {
      try {
        const response = await fetch(`${apiUrl}/users/cart/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          },
          body: JSON.stringify({ 
            productId: itemId, 
            quantity,
            size
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const responseText = await response.text();
        let data;
        
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          throw new Error('Invalid response from server');
        }
        
        if (data.success === false) {
          throw new Error(data.message || 'Failed to add item to cart');
        }
        
        syncSuccess = true;
        toast.success('Item added to cart successfully');
        return data;
      } catch (error) {
        console.error('Error adding to cart on server:', error);
        
        if (error.message && error.message.includes('401')) {
          // Token might be expired or invalid
          localStorage.removeItem('token');
          setToken('');
          setUserId(null);
          toast.error('Your session has expired. Please log in again.');
        } else {
          toast.info('Item added to local cart, but server sync failed');
        }
      }
    } else {
      // If not logged in, just keep the local cart state and inform user to login
      toast.info('Item added to cart. Log in to save your cart.');
    }
    
    return syncSuccess;
  }, [apiUrl, cartItems, getUserIdFromToken, isTokenValid]);

  // Function to remove items from the cart
  const removeFromCart = useCallback(async (itemId, size) => {
    // Create a new cart state
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

      // Update local state immediately for better UX
      setCartItems(cartData);

      // Sync with backend if user is logged in
      let syncSuccess = false;
      const storedToken = localStorage.getItem('token');
      const id = storedToken ? getUserIdFromToken(storedToken) : null;
      
      if (storedToken && id && isTokenValid(storedToken)) {
        try {
          const response = await fetch(`${apiUrl}/users/del_cart/${id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${storedToken}`
            },
            body: JSON.stringify({ 
              productId: itemId,
              size 
            })
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
          
          const responseText = await response.text();
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
          
          syncSuccess = true;
          toast.success('Item removed from cart successfully');
          return data;
        } catch (error) {
          console.error('Error removing from cart on server:', error);
          
          if (error.message && error.message.includes('401')) {
            // Token might be expired or invalid
            localStorage.removeItem('token');
            setToken('');
            setUserId(null);
            toast.error('Your session has expired. Please log in again.');
          } else {
            toast.info('Item removed from local cart, but server sync failed');
          }
        }
      }
      
      return syncSuccess;
    }
  }, [apiUrl, cartItems, getUserIdFromToken, isTokenValid]);

  // Function to manually reload cart data
  const reloadCart = useCallback(async () => {
    return await loadCartItems();
  }, [loadCartItems]);

  // Function to handle user login/logout
  const handleAuthChange = useCallback(async (newToken) => {
    if (newToken && isTokenValid(newToken)) {
      // User logged in
      localStorage.setItem('token', newToken);
      setToken(newToken);
      const id = getUserIdFromToken(newToken);
      setUserId(id);
      
      // Reload cart from server
      await loadCartItems();
      return true;
    } else {
      // User logged out
      localStorage.removeItem('token');
      setToken('');
      setUserId(null);
      
      // Keep the local cart, but clear local storage if requested
      if (!newToken) {
        localStorage.removeItem('cartItems');
        setCartItems({});
      }
      
      return false;
    }
  }, [getUserIdFromToken, isTokenValid, loadCartItems]);

  const getCartAmount = useCallback(() => {
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
  }, [cartItems, products]);

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
    checkLoginStatus,
    reloadCart,
    handleAuthChange, // New function to handle auth changes
    isTokenValid      // Expose token validation function
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;