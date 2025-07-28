import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AdminHelp from '../components/admin/AdminHelp';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminHelpPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>Admin Help & User Manual - Cogli Caffe</title>
        <meta name="description" content="Admin user manual and help center for Cogli Caffe" />
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
                <div className="flex items-center">
                  <SafeIcon icon={FiIcons.FiHelpCircle} className="w-6 h-6 mr-3" />
                  <h1 className="text-2xl font-bold">Help & User Manual</h1>
                </div>
                <p className="text-cream-200 mt-1">
                  Comprehensive guide to using the admin panel
                </p>
              </motion.div>
            </div>
          </section>
          
          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminHelp />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHelpPage;