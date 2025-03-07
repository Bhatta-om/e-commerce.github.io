import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Image = ({ src, alt, className = '', onClick, fallback = '/placeholder.jpg' }) => {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={clsx('transition ease-in-out', className)}
            onClick={onClick}
            onError={() => {
                setImgSrc(fallback);
                console.error(`Failed to load image: ${src}, using fallback: ${fallback}`);
            }}
            loading="lazy"
        />
    );
};

Image.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    fallback: PropTypes.string,
};

export default Image;