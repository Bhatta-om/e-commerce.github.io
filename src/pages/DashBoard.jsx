// src/pages/DashBoard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashBoard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/dashboard/add" className="p-4 bg-blue-500 text-white rounded shadow">
          Add Product
        </Link>
        <Link to="/dashboard/manage-orders" className="p-4 bg-green-500 text-white rounded shadow">
          Manage Orders
        </Link>
        <Link to="/dashboard/list" className="p-4 bg-yellow-500 text-white rounded shadow">
          Product List
        </Link>
      </div>
      <button 
        onClick={handleLogout} 
        className="mt-4 p-4 bg-red-500 text-white rounded shadow"
      >
        Logout
      </button>
    </div>
  );
};

export default DashBoard;