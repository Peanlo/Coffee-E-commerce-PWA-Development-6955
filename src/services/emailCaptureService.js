import supabase from '../lib/supabase';

// Save email for discount code
export const saveEmailForDiscount = async (email, discountCode, campaignType = 'general') => {
  try {
    const { data, error } = await supabase
      .from('email_captures')
      .insert([
        {
          email,
          discount_code: discountCode,
          campaign_type: campaignType,
          captured_at: new Date().toISOString(),
          ip_address: null, // You can capture IP if needed
          user_agent: navigator.userAgent
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Send email with discount code (you can implement this with your email service)
    await sendDiscountEmail(email, discountCode, campaignType);

    return data;
  } catch (error) {
    console.error('Error saving email for discount:', error);
    throw error;
  }
};

// Send discount email
const sendDiscountEmail = async (email, discountCode, campaignType) => {
  try {
    // This would integrate with your email service (SendGrid, Mailgun, etc.)
    // For now, we'll simulate the email sending
    console.log(`Sending discount email to ${email} with code ${discountCode} for ${campaignType} campaign`);
    
    // In a real implementation, you would call your email service here
    // Example with Supabase Edge Functions:
    /*
    const { error } = await supabase.functions.invoke('send-discount-email', {
      body: {
        email,
        discountCode,
        campaignType
      }
    });
    
    if (error) throw error;
    */
    
    return { success: true };
  } catch (error) {
    console.error('Error sending discount email:', error);
    throw error;
  }
};

// Get email capture statistics (admin only)
export const getEmailCaptureStats = async (dateRange = '30 days') => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(dateRange));

    const { data, error } = await supabase
      .from('email_captures')
      .select('*')
      .gte('captured_at', startDate.toISOString())
      .order('captured_at', { ascending: false });

    if (error) throw error;

    // Calculate statistics
    const totalCaptures = data.length;
    const campaignStats = data.reduce((acc, capture) => {
      acc[capture.campaign_type] = (acc[capture.campaign_type] || 0) + 1;
      return acc;
    }, {});

    return {
      totalCaptures,
      campaignStats,
      recentCaptures: data.slice(0, 10) // Last 10 captures
    };
  } catch (error) {
    console.error('Error getting email capture stats:', error);
    throw error;
  }
};

// Check if email already exists (to prevent duplicates)
export const checkEmailExists = async (email) => {
  try {
    const { data, error } = await supabase
      .from('email_captures')
      .select('id')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking email existence:', error);
    return false;
  }
};