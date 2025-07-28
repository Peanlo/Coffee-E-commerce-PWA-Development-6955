import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCart } from '../../contexts/CartContext';

const { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag } = FiIcons;

const CartSidebar = () => {
  const {
    cartItems,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeFromCart,
    getCartTotal
  } = useCart();

  const total = getCartTotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-96 max-w-sm bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-coffee-800 flex items-center gap-2">
                <SafeIcon icon={FiShoppingBag} className="w-5 h-5" />
                Shopping Cart ({cartItems.length})
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <SafeIcon icon={FiX} className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <SafeIcon icon={FiShoppingBag} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <Link
                    to="/products"
                    onClick={() => setIsOpen(false)}
                    className="btn-coffee inline-block"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                        <p className="text-coffee-600 font-semibold">${item.price}</p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-gray-500 hover:text-coffee-600 transition-colors"
                          >
                            <SafeIcon icon={FiMinus} className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-1 bg-gray-100 rounded text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-gray-500 hover:text-coffee-600 transition-colors"
                          >
                            <SafeIcon icon={FiPlus} className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-coffee-600">${total.toFixed(2)}</span>
                </div>
                
                <div className="space-y-2">
                  <Link
                    to="/cart"
                    onClick={() => setIsOpen(false)}
                    className="block w-full border border-coffee-300 text-coffee-600 py-3 px-4 rounded-lg hover:bg-coffee-50 transition-colors text-center font-medium"
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="block w-full btn-coffee text-center"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;