import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { usePWA } from '../../contexts/PWAContext';

const { FiRefreshCw, FiX } = FiIcons;

const PWAUpdateNotification = () => {
  const { updateAvailable, updateApp } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  const handleUpdate = () => {
    updateApp();
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  if (!updateAvailable || isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-coffee-600 text-white rounded-lg shadow-xl p-4 z-50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiRefreshCw} className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Update Available</h3>
              <p className="text-sm opacity-90">A new version is ready to install</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/70 hover:text-white transition-colors"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex space-x-3 mt-4">
          <button
            onClick={handleUpdate}
            className="flex-1 bg-white text-coffee-600 py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Update Now
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-white/70 hover:text-white transition-colors"
          >
            Later
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAUpdateNotification;