import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://gqukyipapfsqmxbpepbe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxdWt5aXBhcGZzcW14YnBlcGJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NzA5MTcsImV4cCI6MjA2NTA0NjkxN30.sFxs4mlxyav-F9GFs74trhS4zysgbZnZzNkfvB7z1Ak';

// Admin user credentials
const ADMIN_EMAIL = 'admin@coglicaffe.com';
const ADMIN_PASSWORD = 'Admin123!';
const ADMIN_NAME = 'Admin User';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createAdminUser() {
  try {
    // Step 1: Sign up the user
    console.log('Creating admin user...');
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      options: {
        data: {
          name: ADMIN_NAME,
        }
      }
    });

    if (signUpError) {
      throw signUpError;
    }

    console.log('User created successfully:', authData.user.id);

    // Step 2: Create or update profile with admin role
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        role: 'admin',
        created_at: new Date().toISOString()
      });

    if (profileError) {
      throw profileError;
    }

    console.log('Admin profile created successfully!');
    console.log('\nAdmin Login Credentials:');
    console.log('------------------------');
    console.log('Email:    ', ADMIN_EMAIL);
    console.log('Password: ', ADMIN_PASSWORD);
    console.log('\nYou can now log in to the admin panel with these credentials.');

  } catch (error) {
    console.error('Error creating admin user:', error.message);
  }
}

createAdminUser();