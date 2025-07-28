import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import PrintifyProductsSync from './PrintifyProductsSync';

const { FiPackage, FiSettings, FiTruck, FiUsers, FiShoppingBag } = FiIcons;

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-coffee-800 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow p-6 border-l-4 border-coffee-600"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Orders</p>
                  <h3 className="text-3xl font-bold text-coffee-800">24</h3>
                </div>
                <div className="bg-coffee-100 p-3 rounded-full">
                  <SafeIcon icon={FiShoppingBag} className="w-6 h-6 text-coffee-600" />
                </div>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Revenue</p>
                  <h3 className="text-3xl font-bold text-coffee-800">$1,284</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <SafeIcon icon={FiUsers} className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <PrintifyProductsSync />
            
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-semibold text-coffee-800 mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left bg-cream-50">
                      <th className="px-4 py-2 rounded-l-lg">Order ID</th>
                      <th className="px-4 py-2">Customer</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2 rounded-r-lg">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3">#ORD-123</td>
                      <td className="px-4 py-3">John Smith</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Shipped
                        </span>
                      </td>
                      <td className="px-4 py-3">$124.00</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">#ORD-122</td>
                      <td className="px-4 py-3">Sarah Johnson</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          Processing
                        </span>
                      </td>
                      <td className="px-4 py-3">$75.50</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">#ORD-121</td>
                      <td className="px-4 py-3">Robert Davis</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          Paid
                        </span>
                      </td>
                      <td className="px-4 py-3">$246.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-right">
                <Link to="/admin/orders" className="text-coffee-600 hover:text-coffee-800 text-sm font-medium">
                  View all orders →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="space-y-6">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-semibold text-coffee-800 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/admin/products/sync" className="flex items-center p-3 bg-cream-50 hover:bg-cream-100 rounded-lg transition-colors">
                <SafeIcon icon={FiPackage} className="w-5 h-5 text-coffee-600 mr-3" />
                <span>Sync Printify Products</span>
              </Link>
              <Link to="/admin/orders" className="flex items-center p-3 bg-cream-50 hover:bg-cream-100 rounded-lg transition-colors">
                <SafeIcon icon={FiTruck} className="w-5 h-5 text-coffee-600 mr-3" />
                <span>Manage Orders</span>
              </Link>
              <Link to="/admin/settings/printify" className="flex items-center p-3 bg-cream-50 hover:bg-cream-100 rounded-lg transition-colors">
                <SafeIcon icon={FiSettings} className="w-5 h-5 text-coffee-600 mr-3" />
                <span>Printify Settings</span>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-semibold text-coffee-800 mb-4">Printify Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">API Connection</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Sync</span>
                <span className="text-sm text-gray-500">Today, 2:30 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Products Synced</span>
                <span className="text-sm text-gray-500">24 products</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;