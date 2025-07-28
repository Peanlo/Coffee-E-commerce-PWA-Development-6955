import supabase from '../lib/supabase';

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Upload profile avatar
export const uploadAvatar = async (userId, file) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('user-avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      throw uploadError;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('user-avatars')
      .getPublicUrl(filePath);
    
    // Update profile with avatar URL
    const { data, error } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};

// Add address
export const addUserAddress = async (userId, addressData) => {
  try {
    // Add is_default handling
    if (addressData.is_default) {
      // If new address is default, unset any existing default addresses
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
    }
    
    const { data, error } = await supabase
      .from('user_addresses')
      .insert({
        user_id: userId,
        ...addressData
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error adding user address:', error);
    throw error;
  }
};

// Get user addresses
export const getUserAddresses = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting user addresses:', error);
    throw error;
  }
};

// Update address
export const updateUserAddress = async (addressId, userId, addressData) => {
  try {
    // Add is_default handling
    if (addressData.is_default) {
      // If this address is being set as default, unset any existing default addresses
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
    }
    
    const { data, error } = await supabase
      .from('user_addresses')
      .update(addressData)
      .eq('id', addressId)
      .eq('user_id', userId) // Security: ensure user owns this address
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error updating user address:', error);
    throw error;
  }
};

// Delete address
export const deleteUserAddress = async (addressId, userId) => {
  try {
    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', addressId)
      .eq('user_id', userId); // Security: ensure user owns this address
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting user address:', error);
    throw error;
  }
};

// Get all users (admin only)
export const getAllUsers = async (filters = {}) => {
  try {
    let query = supabase
      .from('profiles')
      .select('*');
    
    // Apply role filter
    if (filters.role) {
      query = query.eq('role', filters.role);
    }
    
    // Apply search filter
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }
    
    // Apply sorting
    if (filters.sortBy) {
      const [field, direction] = filters.sortBy.split('-');
      query = query.order(field, { ascending: direction === 'asc' });
    } else {
      // Default sorting
      query = query.order('created_at', { ascending: false });
    }
    
    // Apply pagination
    if (filters.page && filters.limit) {
      const from = (filters.page - 1) * filters.limit;
      const to = from + filters.limit - 1;
      query = query.range(from, to);
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      throw error;
    }
    
    return { users: data, count };
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

// Update user role (admin only)
export const updateUserRole = async (userId, role) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};