import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { getStripe } from '../services/paymentService';

const PAYPAL_CLIENT_ID = 'your_paypal_client_id';

const PaymentProvider = ({ children }) => {
  return (
    <PayPalScriptProvider options={{ 'client-id': PAYPAL_CLIENT_ID }}>
      <Elements stripe={getStripe()}>
        {children}
      </Elements>
    </PayPalScriptProvider>
  );
};

export default PaymentProvider;