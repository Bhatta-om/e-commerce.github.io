/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx,ts,tsx}", // Scan relevant files in the src directory
    "!./node_modules", // Explicitly exclude node_modules
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out forwards',
      },
    },
  },
  plugins: [],
};
