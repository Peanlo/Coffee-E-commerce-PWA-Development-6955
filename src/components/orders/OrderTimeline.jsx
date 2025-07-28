import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { syncPrintifyOrderStatus } from '../../services/printifyService';

const { FiPackage, FiTruck, FiCheck, FiClock, FiCreditCard, FiBox, FiExternalLink, FiRefreshCw } = FiIcons;

const OrderTimeline = ({ order }) => {
  const [syncing, setSyncing] = useState(false);
  const [printifyStatus, setPrintifyStatus] = useState(null);

  // Sync Printify status on component mount if order has Printify integration
  useEffect(() => {
    if (order.printify_order_id) {
      handleSyncStatus();
    }
  }, [order.printify_order_id]);

  const handleSyncStatus = async () => {
    if (!order.printify_order_id) return;
    
    setSyncing(true);
    try {
      const syncResult = await syncPrintifyOrderStatus(order.id);
      setPrintifyStatus(syncResult);
    } catch (error) {
      console.error('Error syncing Printify status:', error);
    } finally {
      setSyncing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <SafeIcon icon={FiCreditCard} className="w-6 h-6 text-yellow-500" />;
      case 'processing':
        return <SafeIcon icon={FiPackage} className="w-6 h-6 text-blue-500" />;
      case 'shipped':
        return <SafeIcon icon={FiTruck} className="w-6 h-6 text-green-500" />;
      case 'delivered':
        return <SafeIcon icon={FiCheck} className="w-6 h-6 text-green-600" />;
      default:
        return <SafeIcon icon={FiClock} className="w-6 h-6 text-gray-500" />;
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
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const orderStatuses = [
    { status: 'paid', label: 'Order Placed', date: order.created_at },
    { status: 'processing', label: 'Processing', date: order.processing_date },
    { status: 'shipped', label: 'Shipped', date: order.shipped_date },
    { status: 'delivered', label: 'Delivered', date: order.delivered_date }
  ];

  const currentStatusIndex = orderStatuses.findIndex(s => s.status === order.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-semibold text-coffee-800">
            Order #{order.id.slice(0, 8)}
          </h2>
          <p className="text-coffee-600">
            Placed on {new Date(order.created_at).toLocaleDateString()}
          </p>
          {order.printify_order_id && (
            <p className="text-sm text-gray-500 mt-1">
              Printify Order ID: {order.printify_order_id}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-full ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="ml-2 font-medium capitalize">{order.status}</span>
          </div>
          {order.printify_order_id && (
            <button
              onClick={handleSyncStatus}
              disabled={syncing}
              className="p-2 text-coffee-600 hover:text-coffee-800 hover:bg-coffee-50 rounded-lg transition-colors"
              title="Sync with Printify"
            >
              <SafeIcon 
                icon={FiRefreshCw} 
                className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} 
              />
            </button>
          )}
        </div>
      </div>

      {/* Printify Status Display */}
      {printifyStatus && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-800">Printify Status</h3>
              <p className="text-blue-600 capitalize">{printifyStatus.printifyStatus}</p>
            </div>
            {printifyStatus.shipments && printifyStatus.shipments.length > 0 && (
              <div className="text-right">
                <p className="text-sm text-blue-600">
                  {printifyStatus.shipments.length} shipment(s)
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Timeline */}
        <div className="relative">
          {orderStatuses.map((status, index) => (
            <div key={status.status} className="flex items-start mb-8 last:mb-0">
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStatusIndex
                      ? 'bg-coffee-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {getStatusIcon(status.status)}
                </motion.div>
                {index < orderStatuses.length - 1 && (
                  <div
                    className={`absolute left-4 top-8 w-0.5 h-16 ${
                      index < currentStatusIndex ? 'bg-coffee-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
              <div className="ml-6">
                <h3 className="font-medium text-gray-900">{status.label}</h3>
                {status.date && (
                  <p className="text-sm text-gray-500">
                    {new Date(status.date).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order Items */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-coffee-800 mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.order_items?.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {item.products?.image ? (
                    <img
                      src={item.products.image}
                      alt={item.products?.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <SafeIcon icon={FiBox} className="w-8 h-8 text-coffee-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.products?.name}</h4>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <span className="font-medium">${item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Information */}
        {(order.printify_shipping && order.printify_shipping.length > 0) || 
         (printifyStatus?.shipments && printifyStatus.shipments.length > 0) && (
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-coffee-800 mb-4">
              Shipping Information
            </h3>
            
            {/* Database shipping info */}
            {order.printify_shipping && order.printify_shipping.map((shipping, index) => (
              <div key={index} className="bg-cream-50 p-4 rounded-lg mb-4">
                <div className="flex items-center mb-2">
                  <SafeIcon icon={FiTruck} className="w-5 h-5 text-coffee-600 mr-2" />
                  <span className="font-medium">{shipping.carrier}</span>
                </div>
                <p className="mb-2">
                  Tracking Number: {shipping.tracking_number}
                </p>
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
            ))}

            {/* Real-time Printify shipping info */}
            {printifyStatus?.shipments && printifyStatus.shipments.map((shipment, index) => (
              <div key={`printify-${index}`} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <SafeIcon icon={FiTruck} className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium">{shipment.carrier}</span>
                  </div>
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    Live from Printify
                  </span>
                </div>
                {shipment.tracking_number && (
                  <p className="mb-2">
                    Tracking Number: {shipment.tracking_number}
                  </p>
                )}
                {shipment.tracking_url && (
                  <a
                    href={shipment.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    Track Package
                    <SafeIcon icon={FiExternalLink} className="ml-1 w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OrderTimeline;