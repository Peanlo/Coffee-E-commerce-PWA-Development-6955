import supabase from '../lib/supabase';

// Email templates
const EMAIL_TEMPLATES = {
  ORDER_CONFIRMATION: 'order-confirmation',
  SHIPPING_UPDATE: 'shipping-update',
  PASSWORD_RESET: 'password-reset',
  WELCOME: 'welcome',
  ORDER_SHIPPED: 'order-shipped',
  ORDER_DELIVERED: 'order-delivered'
};

// Send email using Supabase Edge Functions
const sendEmail = async (templateId, to, data) => {
  try {
    const { error } = await supabase.functions.invoke('send-email', {
      body: {
        templateId,
        to,
        data
      }
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (order, user) => {
  try {
    return await sendEmail(EMAIL_TEMPLATES.ORDER_CONFIRMATION, user.email, {
      orderId: order.id,
      customerName: user.name,
      orderItems: order.order_items,
      totalAmount: order.total_amount,
      orderDate: order.created_at,
      shippingAddress: order.shipping_address
    });
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    return { success: false, error: error.message };
  }
};

// Send shipping update email
export const sendShippingUpdateEmail = async (order, user, trackingInfo) => {
  try {
    return await sendEmail(EMAIL_TEMPLATES.SHIPPING_UPDATE, user.email, {
      orderId: order.id,
      customerName: user.name,
      carrier: trackingInfo.carrier,
      trackingNumber: trackingInfo.tracking_number,
      trackingUrl: trackingInfo.tracking_url,
      estimatedDelivery: trackingInfo.estimated_delivery
    });
  } catch (error) {
    console.error('Error sending shipping update:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email
export const sendWelcomeEmail = async (user) => {
  try {
    return await sendEmail(EMAIL_TEMPLATES.WELCOME, user.email, {
      customerName: user.name
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    return await sendEmail(EMAIL_TEMPLATES.PASSWORD_RESET, user.email, {
      customerName: user.name,
      resetToken,
      resetUrl: `${window.location.origin}/#/reset-password?token=${resetToken}`
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

// Send order shipped email
export const sendOrderShippedEmail = async (order, user, trackingInfo) => {
  try {
    return await sendEmail(EMAIL_TEMPLATES.ORDER_SHIPPED, user.email, {
      orderId: order.id,
      customerName: user.name,
      carrier: trackingInfo.carrier,
      trackingNumber: trackingInfo.tracking_number,
      trackingUrl: trackingInfo.tracking_url,
      estimatedDelivery: trackingInfo.estimated_delivery,
      orderItems: order.order_items
    });
  } catch (error) {
    console.error('Error sending order shipped email:', error);
    return { success: false, error: error.message };
  }
};

// Send order delivered email
export const sendOrderDeliveredEmail = async (order, user) => {
  try {
    return await sendEmail(EMAIL_TEMPLATES.ORDER_DELIVERED, user.email, {
      orderId: order.id,
      customerName: user.name,
      orderItems: order.order_items,
      deliveryDate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error sending order delivered email:', error);
    return { success: false, error: error.message };
  }
};