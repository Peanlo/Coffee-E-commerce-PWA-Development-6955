import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is authenticated and get session
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        if (session) {
          setUser(session.user);

          // Get user profile with role
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (!profileError && profile) {
            setIsAdmin(profile.role === 'admin');
          }
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);

          // Get user profile with role
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setIsAdmin(profile.role === 'admin');
          }
        } else {
          setUser(null);
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Register a new user
  const register = async (userData) => {
    try {
      const { email, password, name } = userData;

      // First check if email already exists in profiles
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (existingProfile) {
        return { success: false, error: 'An account with this email already exists' };
      }

      // Create auth user with email confirmation disabled
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
          emailRedirectTo: `${window.location.origin}/#/account` // Redirect after verification
        }
      });

      if (authError) {
        throw authError;
      }

      // Create user profile if auth was successful
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              name,
              email,
              role: 'customer',
              created_at: new Date().toISOString()
            }
          ]);

        if (profileError) {
          // If profile creation fails, we should ideally delete the auth user
          // but Supabase will handle this with its cascade delete
          throw profileError;
        }

        // Show success message
        toast.success('Account created! Please check your email for verification.');
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Invalid email or password' };
    }
  };

  // Logout
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      toast.success('Logged out successfully');
      return { success: true };
    } catch (error) {
      console.error('Error logging out:', error);
      return { success: false, error: error.message };
    }
  };

  // Verify email
  const verifyEmail = async (token) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });

      if (error) {
        throw error;
      }

      toast.success('Email verified successfully!');
      return { success: true };
    } catch (error) {
      console.error('Error verifying email:', error);
      return { success: false, error: error.message };
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to update your profile');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
  };

  // Change password
  const changePassword = async (password) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error changing password:', error);
      return { success: false, error: error.message };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      // Get the current origin for the redirect URL
      const baseUrl = window.location.origin;
      
      // Build the full redirect URL with hash routing
      const redirectTo = `${baseUrl}/#/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo
      });
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    isAdmin,
    register,
    login,
    logout,
    verifyEmail,
    updateProfile,
    changePassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};