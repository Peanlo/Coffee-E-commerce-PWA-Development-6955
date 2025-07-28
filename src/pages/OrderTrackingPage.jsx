import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import OrderTimeline from '../components/orders/OrderTimeline';
import { getOrderById } from '../services/orderService';

const { FiSearch, FiAlertCircle } = FiIcons;

const OrderTrackingPage = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      setError('Please enter an order number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData = await getOrderById(orderNumber);
      setOrder(orderData);
    } catch (err) {
      setError('Order not found. Please check your order number and try again.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Track Order - Cogli Caffe</title>
        <meta name="description" content="Track your Cogli Caffe order status and shipping information" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-cream-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-coffee-800">Track Your Order</h1>
            <p className="text-coffee-600 mt-2">
              Enter your order number to track your shipment
            </p>
          </motion.div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Enter your order number"
                  className="w-full pl-10 pr-4 py-3 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                />
                <SafeIcon
                  icon={FiSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-coffee mt-4"
              >
                {loading ? 'Searching...' : 'Track Order'}
              </button>
            </form>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-8"
            >
              <div className="flex items-center">
                <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </motion.div>
          )}

          {order && <OrderTimeline order={order} />}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default OrderTrackingPage;