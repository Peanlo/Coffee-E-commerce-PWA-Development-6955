import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../contexts/AuthContext';
import { getUserOrders } from '../services/orderService';
import toast from 'react-hot-toast';

const { FiUser, FiShoppingBag, FiMapPin, FiLock, FiSave, FiEye } = FiIcons;

const AccountPage = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const userOrders = await getUserOrders(user.id);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const { success, error } = await updateProfile(profileData);
      if (success) {
        toast.success('Profile updated successfully');
      } else {
        toast.error(error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      const { success, error } = await changePassword(passwordData.newPassword);
      if (success) {
        toast.success('Password changed successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(error || 'Failed to change password');
      }
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'orders', label: 'Orders', icon: FiShoppingBag },
    { id: 'security', label: 'Security', icon: FiLock }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-green-200 text-green-900';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Helmet>
        <title>My Account - Cogli Caffe</title>
        <meta name="description" content="Manage your account, view orders, and update your profile" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-cream-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-coffee-800">My Account</h1>
            <p className="text-coffee-600 mt-2">Welcome back, {user?.name}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-coffee-600 text-white'
                          : 'text-coffee-600 hover:bg-coffee-50'
                      }`}
                    >
                      <SafeIcon icon={tab.icon} className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg p-8">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-2xl font-semibold text-coffee-800 mb-6">
                      Profile Information
                    </h2>
                    
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-coffee-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full py-3 px-4 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-coffee-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full py-3 px-4 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-coffee-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full py-3 px-4 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-coffee-700 mb-1">
                            Address
                          </label>
                          <input
                            type="text"
                            value={profileData.address}
                            onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                            className="w-full py-3 px-4 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn-coffee flex items-center gap-2"
                      >
                        <SafeIcon icon={FiSave} className="w-4 h-4" />
                        Save Changes
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-2xl font-semibold text-coffee-800 mb-6">
                      Order History
                    </h2>
                    
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="w-8 h-8 border-2 border-coffee-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-2 text-coffee-600">Loading orders...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-12">
                        <SafeIcon icon={FiShoppingBag} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No orders found</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-semibold text-coffee-800">
                                  Order #{order.id.slice(0, 8)}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                                <button className="text-coffee-600 hover:text-coffee-800">
                                  <SafeIcon icon={FiEye} className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              {order.order_items?.map((item) => (
                                <div key={item.id} className="flex items-center space-x-4">
                                  <img
                                    src={item.products?.image}
                                    alt={item.products?.name}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                  <div className="flex-1">
                                    <p className="font-medium">{item.products?.name}</p>
                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                  </div>
                                  <span className="font-medium">${item.price}</span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
                              <span className="font-semibold">Total</span>
                              <span className="font-semibold text-coffee-600">
                                ${order.total_amount}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-2xl font-semibold text-coffee-800 mb-6">
                      Change Password
                    </h2>
                    
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-coffee-700 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="w-full py-3 px-4 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-coffee-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full py-3 px-4 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                          required
                          minLength={8}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-coffee-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full py-3 px-4 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                          required
                          minLength={8}
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn-coffee flex items-center gap-2"
                      >
                        <SafeIcon icon={FiLock} className="w-4 h-4" />
                        Change Password
                      </button>
                    </form>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AccountPage;