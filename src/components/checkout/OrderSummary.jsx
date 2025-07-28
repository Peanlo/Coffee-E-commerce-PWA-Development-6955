import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiArrowLeft } = FiIcons;

const OrderSummary = ({ cartItems, total, step, onBack }) => {
  const tax = total * 0.08;
  const shipping = 0; // Free shipping
  const finalTotal = total + tax + shipping;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 sticky top-8"
    >
      <h2 className="text-xl font-semibold text-coffee-800 mb-6">Order Summary</h2>

      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-200">
          <span>Total</span>
          <span className="text-coffee-600">${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {step === 'payment' && (
        <button
          onClick={onBack}
          className="mt-6 w-full border border-coffee-300 text-coffee-600 py-3 px-4 rounded-lg hover:bg-coffee-50 transition-colors flex items-center justify-center gap-2"
        >
          <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
          Back to Shipping
        </button>
      )}

      <div className="mt-6 border-t border-gray-200 pt-6">
        <div className="bg-cream-50 rounded-lg p-4">
          <h4 className="font-medium text-coffee-800 mb-2">Secure Checkout</h4>
          <p className="text-sm text-coffee-600">
            Your payment information is processed securely. We do not store credit card details nor have access to your credit card information.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;