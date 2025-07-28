import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { Elements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { getStripe } from './services/paymentService';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { PWAProvider } from './contexts/PWAContext';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AccountPage from './pages/AccountPage';
import WishlistPage from './pages/WishlistPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminHelpPage from './pages/AdminHelpPage';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';
import PWAInstallPrompt from './components/pwa/PWAInstallPrompt';
import PWAUpdateNotification from './components/pwa/PWAUpdateNotification';
import CustomerServiceChatbot from './components/common/CustomerServiceChatbot';

// Hooks
import { useAbandonedCart } from './hooks/useAbandonedCart';

// Styles
import './App.css';

// PayPal configuration
const paypalOptions = {
  'client-id': 'test', // Replace with your actual client ID in production
  currency: 'USD',
  intent: 'capture',
};

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <PWAProvider>
                <PayPalScriptProvider options={paypalOptions}>
                  <Elements stripe={getStripe()}>
                    <Router>
                      <div className="App">
                        <Routes>
                          {/* Public Routes */}
                          <Route path="/" element={<HomePage />} />
                          <Route path="/products" element={<ProductsPage />} />
                          <Route path="/product/:id" element={<ProductDetailsPage />} />
                          <Route path="/cart" element={<CartPage />} />
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/register" element={<RegisterPage />} />
                          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                          <Route path="/reset-password" element={<ResetPasswordPage />} />
                          <Route path="/about" element={<AboutPage />} />
                          <Route path="/contact" element={<ContactPage />} />
                          <Route path="/track-order" element={<OrderTrackingPage />} />
                          
                          {/* Protected Routes */}
                          <Route 
                            path="/checkout" 
                            element={
                              <ProtectedRoute>
                                <CheckoutPage />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/account/*" 
                            element={
                              <ProtectedRoute>
                                <AccountPage />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/wishlist" 
                            element={
                              <ProtectedRoute>
                                <WishlistPage />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/order/:orderId" 
                            element={
                              <ProtectedRoute>
                                <OrderTrackingPage />
                              </ProtectedRoute>
                            } 
                          />
                          
                          {/* Admin Routes */}
                          <Route 
                            path="/admin/*" 
                            element={
                              <ProtectedRoute adminOnly={true}>
                                <AdminDashboard />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/admin/help" 
                            element={
                              <ProtectedRoute adminOnly={true}>
                                <AdminHelpPage />
                              </ProtectedRoute>
                            } 
                          />
                          
                          {/* 404 Route */}
                          <Route 
                            path="*" 
                            element={
                              <div className="min-h-screen flex items-center justify-center">
                                <div className="text-center">
                                  <h1 className="text-4xl font-bold text-coffee-800 mb-4">404</h1>
                                  <p className="text-xl text-coffee-600 mb-6">Page not found</p>
                                  <a href="/" className="btn-coffee">Back to Home</a>
                                </div>
                              </div>
                            } 
                          />
                        </Routes>
                        
                        {/* Global Components */}
                        <Toaster position="top-center" />
                        <PWAInstallPrompt />
                        <PWAUpdateNotification />
                        <CustomerServiceChatbot />
                      </div>
                    </Router>
                  </Elements>
                </PayPalScriptProvider>
              </PWAProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;