import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useCart } from '../contexts/CartContext';

const { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiArrowRight, FiArrowLeft } = FiIcons;

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const total = getCartTotal();

  if (cartItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>Shopping Cart - Cogli Caffe</title>
          <meta name="description" content="Your shopping cart at Cogli Caffe" />
        </Helmet>

        <Header />
        <main className="min-h-screen bg-cream-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-12"
            >
              <SafeIcon icon={FiShoppingCart} className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-coffee-800 mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link to="/products" className="btn-coffee inline-flex items-center gap-2">
                <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
                Continue Shopping
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
        <title>Shopping Cart - Cogli Caffe</title>
        <meta name="description" content="Review your items and proceed to checkout" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-cream-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-coffee-800 mb-2">Shopping Cart</h1>
            <p className="text-coffee-600">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-coffee-800 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-coffee-600 text-sm mb-2">
                        {item.description?.slice(0, 100)}...
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-coffee-600">
                          ${item.price}
                        </span>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                            >
                              <SafeIcon icon={FiMinus} className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                            >
                              <SafeIcon icon={FiPlus} className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 sticky top-8"
              >
                <h2 className="text-xl font-semibold text-coffee-800 mb-6">
                  Order Summary
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${(total * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-coffee-600">
                        ${(total * 1.08).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    to="/checkout"
                    className="w-full btn-coffee text-center flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
                  </Link>
                  
                  <Link
                    to="/products"
                    className="w-full border border-coffee-300 text-coffee-600 py-3 px-4 rounded-lg hover:bg-coffee-50 transition-colors text-center font-medium flex items-center justify-center gap-2"
                  >
                    <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
                    Continue Shopping
                  </Link>
                </div>

                {/* Promo Code */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                  </h3>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500"
                    />
                    <button className="px-4 py-2 bg-coffee-100 text-coffee-600 rounded-lg hover:bg-coffee-200 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CartPage;