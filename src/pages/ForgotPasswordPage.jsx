import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const { FiMail, FiArrowLeft, FiLoader, FiCheck } = FiIcons;

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  // Updated Logo URL
  const logoUrl = 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753101906746-Cogli%20Caffe%20Side%20By%20Side.png';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { success, error } = await resetPassword(email);
      
      if (success) {
        setSent(true);
        toast.success('Password reset email sent!');
      } else {
        toast.error(error || 'Failed to send reset email');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <>
        <Helmet>
          <title>Check Your Email - Cogli Caffe</title>
          <meta name="description" content="Password reset email sent - check your inbox" />
        </Helmet>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-coffee-50 to-cream-100 py-16">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-8 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <SafeIcon icon={FiCheck} className="w-8 h-8 text-green-500" />
              </div>
              
              <img src={logoUrl} alt="Cogli Caffe" className="h-12 mx-auto mb-4" />
              
              <h2 className="text-2xl font-bold text-coffee-800 mb-4">
                Check Your Email
              </h2>
              
              <p className="text-coffee-600 mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              
              <p className="text-sm text-gray-500 mb-6">
                Didn't receive the email? Check your spam folder or try again with a different email address.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setSent(false);
                    setEmail('');
                  }}
                  className="w-full border border-coffee-300 text-coffee-600 py-3 px-4 rounded-lg hover:bg-coffee-50 transition-colors"
                >
                  Try Different Email
                </button>
                
                <Link
                  to="/login"
                  className="w-full btn-coffee py-3 px-4 rounded-lg inline-flex items-center justify-center gap-2"
                >
                  <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Forgot Password - Cogli Caffe</title>
        <meta name="description" content="Reset your Cogli Caffe account password" />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-coffee-50 to-cream-100 py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <img src={logoUrl} alt="Cogli Caffe" className="h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-coffee-800">Forgot Password?</h2>
              <p className="text-coffee-600 mt-2">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-coffee-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <SafeIcon 
                    icon={FiMail} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400" 
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 w-full py-3 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full flex items-center justify-center btn-coffee py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <SafeIcon icon={FiLoader} className="animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-coffee-600 hover:text-coffee-800 font-medium inline-flex items-center gap-2"
              >
                <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ForgotPasswordPage;