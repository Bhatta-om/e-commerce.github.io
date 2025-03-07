import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import LoadingButton from '../components/LoadingButton';

const Login = ({ setShowLogin, setShowSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const formRef = useRef(null);

  const handleClose = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const userData = {
      email,
      password,
    };

    try {
      const response = await fetch('https://zd88bbhd-5000.inc1.devtunnels.ms/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        const role = result.user?.role;
        login(result.token, { role });
        navigate(role === 'admin' ? '/dashboard' : '/');
        if (setShowLogin) {
          setShowLogin(false);
        }
      } else {
        setError(result.message || 'Login failed!');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupClick = (e) => {
    e.preventDefault();
    if (setShowLogin) {
      setShowLogin(false);
    }
    if (setShowSignup) {
      setShowSignup(true);
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div
        ref={formRef}
        className="animate-fadeIn login-spacing bg-slate-800 border border-slate-600 rounded-md shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-30 relative"
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-center mb-8 text-white">Login</h1>

            <div className="space-y-2">
              <label className="text-white block text-sm">Email</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-blue-500 focus:outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white block text-sm">Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-blue-500 focus:outline-none"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3 font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none transition-colors"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          <div className="text-sm text-slate-400 text-center mt-4">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={handleSignupClick}
              className="text-blue-500 hover:text-blue-600 ml-1 cursor-pointer"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;