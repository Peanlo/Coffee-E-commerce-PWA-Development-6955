import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import supabase from '../lib/supabase';
import toast from 'react-hot-toast';

const { FiLock, FiLoader, FiAlertCircle, FiCheck } = FiIcons;

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValidSession, setIsValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const logoUrl = 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753101906746-Cogli%20Caffe%20Side%20By%20Side.png';

  useEffect(() => {
    const checkResetSession = async () => {
      try {
        // Get the full URL hash
        const hash = window.location.hash;
        console.log('Full hash:', hash);
        
        // Extract tokens from the URL hash
        let accessToken = null;
        let refreshToken = null;
        let type = null;
        
        if (hash) {
          // Handle both formats:
          // #access_token=xxx&expires_at=xxx&refresh_token=xxx&token_type=bearer&type=recovery
          // #/reset-password?access_token=xxx&refresh_token=xxx&type=recovery
          
          const hashContent = hash.startsWith('#/reset-password') 
            ? hash.split('?')[1] || hash.split('#/reset-password')[1]?.substring(1)
            : hash.substring(1);
            
          if (hashContent) {
            const params = new URLSearchParams(hashContent);
            accessToken = params.get('access_token');
            refreshToken = params.get('refresh_token');
            type = params.get('type');
            
            console.log('Extracted tokens:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
          }
        }

        // If we have tokens and it's a recovery type
        if (accessToken && type === 'recovery') {
          console.log('Setting session with tokens...');
          
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('Session error:', sessionError);
            setError('Invalid or expired reset link. Please request a new password reset.');
          } else if (data?.session) {
            console.log('Session set successfully');
            setIsValidSession(true);
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname + '#/reset-password');
          } else {
            console.error('No session data returned');
            setError('Unable to verify reset link. Please request a new password reset.');
          }
        } else {
          // Check if there's already a valid session
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            console.log('Existing session found');
            setIsValidSession(true);
          } else {
            console.log('No valid session or tokens found');
            setError('Invalid or expired reset link. Please request a new password reset.');
          }
        }
      } catch (err) {
        console.error('Error checking reset session:', err);
        setError('An error occurred while verifying your reset link. Please try again.');
      } finally {
        setCheckingSession(false);
      }
    };

    checkResetSession();
  }, []);

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      toast.success('Password reset successfully! Please log in with your new password.');
      
      // Sign out the user after password reset
      await supabase.auth.signOut();
      
      // Redirect to login page
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state while checking session
  if (checkingSession) {
    return (
      <>
        <Helmet>
          <title>Reset Password - Cogli Caffe</title>
          <meta name="description" content="Set your new password for your Cogli Caffe account" />
        </Helmet>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-coffee-50 to-cream-100 py-16">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-8 text-center"
            >
              <SafeIcon icon={FiLoader} className="w-12 h-12 text-coffee-600 animate-spin mx-auto mb-4" />
              <img src={logoUrl} alt="Cogli Caffe" className="h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-coffee-800 mb-4">Verifying Reset Link</h2>
              <p className="text-coffee-600">Please wait while we verify your password reset link...</p>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Error state if invalid session
  if (error && !isValidSession) {
    return (
      <>
        <Helmet>
          <title>Reset Password - Cogli Caffe</title>
          <meta name="description" content="Set your new password for your Cogli Caffe account" />
        </Helmet>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-coffee-50 to-cream-100 py-16">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-8 text-center"
            >
              <SafeIcon icon={FiAlertCircle} className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <img src={logoUrl} alt="Cogli Caffe" className="h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-coffee-800 mb-4">Invalid Reset Link</h2>
              <p className="text-coffee-600 mb-6">{error}</p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/forgot-password')}
                  className="w-full btn-coffee py-3"
                >
                  Request New Reset Link
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full border border-coffee-300 text-coffee-600 py-3 px-4 rounded-lg hover:bg-coffee-50 transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Success state - show password reset form
  return (
    <>
      <Helmet>
        <title>Reset Password - Cogli Caffe</title>
        <meta name="description" content="Set your new password for your Cogli Caffe account" />
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
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiCheck} className="w-8 h-8 text-green-500" />
              </div>
              <img src={logoUrl} alt="Cogli Caffe" className="h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-coffee-800">Reset Your Password</h2>
              <p className="text-coffee-600 mt-2">
                Enter your new password below
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6"
              >
                <div className="flex">
                  <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-700">{error}</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-coffee-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="pl-10 w-full py-3 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-coffee-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="pl-10 w-full py-3 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !password.trim() || !confirmPassword.trim()}
                className="w-full flex items-center justify-center btn-coffee py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <SafeIcon icon={FiLoader} className="animate-spin mr-2" />
                    Updating Password...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/login')}
                className="text-coffee-600 hover:text-coffee-800 font-medium"
              >
                Back to Login
              </button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ResetPasswordPage;