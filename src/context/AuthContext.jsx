import { createContext, useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// Export directly here
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        // Check localStorage for token and userData to determine login state
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('userData'));
       
        if (token) {
            setIsLoggedIn(true);
            if (userData) {
                setUserRole(userData.role); // Set user role from local storage
                setUser(userData); // Set full user data
            }
        }
    }, []);
    
    const login = async (token, userData) => {
        console.log('Login - User Data:', userData);
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        setUserRole(userData.role);
        setUser(userData); // Store the user data in state
        setIsLoggedIn(true);
    };
    
    const logout = (navigate) => {
        // Clear all auth-related data but keep cart
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.removeItem('adminData');
       
        setIsLoggedIn(false);
        setUserRole(null);
        setUser(null); // Clear the user data
        
        if (navigate) {
            navigate('/');
        }
    };
    
    // Function to get the authentication token (used for API calls)
    const getToken = () => {
        return localStorage.getItem('token');
    };
    
    // Function to update user data after profile changes
    const updateUserData = (updatedData) => {
        const currentUserData = JSON.parse(localStorage.getItem('userData')) || {};
        const newUserData = { ...currentUserData, ...updatedData };
        
        localStorage.setItem('userData', JSON.stringify(newUserData));
        setUser(newUserData);
        
        if (updatedData.role) {
            setUserRole(updatedData.role);
        }
    };
    
    return (
        <AuthContext.Provider 
            value={{ 
                isLoggedIn, 
                userRole, 
                user, 
                login, 
                logout, 
                getToken, 
                updateUserData 
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Make this a named export instead of default
export const PrivateRoute = ({ children }) => {
    const { isLoggedIn } = useAuth();
    console.log(`User authenticated: ${isLoggedIn}`);
    return isLoggedIn ? children : <Navigate to="/login" />;
};