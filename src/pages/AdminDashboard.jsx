import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Dashboard from '../components/admin/Dashboard';
import AdminSidebar from '../components/admin/AdminSidebar';
import AIAdminAssistant from '../components/admin/AIAdminAssistant';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Cogli Caffe</title>
        <meta name="description" content="Admin dashboard for managing Cogli Caffe" />
      </Helmet>
      
      <div className="flex min-h-screen bg-cream-50">
        <div className="w-64 flex-shrink-0">
          <AdminSidebar onLogout={handleLogout} />
        </div>
        
        <div className="flex-1">
          {/* Header */}
          <section className="bg-coffee-800 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-cream-200 mt-1">
                  Manage your store, orders, and settings
                </p>
              </motion.div>
            </div>
          </section>
          
          {/* Dashboard Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Dashboard />
          </div>
        </div>
        
        {/* AI Admin Assistant */}
        <AIAdminAssistant />
      </div>
    </>
  );
};

export default AdminDashboard;