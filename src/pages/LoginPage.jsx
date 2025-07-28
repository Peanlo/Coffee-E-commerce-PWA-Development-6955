import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>Login - Cogli Caffe</title>
        <meta name="description" content="Login to your Cogli Caffe account to access your orders, wishlist, and more." />
      </Helmet>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-coffee-50 to-cream-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-coffee-800">Welcome Back</h1>
            <p className="text-coffee-600 mt-2">Sign in to your account to continue</p>
          </motion.div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            <div className="w-full max-w-md">
              <LoginForm />
            </div>
            
            <div className="hidden md:block w-full max-w-md">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-coffee-800 text-white p-8 rounded-xl shadow-lg"
              >
                <h2 className="text-xl font-semibold mb-4">Benefits of Creating an Account</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="mr-2 text-coffee-300">✓</span>
                    <span>Track your orders and shipping status</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-coffee-300">✓</span>
                    <span>Save your favorite products to your wishlist</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-coffee-300">✓</span>
                    <span>Receive exclusive offers and promotions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-coffee-300">✓</span>
                    <span>Faster checkout with saved shipping information</span>
                  </li>
                </ul>
                
                <div className="mt-8 text-center">
                  <Link 
                    to="/register"
                    className="inline-block bg-white text-coffee-800 px-6 py-3 rounded-lg font-semibold hover:bg-cream-100 transition-colors"
                  >
                    Create an Account
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default LoginPage;