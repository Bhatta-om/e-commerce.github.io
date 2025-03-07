import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the token from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      try {
        // Store the token securely
        localStorage.setItem('token', token);
        console.log('Token stored successfully');
        
        // Redirect to the home page
        navigate('/Home');
      } catch (error) {
        console.error('Failed to store token:', error);
        navigate('/signup'); // Navigate to signup in case of an error
      }
    } else {
      console.warn('No token found in the URL');
      navigate('/signup'); // Redirect to signup if no token is present
    }
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      {/* Loading spinner */}
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default GoogleCallback;
