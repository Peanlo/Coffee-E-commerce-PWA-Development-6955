import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from './SafeIcon';

const { FiX, FiCoffee, FiGift, FiArrowRight } = FiIcons;

const PromotionalBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="bg-gradient-to-r from-coffee-700 via-coffee-600 to-coffee-500 text-white py-3 px-4 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="flex items-center justify-center h-full">
              <SafeIcon icon={FiCoffee} className="w-32 h-32 text-white transform rotate-12" />
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto flex items-center justify-between">
            {/* Left Content */}
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-2 rounded-full">
                <SafeIcon icon={FiGift} className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                <span className="font-semibold text-lg">
                  Free Shipping on All Orders
                </span>
                <span className="text-cream-200 text-sm">
                  • Premium Coffee Delivered Fresh
                </span>
              </div>
            </div>

            {/* Right Content */}
            <div className="flex items-center space-x-4">
              <Link
                to="/products"
                className="hidden sm:flex items-center space-x-2 bg-white text-coffee-700 px-4 py-2 rounded-lg font-medium hover:bg-cream-100 transition-colors"
              >
                <span>Shop Now</span>
                <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
              </Link>
              
              <button
                onClick={() => setIsVisible(false)}
                className="text-white/80 hover:text-white transition-colors p-1"
                aria-label="Close banner"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile CTA */}
          <div className="sm:hidden mt-3 text-center">
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-white text-coffee-700 px-4 py-2 rounded-lg font-medium hover:bg-cream-100 transition-colors"
            >
              <span>Shop Now</span>
              <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PromotionalBanner;