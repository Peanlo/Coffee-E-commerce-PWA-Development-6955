import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import PaymentMethods from './PaymentMethods';
import ShippingForm from './ShippingForm';
import OrderSummary from './OrderSummary';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { createOrder } from '../../services/orderService';
import { savePaymentRecord } from '../../services/paymentService';

const { FiCheck, FiLoader } = FiIcons;

const CheckoutPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [shippingDetails, setShippingDetails] = useState(null);
  const [step, setStep] = useState('shipping'); // 'shipping' or 'payment'

  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const total = getCartTotal();
  const amount = Math.round(total * 100); // Convert to cents for Stripe

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
    }
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [user, cartItems, navigate]);

  const handleShippingSubmit = (details) => {
    setShippingDetails(details);
    setStep('payment');
  };

  const handlePaymentComplete = async (paymentDetails) => {
    setLoading(true);
    setError(null);

    try {
      // Create order with shipping details
      const order = await createOrder({
        user_id: user.id,
        total_amount: total,
        status: 'paid',
        payment_id: paymentDetails.id,
        payment_type: paymentDetails.type,
        shipping_address: shippingDetails
      }, cartItems);

      // Save payment record
      await savePaymentRecord({
        order_id: order.id,
        user_id: user.id,
        amount: paymentDetails.amount,
        payment_id: paymentDetails.id,
        payment_type: paymentDetails.type,
        status: paymentDetails.status
      });

      // Clear cart
      await clearCart();
      setOrderComplete(true);

      // Redirect to order confirmation after a delay
      setTimeout(() => {
        navigate(`/order/${order.id}`);
      }, 2000);
    } catch (err) {
      setError('Failed to process order. Please try again.');
      console.error('Error processing order:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <SafeIcon icon={FiLoader} className="w-12 h-12 text-coffee-600 animate-spin mx-auto mb-4" />
            <p className="text-coffee-800 font-medium">Processing your order...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (orderComplete) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiCheck} className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Complete!</h2>
            <p className="text-gray-600">Redirecting to your order confirmation...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout - Cogli Caffe</title>
        <meta name="description" content="Complete your purchase at Cogli Caffe" />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-cream-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-coffee-800">Checkout</h1>
              <p className="text-coffee-600 mt-2">Complete your purchase</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 border-l-4 border-red-500 p-4 rounded"
              >
                <p className="text-red-700">{error}</p>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {step === 'shipping' ? (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-coffee-800 mb-6">
                      Shipping Information
                    </h2>
                    <ShippingForm onSubmit={handleShippingSubmit} />
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-coffee-800 mb-6">
                      Payment Method
                    </h2>
                    <PaymentMethods 
                      amount={amount} 
                      onPaymentComplete={handlePaymentComplete}
                      shippingDetails={shippingDetails}
                    />
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <OrderSummary 
                cartItems={cartItems} 
                total={total}
                step={step}
                onBack={() => setStep('shipping')}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CheckoutPage;