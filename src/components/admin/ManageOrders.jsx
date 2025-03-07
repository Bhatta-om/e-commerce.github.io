// src/components/admin/ManageOrders.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import Image from '../common/Image';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = "https://zd88bbhd-5000.inc1.devtunnels.ms";

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/products`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/users/purchase`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${baseUrl}/api/users/purchase/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Order status updated successfully');
        fetchOrders(); // Refresh orders
      } else {
        toast.error(data.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  useEffect(() => {
    Promise.all([fetchOrders(), fetchProducts()]);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProductDetails = (productId) => {
    return products.find(product => product._id === productId) || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => {
            const productDetails = getProductDetails(order.productId);
            return (
              <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Order #{order._id}</h3>
                    <p className="text-gray-600">
                      Placed on: {formatDate(order.createdAt)}
                    </p>
                    <p className="text-gray-600">
                      Customer ID: {order.user}
                    </p>
                  </div>
                  <div>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className={`px-3 py-1 border rounded text-sm ${
                        order.status === 'Completed' ? 'bg-green-100' :
                        order.status === 'Initiated' ? 'bg-yellow-100' :
                        'bg-gray-100'
                      }`}
                    >
                      <option value="Initiated">Initiated</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-b py-4 my-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Shipping Details</h4>
                      <p className="text-gray-600">Address: {order.address}</p>
                      <p className="text-gray-600">Phone: {order.phone}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Payment Details</h4>
                      <p className="text-gray-600">Amount: NPR {order.amount}</p>
                      <p className="text-gray-600">Payment ID: {order.pidx}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Order Item</h4>
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                        {order.image && (
                          <Image 
                            src={`${baseUrl}/${order.image}`}
                            alt={order.pname || 'Product Image'}
                            className="w-full h-full object-cover"
                            fallback="/placeholder.jpg"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{order.pname || `Order #${order._id}`}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {order.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Customer Name: {order.uname}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">NPR {order.amount}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;