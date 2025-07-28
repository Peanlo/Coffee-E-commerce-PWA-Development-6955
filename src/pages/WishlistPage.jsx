import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/products/ProductCard';
import { useWishlist } from '../contexts/WishlistContext';

const { FiHeart, FiArrowLeft } = FiIcons;

const WishlistPage = () => {
  const { wishlistItems, clearWishlist } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>Wishlist - Cogli Caffe</title>
          <meta name="description" content="Your saved favorite products at Cogli Caffe" />
        </Helmet>

        <Header />
        <main className="min-h-screen bg-cream-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-12"
            >
              <SafeIcon icon={FiHeart} className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-coffee-800 mb-4">
                Your Wishlist is Empty
              </h1>
              <p className="text-gray-600 mb-8">
                Save your favorite products to your wishlist so you can easily find them later.
              </p>
              <Link to="/products" className="btn-coffee inline-flex items-center gap-2">
                <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
                Start Shopping
              </Link>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Wishlist - Cogli Caffe</title>
        <meta name="description" content="Your saved favorite products at Cogli Caffe" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-cream-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-coffee-800 mb-2">My Wishlist</h1>
              <p className="text-coffee-600">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            
            {wishlistItems.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear your wishlist?')) {
                    clearWishlist();
                  }
                }}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Clear Wishlist
              </button>
            )}
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {wishlistItems.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} viewMode="grid" />
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Link to="/products" className="btn-coffee inline-flex items-center gap-2">
              <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default WishlistPage;