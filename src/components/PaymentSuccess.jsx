import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from 'lucide-react';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        let isMounted = true;
        let countdownInterval;

        const verifyPayment = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const pidx = urlParams.get('pidx');
            
            if (pidx) {
                try {
                    const response = await fetch('https://zd88bbhd-5000.inc1.devtunnels.ms/verify-payment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ pidx })
                    });

                    if (!response.ok) {
                        throw new Error('Payment verification failed');
                    }

                    // Only update state if component is still mounted
                    if (isMounted) {
                        setIsVerified(true);
                    }
                } catch (error) {
                    console.error('Error verifying payment:', error);
                }
            }
        };
        
        verifyPayment();

        // Countdown timer
        countdownInterval = setInterval(() => {
            if (isMounted) {
                setCountdown((prevCountdown) => {
                    if (prevCountdown <= 1) {
                        clearInterval(countdownInterval);
                        navigate('/');
                        return 0;
                    }
                    return prevCountdown - 1;
                });
            }
        }, 1000);

        // Cleanup function
        return () => {
            isMounted = false;
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
        };
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
            <div className="bg-white shadow-2xl rounded-xl p-8 md:p-12 text-center max-w-md w-full space-y-6">
                <div className="flex justify-center mb-4">
                    <CheckCircleIcon 
                        className="text-green-500 w-24 h-24 animate-pulse"
                    />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Payment Successful!
                </h1>
                <p className="text-gray-600 mb-6">
                    {isVerified 
                        ? `Thank you for your purchase. You will be redirected to the homepage in 
                            ${countdown} seconds.`
                        : 'Verifying your payment...'}
                </p>
                {isVerified && (
                    <div className="w-full bg-green-50 rounded-full h-2.5">
                        <div 
                            className="bg-green-500 h-2.5 rounded-full" 
                            style={{width: `${(countdown / 5) * 100}%`}}
                        ></div>
                    </div>
                )}
                <button 
                    onClick={() => navigate('/')}
                    className="mt-6 w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                >
                    Go to Homepage Now
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;