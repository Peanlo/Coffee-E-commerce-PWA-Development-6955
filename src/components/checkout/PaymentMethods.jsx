import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCreditCard, FiDollarSign } = FiIcons;

const PaymentMethods = ({ onPaymentComplete, amount }) => {
  const [selectedMethod, setSelectedMethod] = useState('stripe');

  // For this demo, we'll simulate payment methods without actual implementations
  const handleStripePayment = async () => {
    // Simulate successful payment
    await new Promise(resolve => setTimeout(resolve, 1500));
    onPaymentComplete({
      id: 'pm_' + Math.random().toString(36).substring(2, 15),
      amount: amount,
      status: 'succeeded',
      type: 'stripe'
    });
  };

  const handlePayPalPayment = async () => {
    // Simulate successful payment
    await new Promise(resolve => setTimeout(resolve, 1500));
    onPaymentComplete({
      id: 'paypal_' + Math.random().toString(36).substring(2, 15),
      amount: amount,
      status: 'COMPLETED',
      type: 'paypal'
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedMethod('stripe')}
          className={`p-4 rounded-lg border-2 flex items-center justify-center gap-2 ${
            selectedMethod === 'stripe'
              ? 'border-coffee-600 bg-coffee-50'
              : 'border-gray-200 hover:border-coffee-300'
          }`}
        >
          <SafeIcon icon={FiCreditCard} className="w-5 h-5" />
          <span className="font-medium">Credit Card</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedMethod('paypal')}
          className={`p-4 rounded-lg border-2 flex items-center justify-center gap-2 ${
            selectedMethod === 'paypal'
              ? 'border-coffee-600 bg-coffee-50'
              : 'border-gray-200 hover:border-coffee-300'
          }`}
        >
          <SafeIcon icon={FiDollarSign} className="w-5 h-5" />
          <span className="font-medium">PayPal</span>
        </motion.button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {selectedMethod === 'stripe' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-coffee-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full py-3 px-4 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-coffee-700 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full py-3 px-4 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-700 mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full py-3 px-4 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleStripePayment}
              className="w-full btn-coffee py-3 flex items-center justify-center"
            >
              Pay ${(amount / 100).toFixed(2)}
            </button>
          </div>
        )}

        {selectedMethod === 'paypal' && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <img
                src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png"
                alt="PayPal"
                className="h-8 mx-auto mb-4"
              />
              <p className="text-sm text-gray-600 mb-4">
                Click the button below to complete payment with PayPal.
              </p>
            </div>

            <button
              onClick={handlePayPalPayment}
              className="w-full bg-[#0070ba] text-white py-3 px-4 rounded-lg hover:bg-[#003087] transition-colors flex items-center justify-center"
            >
              Pay with PayPal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethods;