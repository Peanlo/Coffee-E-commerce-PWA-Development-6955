import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiFilter, FiChevronDown, FiChevronUp, FiDollarSign, FiTag } = FiIcons;

const ProductFilters = ({ filters, onFiltersChange }) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    sort: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (category) => {
    onFiltersChange({ category });
  };

  const handlePriceChange = (range) => {
    onFiltersChange({ priceRange: range });
  };

  const handleSortChange = (sortBy) => {
    onFiltersChange({ sortBy });
  };

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'coffee', name: 'Coffee Beans' },
    { id: 'merchandise', name: 'Merchandise' }
  ];

  const priceRanges = [
    { id: 'all', range: [0, 100], label: 'All Prices' },
    { id: 'under-20', range: [0, 20], label: 'Under $20' },
    { id: '20-30', range: [20, 30], label: '$20 - $30' },
    { id: 'over-30', range: [30, 100], label: 'Over $30' }
  ];

  const sortOptions = [
    { id: 'name', label: 'Name (A-Z)' },
    { id: 'price-low', label: 'Price (Low to High)' },
    { id: 'price-high', label: 'Price (High to Low)' },
    { id: 'rating', label: 'Customer Rating' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <SafeIcon icon={FiFilter} className="w-5 h-5 text-coffee-600" />
        <h2 className="text-lg font-semibold text-coffee-800">Filters</h2>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between text-left mb-2"
        >
          <div className="flex items-center gap-2">
            <SafeIcon icon={FiTag} className="w-4 h-4 text-coffee-500" />
            <span className="font-medium text-coffee-800">Categories</span>
          </div>
          <SafeIcon 
            icon={expandedSections.categories ? FiChevronUp : FiChevronDown} 
            className="w-4 h-4 text-gray-500"
          />
        </button>

        {expandedSections.categories && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2 ml-6"
          >
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === category.id}
                  onChange={() => handleCategoryChange(category.id)}
                  className="form-radio text-coffee-600"
                />
                <span className="text-gray-700">{category.name}</span>
              </label>
            ))}
          </motion.div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-left mb-2"
        >
          <div className="flex items-center gap-2">
            <SafeIcon icon={FiDollarSign} className="w-4 h-4 text-coffee-500" />
            <span className="font-medium text-coffee-800">Price Range</span>
          </div>
          <SafeIcon 
            icon={expandedSections.price ? FiChevronUp : FiChevronDown} 
            className="w-4 h-4 text-gray-500"
          />
        </button>

        {expandedSections.price && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2 ml-6"
          >
            {priceRanges.map((price) => (
              <label key={price.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  checked={
                    filters.priceRange[0] === price.range[0] && 
                    filters.priceRange[1] === price.range[1]
                  }
                  onChange={() => handlePriceChange(price.range)}
                  className="form-radio text-coffee-600"
                />
                <span className="text-gray-700">{price.label}</span>
              </label>
            ))}
          </motion.div>
        )}
      </div>

      {/* Sort */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('sort')}
          className="w-full flex items-center justify-between text-left mb-2"
        >
          <div className="flex items-center gap-2">
            <SafeIcon icon={FiFilter} className="w-4 h-4 text-coffee-500" />
            <span className="font-medium text-coffee-800">Sort By</span>
          </div>
          <SafeIcon 
            icon={expandedSections.sort ? FiChevronUp : FiChevronDown} 
            className="w-4 h-4 text-gray-500"
          />
        </button>

        {expandedSections.sort && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2 ml-6"
          >
            {sortOptions.map((option) => (
              <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sort"
                  checked={filters.sortBy === option.id}
                  onChange={() => handleSortChange(option.id)}
                  className="form-radio text-coffee-600"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </motion.div>
        )}
      </div>

      <button
        onClick={() => onFiltersChange({ 
          category: 'all', 
          priceRange: [0, 100], 
          sortBy: 'name',
          search: ''
        })}
        className="w-full py-2 px-4 border border-coffee-300 text-coffee-600 rounded-lg hover:bg-coffee-50 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default ProductFilters;