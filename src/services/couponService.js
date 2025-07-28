import supabase from '../lib/supabase';

// Get valid coupon by code
export const validateCoupon = async (code) => {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .single();

    if (error) throw error;

    // Check if coupon is expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return { valid: false, message: 'Coupon has expired' };
    }

    // Check if coupon has reached usage limit
    if (data.usage_limit && data.times_used >= data.usage_limit) {
      return { valid: false, message: 'Coupon usage limit reached' };
    }

    return { valid: true, coupon: data };
  } catch (error) {
    console.error('Error validating coupon:', error);
    return { valid: false, message: 'Invalid coupon code' };
  }
};

// Apply coupon to total amount
export const applyCoupon = async (couponId, orderId) => {
  try {
    // Start a Supabase transaction
    const { data: { user } } = await supabase.auth.getUser();

    // Record coupon usage
    const { error: usageError } = await supabase
      .from('coupon_usage')
      .insert({
        coupon_id: couponId,
        user_id: user.id,
        order_id: orderId,
        used_at: new Date().toISOString()
      });

    if (usageError) throw usageError;

    // Increment times_used counter
    const { error: updateError } = await supabase
      .from('coupons')
      .update({
        times_used: supabase.sql`times_used + 1`,
        updated_at: new Date().toISOString()
      })
      .eq('id', couponId);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    console.error('Error applying coupon:', error);
    return { success: false, error: error.message };
  }
};

// Calculate discount amount
export const calculateDiscount = (total, coupon) => {
  if (!coupon) return 0;

  let discountAmount = 0;

  if (coupon.discount_type === 'percentage') {
    discountAmount = (total * coupon.discount_value) / 100;
  } else if (coupon.discount_type === 'fixed') {
    discountAmount = coupon.discount_value;
  }

  // Apply minimum purchase requirement
  if (coupon.min_purchase && total < coupon.min_purchase) {
    return 0;
  }

  // Apply maximum discount limit if set
  if (coupon.max_discount && discountAmount > coupon.max_discount) {
    discountAmount = coupon.max_discount;
  }

  return discountAmount;
};