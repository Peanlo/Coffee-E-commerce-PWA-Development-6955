import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';

const { FiShoppingCart, FiHeart, FiStar, FiInfo, FiAlertCircle } = FiIcons;

const ProductCard = ({ product, viewMode }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const inWishlist = isInWishlist(product.id);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };
  
  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(139, 69, 19, 0.2)' }}
        className="coffee-card bg-white rounded-xl overflow-hidden shadow-lg"
      >
        <div className="flex flex-col md:flex-row h-full">
          <div className="md:w-1/3 h-64 md:h-auto relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {!product.inStock && (
              <div className="absolute top-0 right-0 bg-red-500 text-white text-sm font-semibold px-3 py-1 m-2 rounded-full">
                Out of Stock
              </div>
            )}
            {product.featured && (
              <div className="absolute top-0 left-0 bg-coffee-600 text-white text-sm font-semibold px-3 py-1 m-2 rounded-full">
                Featured
              </div>
            )}
          </div>
          
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-coffee-800">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1">
                  <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-600">{product.rating}</span>
                </div>
              </div>
              
              <p className="text-coffee-600 mb-4">{product.description}</p>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-coffee-600">${product.price}</span>
                <span className="text-sm text-gray-500">
                  {product.category === 'coffee' ? 'Coffee' : 'Merchandise'}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg ${
                  product.inStock
                    ? 'btn-coffee'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <SafeIcon icon={FiShoppingCart} className="w-4 h-4" />
                Add to Cart
              </button>
              
              <button
                onClick={handleToggleWishlist}
                className={`p-2 rounded-lg ${
                  inWishlist
                    ? 'bg-red-100 text-red-500'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <SafeIcon icon={FiHeart} className="w-5 h-5" />
              </button>
              
              <Link
                to={`/product/${product.id}`}
                className="p-2 bg-gray-100 text-coffee-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <SafeIcon icon={FiInfo} className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(139, 69, 19, 0.2)' }}
      className="coffee-card bg-white rounded-xl overflow-hidden shadow-lg h-full flex flex-col"
    >
      <div className="h-64 relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {!product.inStock && (
          <div className="absolute top-0 right-0 bg-red-500 text-white text-sm font-semibold px-3 py-1 m-2 rounded-full">
            Out of Stock
          </div>
        )}
        {product.featured && (
          <div className="absolute top-0 left-0 bg-coffee-600 text-white text-sm font-semibold px-3 py-1 m-2 rounded-full">
            Featured
          </div>
        )}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 p-2 rounded-full ${
            inWishlist
              ? 'bg-red-100 text-red-500'
              : 'bg-white/80 text-gray-600 hover:bg-white'
          }`}
        >
          <SafeIcon icon={FiHeart} className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-coffee-800">
            {product.name}
          </h3>
          <div className="flex items-center gap-1">
            <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-gray-600">{product.rating}</span>
          </div>
        </div>
        
        <p className="text-coffee-600 mb-4 flex-1">{product.description}</p>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-2xl font-bold text-coffee-600">${product.price}</span>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`flex items-center justify-center gap-1 py-2 px-4 rounded-lg ${
              product.inStock
                ? 'btn-coffee'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <SafeIcon icon={FiShoppingCart} className="w-4 h-4" />
            {product.inStock ? 'Add' : 'Sold Out'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;