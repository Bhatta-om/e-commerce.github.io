// src/pages/Collection.jsx
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { FiFilter } from 'react-icons/fi';

const Collection = () => {
    const { products, search, showSearch } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState('relevant');

    useEffect(() => {
        if (products) {
            setFilterProducts(products);
        }
    }, [products]);

    const toggleCategory = (e) => {
        if (category.includes(e.target.value)) {
            setCategory(prev => prev.filter(item => item !== e.target.value));
        } else {
            setCategory(prev => [...prev, e.target.value]);
        }
    };

    const toggleSubCategory = (e) => {
        if (subCategory.includes(e.target.value)) {
            setSubCategory(prev => prev.filter(item => item !== e.target.value));
        } else {
            setSubCategory(prev => [...prev, e.target.value]);
        }
    };

    const applyFilter = useCallback(() => {
        let productCopy = products ? [...products] : [];

        if (showSearch && search) {
            productCopy = productCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
        }

        if (category.length > 0) {
            productCopy = productCopy.filter(item => category.includes(item.category));
        }

        if (subCategory.length > 0) {
            productCopy = productCopy.filter(item => subCategory.includes(item.subCategory));
        }

        // Apply sorting
        switch (sortType) {
            case 'low-high':
                productCopy.sort((a, b) => (a.price - b.price));
                break;

            case 'high-low':
                productCopy.sort((a, b) => (b.price - a.price));
                break;

            default:
                break;
        }

        setFilterProducts(productCopy);
    }, [products, category, subCategory, search, showSearch, sortType]);

    // Apply filters and sorting when dependencies change
    useEffect(() => {
        applyFilter();
    }, [applyFilter]);

    // Debug logging
    useEffect(() => {
        console.log('Current filters:', {
            categories: category,
            subCategories: subCategory,
            productsCount: filterProducts.length
        });
    }, [category, subCategory, filterProducts]);

    return (
        <div className='container mx-auto px-4 py-16'>
            <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
                <div className='min-w-60'>
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className='my-2 text-xl flex items-center cursor-pointer gap-2 hover:text-blue-500'
                    >
                        <FiFilter />
                        FILTER
                    </button>

                    <div className={`border border-gray-400 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden sm:block'}`}>
                        <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
                        <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                            <label className='flex gap-2 cursor-pointer hover:text-blue-500'>
                                <input 
                                    className='w-3' 
                                    type="checkbox" 
                                    value='Men' 
                                    checked={category.includes('Men')}
                                    onChange={toggleCategory} 
                                />
                                Men
                            </label>

                            <label className='flex gap-2 cursor-pointer hover:text-blue-500'>
                                <input 
                                    className='w-3' 
                                    type="checkbox" 
                                    value='Women' 
                                    checked={category.includes('Women')}
                                    onChange={toggleCategory} 
                                />
                                Women
                            </label>

                            <label className='flex gap-2 cursor-pointer hover:text-blue-500'>
                                <input 
                                    className='w-3' 
                                    type="checkbox" 
                                    value='Kids' 
                                    checked={category.includes('Kids')}
                                    onChange={toggleCategory} 
                                />
                                Kids
                            </label>
                        </div>
                    </div>

                    <div className={`border border-gray-400 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden sm:block'}`}>
                        <p className='mb-3 text-sm font-medium'>TYPE</p>
                        <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                            <label className='flex gap-2 cursor-pointer hover:text-blue-500'>
                                <input 
                                    className='w-3' 
                                    type="checkbox" 
                                    value='Topwear' 
                                    checked={subCategory.includes('Topwear')}
                                    onChange={toggleSubCategory} 
                                />
                                Topwear
                            </label>

                            <label className='flex gap-2 cursor-pointer hover:text-blue-500'>
                                <input 
                                    className='w-3' 
                                    type="checkbox" 
                                    value='Bottomwear' 
                                    checked={subCategory.includes('Bottomwear')}
                                    onChange={toggleSubCategory} 
                                />
                                Bottomwear
                            </label>

                            <label className='flex gap-2 cursor-pointer hover:text-blue-500'>
                                <input 
                                    className='w-3' 
                                    type="checkbox" 
                                    value='Winterwear' 
                                    checked={subCategory.includes('Winterwear')}
                                    onChange={toggleSubCategory} 
                                />
                                Winterwear
                            </label>
                        </div>
                    </div>
                </div>

                <div className='flex-1'>
                    <div className='flex justify-between items-center mb-6'>
                        <Title text1={'ALL'} text2={'COLLECTION'} />

                        <select
                            onChange={(e) => setSortType(e.target.value)}
                            className='border-2 border-gray-300 text-sm px-4 py-2 rounded-md focus:outline-none focus:border-blue-500'
                        >
                            <option value="relevant">Sort by: Relevant</option>
                            <option value="low-high">Sort by: Low to High</option>
                            <option value="high-low">Sort by: High to Low</option>
                        </select>
                    </div>

                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                        {filterProducts && filterProducts.length > 0 ? (
                            filterProducts.map((item, index) => (
                                <ProductItem
                                    key={item._id || index}
                                    id={item._id}
                                    name={item.name}
                                    price={item.price}
                                    image={item.image}
                                />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500">No products found</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Collection;