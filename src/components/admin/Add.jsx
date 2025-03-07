// src/components/admin/Add.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets"; // Assuming this is correct
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [image, setImage] = useState(null);
  const [image_1, setImage_1] = useState(null);
  const [image_2, setImage_2] = useState(null);
  const [image_3, setImage_3] = useState(null);

  const [name, setName] = useState("");
  const [p_description, setP_description] = useState("");
  const [price, setPrice] = useState("");
  const [no_of_products, setNoOfProducts] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [bestseller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [latestcollection, setLatestCollection] = useState(false);
  const [color, setColor] = useState("");

  const navigate = useNavigate();

  const validatePrice = (price) => {
    return price > 0;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!validatePrice(price)) {
      toast.error("Price must be a positive number");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("p_description", p_description);
      formData.append("no_of_products", no_of_products);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subcategory", subcategory);
      formData.append("bestseller", bestseller);
      formData.append("latestcollection", latestcollection);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("color", color);

      // Log form data for debugging
      console.log("Form Data:", {
        name,
        p_description,
        no_of_products,
        price,
        category,
        subcategory,
        bestseller,
        latestcollection: latestcollection,
        sizes,
        color,
      });

      if (image) formData.append("image", image);
      if (image_1) formData.append("image_1", image_1);
      if (image_2) formData.append("image_2", image_2);
      if (image_3) formData.append("image_3", image_3);

      const response = await fetch(
        "https://zd88bbhd-5000.inc1.devtunnels.ms/api/products/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        toast.success(responseData.message);
        setName("");
        setP_description("");
        setImage(null);
        setImage_1(null);
        setImage_2(null);
        setImage_3(null);
        setPrice("");
        setNoOfProducts("");
        setCategory("");
        setSubcategory("");
        setBestSeller(false);
        setLatestCollection(false);
        setSizes([]);
        setColor("");
        navigate("/dashboard"); // Navigate to dashboard after successful addition
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form
      className="flex flex-col w-full items-start gap-3"
      onSubmit={onSubmitHandler}
    >
      <div>
        <p className="flex gap-2">Upload Image</p>
        <div className="flex gap-2">
          <label
            htmlFor="image"
            className="border-2 border-black hover:border-blue-500 cursor-pointer transition"
          >
            <img
              className="w-20"
              src={!image ? assets.image_upload : URL.createObjectURL(image)}
              alt=""
            />
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
            />
          </label>
          <label
            htmlFor="image_1"
            className="border-2 border-black hover:border-blue-500 cursor-pointer transition"
          >
            <img
              className="w-20"
              src={
                !image_1 ? assets.image_upload : URL.createObjectURL(image_1)
              }
              alt=""
            />
            <input
              onChange={(e) => setImage_1(e.target.files[0])}
              type="file"
              id="image_1"
              hidden
            />
          </label>
          <label
            htmlFor="image_2"
            className="border-2 border-black hover:border-blue-500 cursor-pointer transition"
          >
            <img
              className="w-20"
              src={
                !image_2 ? assets.image_upload : URL.createObjectURL(image_2)
              }
              alt=""
            />
            <input
              onChange={(e) => setImage_2(e.target.files[0])}
              type="file"
              id="image_2"
              hidden
            />
          </label>
          <label
            htmlFor="image_3"
            className="border-2 border-black hover:border-blue-500 cursor-pointer transition"
          >
            <img
              className="w-20"
              src={
                !image_3 ? assets.image_upload : URL.createObjectURL(image_3)
              }
              alt=""
            />
            <input
              onChange={(e) => setImage_3(e.target.files[0])}
              type="file"
              id="image_3"
              hidden
            />
          </label>
        </div>
      </div>
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Color</p>
        <input
          onChange={(e) => setColor(e.target.value)}
          value={color}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setP_description(e.target.value)}
          value={p_description}
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Write content here"
          required
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full px-3 py-2"
          >
            <option value="">Select Category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Sub Category</p>
          <select
            onChange={(e) => setSubcategory(e.target.value)}
            value={subcategory}
            className="w-full px-3 py-2"
          >
            <option value="">Select Sub Category</option>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="Price"
            required
          />
        </div>
      </div>
      <div className="w-full">
        <p className="mb-2">Number of Products</p>
        <input
          onChange={(e) => setNoOfProducts(e.target.value)}
          value={no_of_products}
          className="w-full px-3 py-2 sm:w-[120px]"
          type="number"
          placeholder="Number of Products"
          required
        />
      </div>
      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL"].map((size) => (
            <div
              key={size}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size]
                )
              }
            >
              <p
                className={`${
                  sizes.includes(size) ? "bg-purple-600" : "bg-slate-200"
                } px-3 py-2 cursor-pointer`}
              >
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestSeller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>

      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setLatestCollection((prev) => !prev)}
          checked={latestcollection}
          type="checkbox"
          id="latestcollection"
        />
        <label className="cursor-pointer" htmlFor="latestcollection">
          Add to latest collection
        </label>
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-purple-600 text-white">
        ADD
      </button>
    </form>
  );
};

export default Add;
