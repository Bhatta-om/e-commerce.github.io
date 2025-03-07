import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import Image from "../common/Image";

const List = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const baseUrl = "https://zd88bbhd-5000.inc1.devtunnels.ms/";

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${baseUrl}api/products/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched Data:', data);

      if (data.success) {
        setList(data.data);
      } else {
        toast.error(data.message || "An error occurred fetching products");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(
        `${baseUrl}api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.success) {
        toast.success(responseData.message || "Product deleted successfully");
        await fetchList();
      } else {
        toast.error(responseData.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message);
    }
  };

  const handleEdit = (item) => {
    navigate(`/dashboard/edit/${item._id}`, { state: { product: item } });
  };

  useEffect(() => {
    fetchList();
  }, []); // Only call fetchList once when the component mounts

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredList = Array.isArray(list)
    ? list.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="p-4">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-xl font-bold">Product List</p>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="border px-3 py-2 rounded-lg"
          />
          <button 
            onClick={() => fetchList()} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          <p className="font-medium">Error loading products</p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-3 px-4 bg-gray-100 text-sm font-medium">
            <p>Image</p>
            <p>Name</p>
            <p>Category</p>
            <p>Price</p>
            <p className="text-center">Action</p>
          </div>

          {filteredList.length > 0 ? (
            filteredList.map((item) => (
              <div
                className="grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-3 px-4 border-b last:border-b-0 hover:bg-gray-50"
                key={item._id}
              >
                <div className="flex justify-center md:block">
                  <div className="w-16 h-16 overflow-hidden rounded-lg">
                    <Image
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      src={`${baseUrl}${item.image}`}
                      alt={item.name}
                      fallback="https://via.placeholder.com/150"
                    />
                  </div>
                </div>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.subcategory}</p>
                </div>
                <p>{item.category}</p>
                <p>Rs.{parseFloat(item.price).toFixed(2)}</p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeProduct(item._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No products found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default List;