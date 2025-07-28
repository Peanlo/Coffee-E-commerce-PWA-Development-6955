import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gqukyipapfsqmxbpepbe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxdWt5aXBhcGZzcW14YnBlcGJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NzA5MTcsImV4cCI6MjA2NTA0NjkxN30.sFxs4mlxyav-F9GFs74trhS4zysgbZnZzNkfvB7z1Ak';

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export default supabase;