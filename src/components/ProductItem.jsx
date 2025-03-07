import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from "react-router-dom";
import Image from './common/Image';

const ProductItem = ({ id, image, name, price }) => {
    const { currency } = useContext(ShopContext);
    const baseUrl = 'https://zd88bbhd-5000.inc1.devtunnels.ms/';

    return (
        <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
            {/* Image Wrapper with fixed aspect ratio */}
            <div className="w-full aspect-[1/1] overflow-hidden flex items-center justify-center bg-gray-100">
                <Image 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
                    src={`${baseUrl}${image}`} 
                    alt={name} 
                />
            </div>
            <p className='pt-3 pb-1 text-sm text-center'>{name}</p>
            <p className='text-sm font-medium text-center'>{currency}{price}</p>
        </Link>
    );
};

export default ProductItem;
