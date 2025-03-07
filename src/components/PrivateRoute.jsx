import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
    const { isLoggedIn, userRole } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to=""currentuser />;
    }

    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;