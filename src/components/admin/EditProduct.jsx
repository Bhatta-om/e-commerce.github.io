import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const EditProduct = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const baseUrl = "https://zd88bbhd-5000.inc1.devtunnels.ms/";

  const fetchProductData = async () => {
    try {
      const response = await fetch(`${baseUrl}api/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product data');
      }

      const data = await response.json();
      if (data.success) {
        return data.product;
      } else {
        throw new Error(data.message || 'Failed to fetch product data');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error(error.message);
      return null;
    }
  };

  useEffect(() => {
    const loadProductData = async () => {
      // First try to get from location state
      let productData = location.state?.product;
      
      if (!productData) {
        // Then try localStorage
        const savedProduct = localStorage.getItem(`product_${id}`);
        if (savedProduct) {
          productData = JSON.parse(savedProduct);
        } else {
          // Finally, fetch from backend
          productData = await fetchProductData();
        }
      }

      if (productData) {
        // Save to localStorage for future use
        localStorage.setItem(`product_${id}`, JSON.stringify(productData));
        
        setFormData({
          name: productData.name || "",
          p_description: productData.p_description || "",
          price: productData.price || "",
          no_of_products: productData.no_of_products || "",
          category: productData.category || "",
          subcategory: productData.subcategory || "",
          bestseller: productData.bestseller || false,
          latestcollection: productData.latest || false,
          sizes: Array.isArray(productData.sizes) ? 
            (typeof productData.sizes === 'string' ? JSON.parse(productData.sizes) : productData.sizes) 
            : [],
          color: productData.color || "",
          currentImages: {
            image: productData.image,
            image_1: productData.image_1,
            image_2: productData.image_2,
            image_3: productData.image_3,
          }
        });
      } else {
        toast.error("Product data not found");
        navigate("/dashboard/list");
      }
      setLoading(false);
    };

    loadProductData();
  }, [id, location.state, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    p_description: "",
    price: "",
    no_of_products: "",
    category: "",
    subcategory: "",
    bestseller: false,
    latestcollection: false,
    sizes: [],
    color: "",
    currentImages: {}
  });

  const [imageFiles, setImageFiles] = useState({
    image: null,
    image_1: null,
    image_2: null,
    image_3: null
  });

  const [imagePreviews, setImagePreviews] = useState({
    image: null,
    image_1: null,
    image_2: null,
    image_3: null
  });

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      console.log(`Selected file for ${name}:`, files[0]);
      setImageFiles(prev => ({
        ...prev,
        [name]: files[0]
      }));
      
      const previewUrl = URL.createObjectURL(files[0]);
      setImagePreviews(prev => ({
        ...prev,
        [name]: previewUrl
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const hasImageFiles = Object.values(imageFiles).some(file => file !== null);
      
      if (!hasImageFiles) {
        const productData = {
          name: formData.name,
          p_description: formData.p_description,
          price: Number(formData.price),
          no_of_products: Number(formData.no_of_products),
          category: formData.category,
          subcategory: formData.subcategory,
          bestseller: formData.bestseller,
          latest: formData.latestcollection,
          sizes: JSON.stringify(formData.sizes),
          color: formData.color
        };

        const response = await fetch(`${baseUrl}api/products/${id}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(productData),
          credentials: 'include',
          mode: 'cors'
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          localStorage.removeItem(`product_${id}`);
          toast.success("Product updated successfully");
          navigate("/dashboard/list");
        } else {
          toast.error(data.message || "Failed to update product");
        }
      } else {
        const productData = {
          name: formData.name,
          p_description: formData.p_description,
          price: Number(formData.price),
          no_of_products: Number(formData.no_of_products),
          category: formData.category,
          subcategory: formData.subcategory,
          bestseller: formData.bestseller,
          latest: formData.latestcollection,
          sizes: JSON.stringify(formData.sizes),
          color: formData.color
        };

        const detailsResponse = await fetch(`${baseUrl}api/products/${id}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(productData),
          credentials: 'include',
          mode: 'cors'
        });

        if (!detailsResponse.ok) {
          const errorData = await detailsResponse.json().catch(() => null);
          throw new Error(errorData?.message || `HTTP error! status: ${detailsResponse.status}`);
        }

        await detailsResponse.json();
        
        const imageData = new FormData();
        let hasUploads = false;
        
        console.log('Image files:', imageFiles);
        
        Object.keys(imageFiles).forEach(key => {
          if (imageFiles[key]) {
            imageData.append(key, imageFiles[key]);
            hasUploads = true;
          }
        });
        
        for (let [key, value] of imageData.entries()) {
          console.log(`FormData entry: ${key} - ${value.name || value}`);
        }
        
        if (hasUploads) {
          const imageResponse = await fetch(`${baseUrl}api/products/${id}`, {
            method: "PUT",
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
            body: imageData,
            credentials: 'include',
            mode: 'cors'
          });
          
          if (!imageResponse.ok) {
            const errorData = await imageResponse.json().catch(() => null);
            console.error('Image upload error details:', errorData);
            console.error('Request URL:', `${baseUrl}api/products/${id}`);
            console.error('Request Method: PUT');
            console.error('Request Body:', imageData);
            throw new Error(errorData?.message || `Image upload error! status: ${imageResponse.status}`);
          }
          
          await imageResponse.json();
        }
        
        Object.values(imagePreviews).forEach(preview => {
          if (preview) URL.revokeObjectURL(preview);
        });
        
        localStorage.removeItem(`product_${id}`);
        toast.success("Product updated successfully");
        navigate("/dashboard/list");
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || "Error updating product");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  useEffect(() => {
    return () => {
      Object.values(imagePreviews).forEach(preview => {
        if (preview) URL.revokeObjectURL(preview);
      });
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <form className="flex flex-col w-full gap-6" onSubmit={handleSubmit}>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Edit Product</h2>
          <button
            type="button"
            onClick={() => navigate("/dashboard/list")}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Back to List
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="font-medium mb-3">Product Images</p>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {['image', 'image_1', 'image_2', 'image_3'].map((imageKey) => (
              <div key={imageKey} className="min-w-[160px] w-40">
                <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden mb-2">
                  {imagePreviews[imageKey] ? (
                    <img
                      src={imagePreviews[imageKey]}
                      alt={`New ${imageKey}`}
                      className="w-full h-full object-cover"
                    />
                  ) : formData.currentImages[imageKey] ? (
                    <img
                      src={`${baseUrl}${formData.currentImages[imageKey]}`}
                      alt={`Product ${imageKey}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'placeholder-image-url';
                        e.target.alt = 'Image not available';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex justify-center">
                  <label className="cursor-pointer px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200 text-sm text-center">
                    {imagePreviews[imageKey] ? 'Change' : 'Upload'}
                    <input
                      type="file"
                      name={imageKey}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="font-medium mb-2">Product Name</p>
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              type="text"
              required
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="font-medium mb-2">Product Color</p>
            <input
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              type="text"
              required
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="font-medium mb-2">Price</p>
            <input
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              type="number"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="font-medium mb-2">Number of Products</p>
            <input
              name="no_of_products"
              value={formData.no_of_products}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              type="number"
              min="0"
              required
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="font-medium mb-2">Category</p>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select Category</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="font-medium mb-2">Sub Category</p>
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select Sub Category</option>
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="font-medium mb-2">Description</p>
          <textarea
            name="p_description"
            value={formData.p_description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows="4"
            required
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <p className="font-medium mb-3">Sizes</p>
          <div className="flex flex-wrap gap-4">
            {["S", "M", "L", "XL"].map((size) => (
              <div
                key={size}
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    sizes: prev.sizes.includes(size)
                      ? prev.sizes.filter(s => s !== size)
                      : [...prev.sizes, size]
                  }));
                }}
                className={`
                  w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer
                  ${formData.sizes.includes(size) 
                    ? "bg-purple-600 text-white" 
                    : "bg-gray-100 text-gray-700"}
                  transition-colors duration-200 hover:bg-purple-500 hover:text-white
                `}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="bestseller"
                checked={formData.bestseller}
                onChange={handleInputChange}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500"
              />
              <span>Bestseller</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="latestcollection"
                checked={formData.latestcollection}
                onChange={handleInputChange}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500"
              />
              <span>Latest Collection</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/list")}
            className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 
                     transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                     disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;