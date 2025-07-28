import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/products/ProductCard';
import ProductFilters from '../components/products/ProductFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getProducts } from '../services/productService';

const { FiSearch, FiFilter, FiGrid, FiList } = FiIcons;

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    priceRange: [0, 100],
    sortBy: 'name',
    search: searchParams.get('search') || ''
  });

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { products: fetchedProducts } = await getProducts({
          category: filters.category,
          priceRange: filters.priceRange,
          search: filters.search,
          sortBy: filters.sortBy
        });
        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      rating: product.rating,
      inStock: product.in_stock,
      featured: product.featured
    }));
  }, [products]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));

    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.category && newFilters.category !== 'all') {
      params.set('category', newFilters.category);
    }
    if (newFilters.search) {
      params.set('search', newFilters.search);
    }
    setSearchParams(params);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" message="Loading products..." />
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8">
            <SafeIcon icon={FiAlertCircle} className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-coffee"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Products - Cogli Caffe</title>
        <meta name="description" content="Browse our premium coffee beans and merchandise collection at Cogli Caffe." />
      </Helmet>

      <Header />
      
      <main className="min-h-screen bg-cream-50">
        {/* Page Header */}
        <section className="bg-coffee-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
              <p className="text-xl text-cream-200 max-w-2xl mx-auto">
                Discover our carefully curated selection of premium coffee beans and merchandise
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full btn-coffee flex items-center justify-center gap-2"
                >
                  <SafeIcon icon={FiFilter} className="w-4 h-4" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
              </div>

              <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
                <ProductFilters
                  filters={filters}
                  onFiltersChange={updateFilters}
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Search and View Controls */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={filters.search}
                        onChange={(e) => updateFilters({ search: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500"
                      />
                      <SafeIcon
                        icon={FiSearch}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {filteredProducts.length} products found
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded ${
                          viewMode === 'grid'
                            ? 'bg-coffee-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <SafeIcon icon={FiGrid} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded ${
                          viewMode === 'list'
                            ? 'bg-coffee-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <SafeIcon icon={FiList} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Display */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <SafeIcon icon={FiSearch} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search terms.</p>
                </div>
              ) : (
                <motion.div
                  layout
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ProductCard product={product} viewMode={viewMode} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProductsPage;