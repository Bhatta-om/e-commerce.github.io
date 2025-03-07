// src/pages/Product.jsx
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import Image from "../components/common/Image";
import { toast } from "react-toastify";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const baseUrl = "https://zd88bbhd-5000.inc1.devtunnels.ms/";
  const navigate = useNavigate();

  useEffect(() => {
    if (products && productId) {
      const product = products.find((item) => item._id === productId);
      if (product) {
        setProductData(product);
        setImage(product.image); // Set initial image
      }
    }
  }, [productId, products]);

  if (!productData) {
    return <div>Loading...</div>;
  }

  // Parse sizes safely
  let sizes = [];
  try {
    sizes = JSON.parse(productData.sizes || '[]');
  } catch (e) {
    console.error('Error parsing sizes:', e);
    sizes = [];
  }

  // Get all valid images
  const images = [
    productData.image,
    productData.image_1,
    productData.image_2,
    productData.image_3
  ].filter(Boolean); // Remove null/undefined values

  // Function to handle Shop Now button click
  const handleShopNow = () => {
    if (!size) {
      toast.error("Please select a size before proceeding.");
      return;
    }
    // Navigate to the placeorder page with product data
    navigate("/place-order", {
      state: { 
        product: {
          ...productData,
          size: size
        }
      }
    });
  };

  return (
    <div className="border-t-2 pt-10">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          {/* Thumbnail Images */}
          <div className="flex flex-row sm:flex-col overflow-x-auto sm:overflow-y-auto sm:w-[18.7%] w-full gap-3">
            {images.map((img, index) => (
              <div
                key={index}
                onClick={() => setImage(img)}
                className={`cursor-pointer border-2 ${
                  image === img ? 'border-blue-500' : 'border-gray-200'
                } rounded-lg overflow-hidden min-w-[80px] sm:min-w-0`}
              >
                <img
                  src={`${baseUrl}${img}`}
                  alt={`View ${index + 1}`}
                  className="w-full h-20 object-cover"
                />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className="w-full sm:w-[80%]">
            <img
              src={`${baseUrl}${image}`}
              alt={productData.name}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
            <p className="pl-2">(122)</p>
          </div>

          {/* Price */}
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>

          {/* Description */}
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.p_description}
          </p>

          {/* Size Selection */}
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === size ? "border-orange-500" : ""
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons Container */}
          <div className="flex gap-4">
            {/* Add to Cart Button */}
            <button
              onClick={() => addToCart(productData._id, size)}
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
            >
              ADD TO CART
            </button>

            {/* Shop Now Button */}
            <button
              onClick={handleShopNow}
              className="bg-orange-500 text-white px-8 py-3 text-sm active:bg-orange-600"
            >
              SHOP NOW
            </button>
          </div>

          <hr className="mt-8 sm:w-4/5" />
          
          {/* Product Features */}
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return in 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Review(122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>{productData.p_description}</p>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;