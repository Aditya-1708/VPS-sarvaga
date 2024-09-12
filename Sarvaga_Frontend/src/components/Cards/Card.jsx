import React from 'react';
import { useNavigate } from 'react-router-dom';

const Card = ({ product }) => {
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/description/${id}`);
  };

  return (
    <div 
      onClick={() => handleClick(product.id)} 
      className="w-full max-w-sm h-80 md:h-96 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform transition-transform hover:scale-105 bg-white m-4 group cursor-pointer"
    >
      <div className="relative w-full h-full bg-gray-100 overflow-hidden rounded-lg">
        {product?.images && product.images.length > 0 ? (
          <img
            src={`https://api.sarvagafashions.com${product.images[0].url}`}
            alt={product.productName}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-200 rounded-lg">
            No Image Available
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-transparent to-transparent p-4 rounded-b-lg">
          <div className="font-semibold text-lg text-white group-hover:text-yellow-400 transition-colors">
            {product.productName}
          </div>
          <div className="flex items-center justify-between mt-2 space-x-2">
            <span className="text-yellow-400 font-bold text-lg whitespace-nowrap">₹{product.price}</span>
            <button 
              className="text-white bg-yellow-400 bg-opacity-80 border border-yellow-400 rounded-lg px-3 py-1 text-sm hover:bg-opacity-100 hover:text-black transition-colors"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
