import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { usePWA } from '../../contexts/PWAContext';

const { FiDownload, FiX } = FiIcons;

const PWAInstallPrompt = () => {
  const { isInstallable, installApp } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  const handleInstall = async () => {
    const installed = await installApp();
    if (installed) {
      setIsDismissed(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  if (!isInstallable || isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-6 z-50"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-coffee-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">☕</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Install Cogli Caffe</h3>
              <p className="text-sm text-gray-600">Get the app experience</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Install our app for a better shopping experience with offline access and notifications.
        </p>
        
        <div className="flex space-x-3">
          <button
            onClick={handleInstall}
            className="flex-1 btn-coffee flex items-center justify-center gap-2"
          >
            <SafeIcon icon={FiDownload} className="w-4 h-4" />
            Install App
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Later
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;