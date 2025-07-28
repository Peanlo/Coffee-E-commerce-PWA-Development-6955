import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import LoadingSpinner from '../common/LoadingSpinner';
import { getOrderById } from '../../services/orderService';
import { useAuth } from '../../contexts/AuthContext';

const { FiPackage, FiTruck, FiCheck, FiClock, FiAlertCircle, FiArrowLeft, FiExternalLink } = FiIcons;

const OrderDetails = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrderById(orderId, user.id);
        setOrder(orderData);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Could not load order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrder();
    }
  }, [orderId, user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <SafeIcon icon={FiClock} className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <SafeIcon icon={FiPackage} className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <SafeIcon icon={FiTruck} className="w-5 h-5 text-green-500" />;
      case 'delivered':
        return <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-600" />;
      case 'canceled':
        return <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-red-500" />;
      default:
        return <SafeIcon icon={FiClock} className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered':
        return 'bg-green-200 text-green-900 border-green-300';
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-cream-50">
          <LoadingSpinner message="Loading order details..." />
        </div>
        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-cream-50 py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <SafeIcon icon={FiAlertCircle} className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
              <p className="text-gray-600 mb-6">{error || "We couldn't find the order you're looking for."}</p>
              <Link to="/account/orders" className="btn-coffee inline-flex items-center">
                <SafeIcon icon={FiArrowLeft} className="mr-2" />
                Back to Orders
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const hasShippingInfo = order.printify_shipping && order.printify_shipping.length > 0;
  const shipping = hasShippingInfo ? order.printify_shipping[0] : null;

  return (
    <>
      <Helmet>
        <title>Order #{orderId.slice(0, 8)} - Cogli Caffe</title>
        <meta name="description" content="View your order details and tracking information" />
      </Helmet>

      <Header />
      
      <main className="min-h-screen bg-cream-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link to="/account/orders" className="text-coffee-600 hover:text-coffee-800 flex items-center">
              <SafeIcon icon={FiArrowLeft} className="mr-2" />
              Back to Orders
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Order Header */}
            <div className="bg-coffee-800 text-white p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Order #{orderId.slice(0, 8)}</h1>
                  <p className="text-cream-200">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-2 font-medium capitalize">{order.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-coffee-800 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <img
                      src={item.products.image}
                      alt={item.products.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-gray-800">{item.products.name}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Information */}
            {shipping && (
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-coffee-800 mb-4">Shipping Information</h2>
                <div className="bg-cream-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <SafeIcon icon={FiTruck} className="w-5 h-5 text-coffee-600 mr-2" />
                    <span className="font-medium">{shipping.carrier}</span>
                  </div>
                  <p className="mb-2">Tracking Number: {shipping.tracking_number}</p>
                  {shipping.tracking_url && (
                    <a
                      href={shipping.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-coffee-600 hover:text-coffee-800 flex items-center"
                    >
                      Track Package
                      <SafeIcon icon={FiExternalLink} className="ml-1 w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-coffee-800 mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${order.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-coffee-600">${order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default OrderDetails;