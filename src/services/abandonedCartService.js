import supabase from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Check and create abandoned cart notification
export const checkForAbandonedCart = async (userId, cartItems, totalAmount) => {
  try {
    // Check if there's already a pending notification
    const { data: existing } = await supabase
      .from('abandoned_cart_notifications')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .single();

    if (existing) return;

    // Create new notification
    const recoveryToken = uuidv4();
    const { error } = await supabase
      .from('abandoned_cart_notifications')
      .insert({
        user_id: userId,
        cart_items: cartItems,
        total_amount: totalAmount,
        recovery_token: recoveryToken,
        status: 'pending'
      });

    if (error) throw error;

    // Trigger email sending
    await sendAbandonedCartEmail(userId, recoveryToken);

    return { success: true };
  } catch (error) {
    console.error('Error checking abandoned cart:', error);
    return { success: false, error: error.message };
  }
};

// Send abandoned cart recovery email
const sendAbandonedCartEmail = async (userId, recoveryToken) => {
  try {
    const { data: user } = await supabase
      .from('profiles')
      .select('email, name')
      .eq('id', userId)
      .single();

    if (!user) throw new Error('User not found');

    // Send email using Supabase Edge Function
    await supabase.functions.invoke('send-email', {
      body: {
        templateId: 'abandoned-cart',
        to: user.email,
        data: {
          customerName: user.name,
          recoveryUrl: `${window.location.origin}/#/cart?token=${recoveryToken}`,
        }
      }
    });

    // Update notification status
    await supabase
      .from('abandoned_cart_notifications')
      .update({ 
        email_sent_at: new Date().toISOString(),
        status: 'sent' 
      })
      .eq('recovery_token', recoveryToken);

    return { success: true };
  } catch (error) {
    console.error('Error sending abandoned cart email:', error);
    return { success: false, error: error.message };
  }
};

// Recover abandoned cart
export const recoverAbandonedCart = async (token) => {
  try {
    const { data, error } = await supabase
      .from('abandoned_cart_notifications')
      .select('*')
      .eq('recovery_token', token)
      .eq('status', 'sent')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Invalid or expired recovery token');

    // Update notification status
    await supabase
      .from('abandoned_cart_notifications')
      .update({ 
        recovered_at: new Date().toISOString(),
        status: 'recovered' 
      })
      .eq('recovery_token', token);

    return { 
      success: true, 
      cartItems: data.cart_items 
    };
  } catch (error) {
    console.error('Error recovering cart:', error);
    return { success: false, error: error.message };
  }
};