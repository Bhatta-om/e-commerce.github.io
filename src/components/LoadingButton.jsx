import React from "react";

const LoadingButton = ({ loading, children, className = "", ...props }) => (
  <button
    className={`w-full mb-4 text-[18px] mt-6 rounded-full bg-blue-500 text-white hover:bg-blue-600 py-2 transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
    disabled={loading}
    {...props}
  >
    {loading ? (
      <div className="flex items-center justify-center">
        <svg
          className="animate-spin h-5 w-5 mr-3 text-white"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Loading...
      </div>
    ) : (
      children
    )}
  </button>
);

export default LoadingButton;
