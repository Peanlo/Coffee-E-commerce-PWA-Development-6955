import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from './SafeIcon';
import toast from 'react-hot-toast';

const { FiX, FiCoffee, FiSun, FiSnowflake, FiLeaf, FiMail, FiArrowRight, FiCheck } = FiIcons;

const SeasonalBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [email, setEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  // Get current season
  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  };

  const season = getCurrentSeason();

  const seasonalContent = {
    spring: {
      message: "Spring Special: 15% Off New Arrivals",
      subMessage: "Enter your email to receive your spring discount code",
      discountCode: "SPRING15",
      backgroundColor: "bg-gradient-to-r from-green-500 to-emerald-600",
      icon: FiLeaf
    },
    summer: {
      message: "Summer Sale: 25% Off Cold Brew Collection",
      subMessage: "Enter your email to receive your summer discount code",
      discountCode: "SUMMER25",
      backgroundColor: "bg-gradient-to-r from-blue-500 to-cyan-600",
      icon: FiSun
    },
    fall: {
      message: "Fall Harvest: 20% Off Seasonal Blends",
      subMessage: "Enter your email to receive your fall discount code",
      discountCode: "FALL20",
      backgroundColor: "bg-gradient-to-r from-orange-500 to-red-600",
      icon: FiLeaf
    },
    winter: {
      message: "Winter Warmth: 30% Off Holiday Specials",
      subMessage: "Enter your email to receive your winter discount code",
      discountCode: "WINTER30",
      backgroundColor: "bg-gradient-to-r from-blue-600 to-indigo-700",
      icon: FiSnowflake
    }
  };

  const content = seasonalContent[season];

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
      // await saveSeasonalEmailForDiscount(email, content.discountCode);
      
      setEmailSubmitted(true);
      toast.success(`Discount code ${content.discountCode} sent to your email!`);
      
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
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`${content.backgroundColor} text-white py-4 px-4 relative overflow-hidden`}
        >
          {/* Floating Coffee Beans Animation */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <SafeIcon icon={FiCoffee} className="w-6 h-6 text-white" />
              </motion.div>
            ))}
          </div>

          <div className="relative max-w-7xl mx-auto">
            {!showEmailForm ? (
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                {/* Content */}
                <div className="flex items-center space-x-4 text-center sm:text-left">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="bg-white/20 p-3 rounded-full flex-shrink-0"
                  >
                    <SafeIcon icon={content.icon} className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="font-bold text-xl"
                    >
                      {content.message}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-white/90 text-sm"
                    >
                      {content.subMessage}
                    </motion.div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowEmailForm(true)}
                    className="bg-white text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiMail} className="w-4 h-4" />
                    <span>Get Discount</span>
                  </motion.button>
                  
                  <button
                    onClick={() => setIsVisible(false)}
                    className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/20"
                    aria-label="Close banner"
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
                    to="/products"
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

export default SeasonalBanner;