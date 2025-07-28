import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { createStripePaymentIntent, processStripePayment } from '../../services/paymentService';

const { FiLoader } = FiIcons;

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const StripePayment = ({ amount, onPaymentComplete }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const { clientSecret } = await createStripePaymentIntent(amount);

      // Confirm card payment
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (stripeError) {
        throw stripeError;
      }

      // Process the payment
      await processStripePayment(paymentIntent.id, amount);
      
      // Clear the form
      elements.getElement(CardElement).clear();
      
      // Notify parent component
      onPaymentComplete({
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
        type: 'stripe'
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-gray-200 rounded-lg">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
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

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full btn-coffee py-3 flex items-center justify-center"
      >
        {processing ? (
          <>
            <SafeIcon icon={FiLoader} className="animate-spin mr-2" />
            Processing...
          </>
        ) : (
          `Pay $${(amount / 100).toFixed(2)}`
        )}
      </button>
    </form>
  );
};

export default StripePayment;