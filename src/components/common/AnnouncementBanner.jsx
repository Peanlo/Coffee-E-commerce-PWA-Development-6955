import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from './SafeIcon';
import toast from 'react-hot-toast';

const { FiX, FiStar, FiTruck, FiPercent, FiMail, FiArrowRight, FiCheck } = FiIcons;

const AnnouncementBanner = ({ 
  message = "Limited Time: 20% Off All Premium Coffee Blends",
  subMessage = "Enter your email to receive your discount code",
  discountCode = "COFFEE20",
  ctaLink = "/products?category=coffee",
  backgroundColor = "bg-gradient-to-r from-amber-600 to-orange-600",
  icon = FiPercent
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [email, setEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call to save email and send discount code
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would call your backend API here
      // await saveEmailForDiscount(email, discountCode);
      
      setEmailSubmitted(true);
      toast.success(`Discount code ${discountCode} sent to your email!`);
      
      // Auto-hide form after success
      setTimeout(() => {
        setShowEmailForm(false);
      }, 3000);
      
    } catch (error) {
      toast.error('Failed to send discount code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`${backgroundColor} text-white py-4 px-4 relative overflow-hidden`}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-5">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-0 left-1/4 w-20 h-20"
            >
              <SafeIcon icon={icon} className="w-full h-full" />
            </motion.div>
            <motion.div
              animate={{ 
                rotate: [360, 0],
                scale: [1, 0.9, 1]
              }}
              transition={{ 
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-0 right-1/3 w-16 h-16"
            >
              <SafeIcon icon={FiStar} className="w-full h-full" />
            </motion.div>
          </div>

          <div className="relative max-w-7xl mx-auto">
            {!showEmailForm ? (
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                {/* Main Content */}
                <div className="flex items-center space-x-4 text-center sm:text-left">
                  <div className="bg-white/20 p-2 rounded-full flex-shrink-0">
                    <SafeIcon icon={icon} className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">
                      {message}
                    </div>
                    <div className="text-white/90 text-sm">
                      {subMessage}
                    </div>
                  </div>
                </div>

                {/* CTA and Close */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowEmailForm(true)}
                    className="bg-white text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105 flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiMail} className="w-4 h-4" />
                    <span>Get Discount</span>
                  </button>
                  
                  <button
                    onClick={() => setIsVisible(false)}
                    className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/20"
                    aria-label="Close announcement"
                  >
                    <SafeIcon icon={FiX} className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0"
              >
                {/* Email Form */}
                <div className="flex-1 max-w-md">
                  {!emailSubmitted ? (
                    <form onSubmit={handleEmailSubmit} className="flex space-x-2">
                      <div className="relative flex-1">
                        <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
                          disabled={isSubmitting}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors disabled:opacity-50 flex items-center space-x-1"
                      >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Send</span>
                            <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center space-x-2 text-green-100">
                      <SafeIcon icon={FiCheck} className="w-5 h-5" />
                      <span>Discount code sent! Check your email.</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                  <Link
                    to={ctaLink}
                    className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    Shop Now
                  </Link>
                  
                  <button
                    onClick={() => setShowEmailForm(false)}
                    className="text-white/80 hover:text-white transition-colors p-2"
                    aria-label="Back"
                  >
                    <SafeIcon icon={FiX} className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementBanner;