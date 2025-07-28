import React from 'react';
import {Link,useLocation} from 'react-router-dom';
import {motion,AnimatePresence} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {useAuth} from '../../contexts/AuthContext';

const {FiX,FiUser,FiLogOut,FiSearch}=FiIcons;

const MobileMenu=({isOpen,onClose,navLinks,logo})=> {
  const location=useLocation();
  const {user,logout}=useAuth();

  const handleLogout=()=> {
    logout();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            initial={{x: '100%'}}
            animate={{x: 0}}
            exit={{x: '100%'}}
            transition={{type: 'tween',duration: 0.3}}
            className="fixed top-0 right-0 h-full w-80 max-w-sm bg-white shadow-xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Link to="/" onClick={onClose} className="flex items-center">
                <img
                  src={logo}
                  alt="Cogli Caffe"
                  className="h-10 w-auto"
                />
              </Link>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <SafeIcon icon={FiX} className="w-6 h-6" />
              </button>
            </div>

            {/* Search */}
            <div className="p-6 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 border border-coffee-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-500"
                />
                <SafeIcon
                  icon={FiSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400 w-5 h-5"
                />
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="py-6">
              {navLinks.map((link,index)=> (
                <motion.div
                  key={link.to}
                  initial={{opacity: 0,x: 20}}
                  animate={{opacity: 1,x: 0}}
                  transition={{delay: index * 0.1}}
                >
                  <Link
                    to={link.to}
                    onClick={onClose}
                    className={`block px-6 py-3 text-base font-medium transition-colors ${
                      location.pathname===link.to
                        ? 'text-coffee-600 bg-coffee-50 border-r-2 border-coffee-600'
                        : 'text-gray-700 hover:text-coffee-600 hover:bg-coffee-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* User Section */}
            <div className="border-t border-gray-200 p-6">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-coffee-600 rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiUser} className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.name || user.username}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Link
                      to="/account"
                      onClick={onClose}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-coffee-50 rounded-lg transition-colors"
                    >
                      My Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-coffee-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <SafeIcon icon={FiLogOut} className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="block w-full btn-coffee text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={onClose}
                    className="block w-full border border-coffee-300 text-coffee-600 py-2 px-4 rounded-lg hover:bg-coffee-50 transition-colors text-center"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;