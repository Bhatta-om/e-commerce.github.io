import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingButton from "../components/LoadingButton";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

const SignUp = ({ setShowLogin, setShowSignup }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const baseUrl = "https://zd88bbhd-5000.inc1.devtunnels.ms";
  
  const formRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowSignup(false); // Close the signup form
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowSignup]);

  const handleGoogleSignIn = () => {
    try {
      setGoogleLoading(true);
      // Store the current URL to return to after authentication
      sessionStorage.setItem('returnTo', window.location.pathname);
      
      // Open Google Auth in a new window or tab instead of same window
      const googleAuthWindow = window.open(`${baseUrl}/auth/google`, '_blank', 'width=600,height=700');
      
      // Set up a timer to check if the popup was closed without completing auth
      const checkWindowClosed = setInterval(() => {
        if (googleAuthWindow && googleAuthWindow.closed) {
          clearInterval(checkWindowClosed);
          setGoogleLoading(false);
        }
      }, 1000);

      // Set up window message listener for receiving auth data
      window.addEventListener('message', (event) => {
        // Verify origin for security
        if (event.origin === baseUrl) {
          if (event.data.success) {
            // Handle successful authentication
            login(event.data.token, event.data.user);
            navigate("/");
          } else {
            toast.error(event.data.message || 'Google authentication failed');
          }
          setGoogleLoading(false);
        }
      }, { once: true });
      
    } catch (error) {
      console.error('Google Sign-in Error:', error);
      toast.error('Failed to initialize Google Sign-in');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!showOtpInput) {
        const userData = {
          username,
          email,
          password,
          address,
          phone,
        };

        const response = await fetch(
          `${baseUrl}/api/users/signup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
            credentials: 'include'
          }
        );

        const result = await response.json();

        if (response.ok) {
          setShowOtpInput(true);
          localStorage.setItem("tempToken", result.token);
        } else {
          setErrors({ submit: result.message || "Failed to send OTP!" });
        }
      } else {
        const verificationData = {
          email,
          code: otp,
        };

        const response = await fetch(
          `${baseUrl}/api/users/verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(verificationData),
          }
        );

        const result = await response.json();

        if (response.ok) {
          console.log("Result:", result);

          const userData = result.user;
          console.log("User Data:", userData);

          if (userData) {
            if (userData.role) {
              login(result.token, userData); // Pass userData to login function
              navigate("/");
            } else {
              console.error("User Data does not have a role property");
              setErrors({ submit: "User data is missing role information!" });
            }
          } else {
            console.error("User Data: undefined");
            setErrors({ submit: "User data is not available!" });
          }
          setShowOtpInput(false);
        } else {
          setErrors({ submit: result.message || "Invalid verification code!" });
        }
      }
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    setShowSignup(false);
    setShowLogin(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto">
      <div className="my-8 flex justify-center items-center w-full max-w-xl px-4">
        <div
          ref={formRef}
          className="animate-fadeIn login-spacing bg-slate-800 border border-slate-600 rounded-md shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-30 relative w-full max-h-[80vh] overflow-y-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <div className="space-y-3">
              <h1 className="text-2xl font-semibold text-center mb-6 text-white">
                {showOtpInput ? "Verify Email" : "Sign Up"}
              </h1>

              {errors.submit && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative">
                  {errors.submit}
                </div>
              )}

              {!showOtpInput ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-white block text-sm">Username</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      autoComplete="username"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-white block text-sm">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-white block text-sm">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-blue-500 focus:outline-none"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                      />
                      <button  
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-white block text-sm">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      autoComplete="tel"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-white block text-sm">Address</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter your address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      autoComplete="address"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                    autoComplete="one-time-code"
                  />
                </div>
              )}

              <LoadingButton
                loading={loading}
                type="submit"
                className="w-full py-3 font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none transition-colors"
              >
                {showOtpInput ? "Verify Code" : "Sign Up"}
              </LoadingButton>

              <div className="text-sm text-slate-400 text-center">
                Have an account?{" "}
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="text-blue-500 hover:text-blue-600 ml-1 cursor-pointer"
                >
                  <p>Log-in</p>
                </button>
              </div>

              {!showOtpInput && (
                <>
                  <div className="flex items-center my-3">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-3 text-gray-400 text-sm">OR</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                    className={`w-full flex items-center justify-center gap-2 bg-white text-gray-700 rounded-lg py-3 hover:bg-gray-100 transition-colors ${
                      googleLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {googleLoading ? (
                      <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    )}
                    {googleLoading ? 'Signing in...' : 'Continue with Google'}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;