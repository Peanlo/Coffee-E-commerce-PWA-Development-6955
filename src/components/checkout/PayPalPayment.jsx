import React from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { createPayPalOrder, capturePayPalPayment } from '../../services/paymentService';

const PayPalPayment = ({ amount, onPaymentComplete }) => {
  const createOrder = async () => {
    try {
      const orderID = await createPayPalOrder(amount);
      return orderID;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      throw error;
    }
  };

  const onApprove = async (data) => {
    try {
      const details = await capturePayPalPayment(data.orderID);
      
      onPaymentComplete({
        id: details.id,
        amount: details.purchase_units[0].amount.value * 100,
        status: details.status,
        type: 'paypal'
      });
    } catch (error) {
      console.error('Error capturing PayPal payment:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-4">
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'pay'
        }}
      />
    </div>
  );
};

export default PayPalPayment;