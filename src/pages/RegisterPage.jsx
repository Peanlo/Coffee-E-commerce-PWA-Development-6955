import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <>
      <Helmet>
        <title>Create Account - Cogli Caffe</title>
        <meta name="description" content="Create an account at Cogli Caffe to enjoy exclusive benefits and faster checkout." />
      </Helmet>

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-coffee-50 to-cream-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-coffee-800">Create an Account</h1>
            <p className="text-coffee-600 mt-2">Join our community of coffee enthusiasts</p>
          </motion.div>
          
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <RegisterForm />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default RegisterPage;