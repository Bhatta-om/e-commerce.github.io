import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './pages/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Cart from './pages/Cart';
import GoogleCallback from './pages/GoogleCallback';
import Footer from './components/Footer';
import Collection from './pages/Collections';
import SearchBar from './components/SearchBar';
import Product from './pages/Product';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShopContextProvider from './context/ShopContext.jsx';
import PlaceOrder from './pages/PlaceOrder.jsx';
import Orders from './pages/Orders.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import DashBoard from './pages/DashBoard.jsx';
import Add from './components/admin/Add.jsx';
import List from './components/admin/List.jsx';
import ManageOrders from './components/admin/ManageOrders.jsx';
import EditProduct from './components/admin/EditProduct';
import Payment from './components/Payment';
import PaymentSuccess from './components/PaymentSuccess';

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/dashboard');
  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer />
      <Navbar />
      <div className="pt-[76px]">
        <SearchBar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path='/cart' element={<Cart />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
         
          {/* Protected Routes */}
          <Route path="/collection" element={<Collection />} />
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/place-order' element={<PlaceOrder />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/payment' element={<Payment />} />
          <Route path='/payment-success' element={<PaymentSuccess />} />
          
          {/* Admin Routes */}
          <Route path='/dashboard' element={<PrivateRoute><DashBoard /></PrivateRoute>} />
          <Route path='/dashboard/add' element={<PrivateRoute><Add /></PrivateRoute>} />
          <Route path='/dashboard/list' element={<PrivateRoute><List /></PrivateRoute>} />
          <Route path='/dashboard/manage-orders' element={<PrivateRoute><ManageOrders /></PrivateRoute>} />
          <Route path='/dashboard/edit/:id' element={<PrivateRoute><EditProduct /></PrivateRoute>} />
        </Routes>
      </div>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ShopContextProvider>
          <AppContent />
        </ShopContextProvider>
      </Router>
    </AuthProvider>
  );
};

export default App;