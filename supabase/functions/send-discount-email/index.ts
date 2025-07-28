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

// Email templates for different campaigns
const getEmailTemplate = (discountCode: string, campaignType: string) => {
  const templates = {
    general: {
      subject: 'Your Exclusive Discount Code - Cogli Caffe',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B4513; font-size: 28px; margin-bottom: 10px;">Cogli Caffe</h1>
            <p style="color: #666; font-size: 16px;">Premium Coffee & More</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h2 style="margin: 0 0 15px 0; font-size: 24px;">Your Exclusive Discount Code</h2>
            <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 5px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 2px;">${discountCode}</span>
            </div>
            <p style="margin: 0; font-size: 16px; opacity: 0.9;">Use this code at checkout to save on your next order!</p>
          </div>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${Deno.env.get('SITE_URL')}/products" style="background: #8B4513; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Shop Now</a>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>This discount code is valid for a limited time. Don't miss out!</p>
            <p>© 2024 Cogli Caffe. All rights reserved.</p>
          </div>
        </div>
      `
    },
    spring: {
      subject: 'Spring Special: Your 15% Discount Code - Cogli Caffe',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0 0 15px 0; font-size: 28px;">🌸 Spring Special</h1>
            <h2 style="margin: 0 0 15px 0; font-size: 24px;">Your 15% Discount Code</h2>
            <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 5px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 2px;">${discountCode}</span>
            </div>
            <p style="margin: 0; font-size: 16px; opacity: 0.9;">Fresh roasts for the new season!</p>
          </div>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${Deno.env.get('SITE_URL')}/products" style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Shop Spring Collection</a>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>This spring discount is valid for a limited time. Don't miss out!</p>
            <p>© 2024 Cogli Caffe. All rights reserved.</p>
          </div>
        </div>
      `
    },
    summer: {
      subject: 'Summer Sale: Your 25% Discount Code - Cogli Caffe',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0 0 15px 0; font-size: 28px;">☀️ Summer Sale</h1>
            <h2 style="margin: 0 0 15px 0; font-size: 24px;">Your 25% Discount Code</h2>
            <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 5px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 2px;">${discountCode}</span>
            </div>
            <p style="margin: 0; font-size: 16px; opacity: 0.9;">Beat the heat with our refreshing cold brew collection!</p>
          </div>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${Deno.env.get('SITE_URL')}/products" style="background: #3B82F6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Shop Cold Brew</a>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>This summer discount is valid for a limited time. Stay cool!</p>
            <p>© 2024 Cogli Caffe. All rights reserved.</p>
          </div>
        </div>
      `
    },
    fall: {
      subject: 'Fall Harvest: Your 20% Discount Code - Cogli Caffe',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #F97316 0%, #DC2626 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0 0 15px 0; font-size: 28px;">🍂 Fall Harvest</h1>
            <h2 style="margin: 0 0 15px 0; font-size: 24px;">Your 20% Discount Code</h2>
            <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 5px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 2px;">${discountCode}</span>
            </div>
            <p style="margin: 0; font-size: 16px; opacity: 0.9;">Warm up with our seasonal favorites!</p>
          </div>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${Deno.env.get('SITE_URL')}/products" style="background: #F97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Shop Fall Blends</a>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>This fall discount is valid for a limited time. Cozy up with great coffee!</p>
            <p>© 2024 Cogli Caffe. All rights reserved.</p>
          </div>
        </div>
      `
    },
    winter: {
      subject: 'Winter Warmth: Your 30% Discount Code - Cogli Caffe',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0 0 15px 0; font-size: 28px;">❄️ Winter Warmth</h1>
            <h2 style="margin: 0 0 15px 0; font-size: 24px;">Your 30% Discount Code</h2>
            <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 5px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 2px;">${discountCode}</span>
            </div>
            <p style="margin: 0; font-size: 16px; opacity: 0.9;">Cozy up with our holiday specials!</p>
          </div>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${Deno.env.get('SITE_URL')}/products" style="background: #2563EB; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Shop Holiday Specials</a>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>This winter discount is valid for a limited time. Warm wishes!</p>
            <p>© 2024 Cogli Caffe. All rights reserved.</p>
          </div>
        </div>
      `
    }
  };

  return templates[campaignType as keyof typeof templates] || templates.general;
};

serve(async (req) => {
  try {
    const { email, discountCode, campaignType } = await req.json();
    
    if (!email || !discountCode) {
      return new Response(
        JSON.stringify({ error: 'Email and discount code are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const template = getEmailTemplate(discountCode, campaignType);

    await smtp.send({
      from: Deno.env.get('SMTP_FROM') || 'noreply@coglicaffe.com',
      to: email,
      subject: template.subject,
      html: template.html,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending discount email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});