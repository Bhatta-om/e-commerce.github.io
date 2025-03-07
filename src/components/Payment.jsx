import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { 
  CreditCardIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/solid';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { orderData } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!orderData) {
      toast.error('No order data found. Please place an order first.');
      navigate('/');
    }
  }, [orderData, navigate]);

  const handlePayment = async () => {
    if (!orderData || !orderData.items || orderData.items.length === 0) return;
    
    setIsLoading(true);
    try {
      const item = orderData.items[0];
      const productId = item.id || item._id;
      const quantity = item.quantity;
      const price = item.price;
      const image = item.image;
      const pname = item.pname || item.name;
      const uname = orderData.shippingDetails?.uname;

      // Log the payment data to verify
      console.log('Payment Data:', {
        productId,
        quantity,
        amount: price * quantity * 100,
        uname,
        pname,
        address: orderData.shippingDetails?.address,
        phone: orderData.shippingDetails?.phone
      });

      const totalAmount = price * quantity * 100;
      
      const response = await fetch('https://zd88bbhd-5000.inc1.devtunnels.ms/initiate-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity,
          amount: totalAmount,
          userId: user?._id || '67a99156093f552e798b64b0',
          uname,
          pname,
          address: orderData.shippingDetails?.address,
          phone: orderData.shippingDetails?.phone,
          image,
          orderDate: orderData.orderDate || new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error('Payment initiation failed');
      }
      
      const data = await response.json();
      
      window.location.href = data.payment_url;
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Payment initiation failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/cart');
    toast.info('Payment canceled. Your items are still in your cart.');
  };

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="animate-pulse">
            <div className="h-16 w-16 mx-auto mb-4 bg-gray-300 rounded-full"></div>
            <p className="text-gray-600 text-lg">Loading payment details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CreditCardIcon className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-800">Complete Payment</h2>
            </div>
          </div>

          {/* Payment Content */}
          <div className="p-6 space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-100 rounded-xl p-5 border border-gray-200">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-300">
                <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
                <span className="text-sm text-gray-600">Order #{orderData.orderId}</span>
              </div>
              
              <div className="space-y-3">
                {orderData.items && orderData.items.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      NPR {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-300 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>NPR {orderData.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>NPR {orderData.shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-xl text-gray-900 pt-2">
                  <span>Total</span>
                  <span>NPR {orderData.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {/* Shipping Details */}
            <div className="bg-gray-100 rounded-xl p-5 border border-gray-200">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-300">
                <h3 className="text-lg font-semibold text-gray-800">Shipping Details</h3>
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Name</span>
                  <span>{orderData.shippingDetails?.uname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Address</span>
                  <span>{orderData.shippingDetails?.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Phone</span>
                  <span>{orderData.shippingDetails?.phone}</span>
                </div>
              </div>
            </div>
            
            {/* Payment Actions */}
            <div className="space-y-4">
              <button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg 
                  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  transition-colors duration-300 ease-in-out
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg 
                      className="animate-spin h-5 w-5 mr-2" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      ></circle>
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  <>
                    <CreditCardIcon className="h-6 w-6 mr-2" />
                    Pay with Khalti
                  </>
                )}
              </button>
              
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="w-full bg-gray-100 text-gray-800 font-bold py-3 px-4 rounded-lg 
                  hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2
                  transition-colors duration-300 ease-in-out
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <ExclamationTriangleIcon className="h-6 w-6 mr-2 text-yellow-600" />
                Cancel Payment
              </button>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center mt-4 text-sm text-gray-500 flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2 text-blue-500" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
              clipRule="evenodd" 
            />
          </svg>
          Secure Payment Processing
        </div>
      </div>
    </div>
  );
};

export default Payment;