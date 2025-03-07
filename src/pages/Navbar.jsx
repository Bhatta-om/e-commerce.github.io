import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/free.png';
import Login from './Login';
import SignUp from './SignUp';
import { ShopContext } from '../context/ShopContext';
import { ShoppingCart, Search, Menu, LogOut, User, X } from 'lucide-react';

const Navbar = () => {
    const { isLoggedIn, logout, userRole, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const {setShowSearch, cartCount} = useContext(ShopContext);

    // Show search only on collection page
    useEffect(() => {
        setShowSearch(location.pathname.includes('collection'));
    }, [location, setShowSearch]);

    // Function to handle login hover
    const handleLoginHover = () => {
        setShowSignup(false); // Close signup form
        setShowLogin(true);   // Show login form
    };

    // Function to handle signup hover
    const handleSignupHover = () => {
        setShowLogin(false);  // Close login form
        setShowSignup(true);  // Show signup form
    };

    const handleLogout = () => {
        logout(navigate);
        setShowDropdown(false);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white z-50 ">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-1 p-4">
                {/* Left side: Logo and primary navigation */}
                <div className="flex items-center space-x-8">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 text-white text-xl font-bold transform transition-transform duration-300 hover:scale-110 hover:text-blue-500">
                        <img src={logo} className="h-12" alt="E-Commerce Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap text-blue-800">
                            E-Commerce
                        </span>
                    </Link>

                    {/* Primary Navigation with Search Bar */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-black hover:text-blue-500 transition-colors duration-300">HOME</Link>
                        <Link to="/collection" className="text-black hover:text-blue-500 transition-colors duration-300">COLLECTIONS</Link>
                        <Link to='/about' className='flex flex-col items-center gap-1 text-black hover:text-blue-500 transition-colors duration-300'><p>ABOUT</p></Link>
                        <Link to='/contact' className='flex flex-col items-center gap-1 text-black hover:text-blue-500 transition-colors duration-300'><p>CONTACT</p></Link>

                        {/* Show Dashboard link only for admin, moved here */}
                        {isLoggedIn && userRole === 'admin' && (
                            <Link 
                                to="/dashboard" 
                                className="text-black hover:text-blue-500 transition-colors duration-300"
                            >
                                DASHBOARD
                            </Link>
                        )}

                        <div className="w-64">
                            {/* <SearchBar /> */}
                        </div>
                    </div>
                </div>

                {/* Right side: Auth Links and Cart */}
                <div className="flex items-center space-x-6">
                    {/* Cart Icon */}
                    <Link to='/Cart' className='relative flex items-center group'>
                        <div className="p-2 rounded-full hover:bg-blue-100 transition-all duration-300">
                            <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors duration-300" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                    </Link>

                    {isLoggedIn ? (
                        // Show profile icon with dropdown when logged in
                        <div className="relative group ml-auto">
                            <button 
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center focus:outline-none group"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-300">
                                    <User className="w-5 h-5 text-blue-600" />
                                </div>
                            </button>
                            
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 transform transition-all duration-300 ease-in-out">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-300"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Show login/signup buttons when logged out
                        <>
                            <div className="relative group">
                                <button 
                                    className="text-gray-700 hover:text-blue-600 transition-all duration-300 px-4 py-2"
                                    onClick={() => {
                                        setShowSignup(false);
                                        setShowLogin(!showLogin);
                                    }}
                                >
                                    LOGIN
                                </button>
                                
                                {showLogin && (
                                    <div className="absolute right-0 mt-2 z-50">
                                        <Login 
                                            setShowLogin={setShowLogin}
                                            setShowSignup={setShowSignup}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="relative group ml-auto">
                                <button 
                                    className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                                    onClick={() => {
                                        setShowLogin(false);
                                        setShowSignup(!showSignup);
                                    }}
                                >
                                    SIGN UP
                                </button>
                                
                                {showSignup && (
                                    <div className="absolute right-0 mt-2 z-50">
                                        <SignUp 
                                            setShowLogin={setShowLogin}
                                            setShowSignup={setShowSignup}
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        className="inline-flex items-center justify-center p-2 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span className="sr-only">Toggle menu</span>
                        {isMenuOpen ? (
                            <X className="w-6 h-6 text-gray-700" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-700" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu with enhanced animation */}
                <div 
                    className={`${
                        isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                    } transform transition-all duration-300 ease-in-out absolute top-full left-0 w-full md:hidden bg-white shadow-lg rounded-b-lg`}
                >
                    <div className="px-4 pt-2 pb-3 space-y-1">
                        <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-300">HOME</Link>
                        <Link to="/collection" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-300">COLLECTIONS</Link>
                        <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-300">ABOUT</Link>
                        <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-300">CONTACT</Link>
                        
                        {isLoggedIn && userRole === 'admin' && (
                            <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-300">DASHBOARD</Link>
                        )}
                    </div>
                </div>

                {/* Search Icon - Only visible on collection page */}
                {location.pathname.includes('collection') && (
                    <div className='flex items-center gap-6'>
                        <button 
                            onClick={() => setShowSearch(true)}
                            className="p-2 rounded-full hover:bg-blue-100 transition-all duration-300"
                        >
                            <Search className="w-5 h-5 text-gray-700 hover:text-blue-600 transition-colors duration-300" />
                        </button>
                    </div>
                )}
            </div>
            
        </nav>
    );
};

export default Navbar;
