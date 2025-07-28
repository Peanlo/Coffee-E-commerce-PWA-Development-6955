import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { SMTPClient } from 'https://deno.land/x/smtp@v0.7.0/mod.ts';

const SMTP_CONFIG = {
  hostname: Deno.env.get('SMTP_HOST') || '',
  port: parseInt(Deno.env.get('SMTP_PORT') || '587'),
  username: Deno.env.get('SMTP_USER') || '',
  password: Deno.env.get('SMTP_PASS') || '',
};

// Create SMTP client
const smtp = new SMTPClient({
  connection: {
    hostname: SMTP_CONFIG.hostname,
    port: SMTP_CONFIG.port,
    tls: true,
    auth: {
      username: SMTP_CONFIG.username,
      password: SMTP_CONFIG.password,
    },
  },
});

// Email templates
const templates = {
  'order-confirmation': {
    subject: 'Order Confirmation - Cogli Caffe',
    getHtml: (data: any) => `
      <h1>Thank you for your order!</h1>
      <p>Dear ${data.customerName},</p>
      <p>Your order #${data.orderId} has been confirmed.</p>
      <h2>Order Details:</h2>
      <ul>
        ${data.orderItems.map((item: any) => `
          <li>${item.quantity}x ${item.products.name} - $${item.price}</li>
        `).join('')}
      </ul>
      <p><strong>Total:</strong> $${data.totalAmount}</p>
      <p>We'll notify you when your order ships.</p>
    `,
  },
  'shipping-update': {
    subject: 'Your Order Has Been Shipped - Cogli Caffe',
    getHtml: (data: any) => `
      <h1>Your Order Has Been Shipped!</h1>
      <p>Dear ${data.customerName},</p>
      <p>Your order #${data.orderId} is on its way!</p>
      <h2>Tracking Information:</h2>
      <p>Carrier: ${data.carrier}</p>
      <p>Tracking Number: ${data.trackingNumber}</p>
      <p><a href="${data.trackingUrl}">Track Your Package</a></p>
      <p>Estimated Delivery: ${new Date(data.estimatedDelivery).toLocaleDateString()}</p>
    `,
  },
  'welcome': {
    subject: 'Welcome to Cogli Caffe!',
    getHtml: (data: any) => `
      <h1>Welcome to Cogli Caffe!</h1>
      <p>Dear ${data.customerName},</p>
      <p>Thank you for joining our coffee-loving community!</p>
      <p>Start exploring our premium coffee beans and merchandise:</p>
      <ul>
        <li>Browse our collection of artisanal coffee</li>
        <li>Check out our exclusive merchandise</li>
        <li>Learn about our coffee sourcing practices</li>
      </ul>
      <p><a href="${Deno.env.get('SITE_URL')}">Visit Our Store</a></p>
    `,
  },
  'password-reset': {
    subject: 'Password Reset Request - Cogli Caffe',
    getHtml: (data: any) => `
      <h1>Password Reset Request</h1>
      <p>Dear ${data.customerName},</p>
      <p>We received a request to reset your password.</p>
      <p>Click the link below to reset your password:</p>
      <p><a href="${data.resetUrl}">Reset Password</a></p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  },
  'order-shipped': {
    subject: 'Your Order is On Its Way! - Cogli Caffe',
    getHtml: (data: any) => `
      <h1>Your Order is On Its Way!</h1>
      <p>Dear ${data.customerName},</p>
      <p>Great news! Your order #${data.orderId} has been shipped.</p>
      <h2>Tracking Details:</h2>
      <p>Carrier: ${data.carrier}</p>
      <p>Tracking Number: ${data.trackingNumber}</p>
      <p><a href="${data.trackingUrl}">Track Your Package</a></p>
      <h2>Order Summary:</h2>
      <ul>
        ${data.orderItems.map((item: any) => `
          <li>${item.quantity}x ${item.products.name}</li>
        `).join('')}
      </ul>
    `,
  },
  'order-delivered': {
    subject: 'Order Delivered - How Was Your Experience? - Cogli Caffe',
    getHtml: (data: any) => `
      <h1>Your Order Has Been Delivered!</h1>
      <p>Dear ${data.customerName},</p>
      <p>Your order #${data.orderId} was delivered on ${new Date(data.deliveryDate).toLocaleDateString()}.</p>
      <p>We hope you enjoy your coffee!</p>
      <p>Please take a moment to:</p>
      <ul>
        <li><a href="${Deno.env.get('SITE_URL')}/review">Leave a Review</a></li>
        <li><a href="${Deno.env.get('SITE_URL')}/contact">Contact Support</a></li>
      </ul>
    `,
  },
};

serve(async (req) => {
  try {
    const { templateId, to, data } = await req.json();
    const template = templates[templateId as keyof typeof templates];

    if (!template) {
      return new Response(
        JSON.stringify({ error: 'Invalid template ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await smtp.send({
      from: Deno.env.get('SMTP_FROM') || 'noreply@coglicaffe.com',
      to,
      subject: template.subject,
      html: template.getHtml(data),
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});