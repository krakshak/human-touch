import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your own Supabase project credentials
const supabaseUrl = 'https://vilvdpmszaxycavniags.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpbHZkcG1zemF4eWNhdm5pYWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NDA5NzIsImV4cCI6MjA2MzUxNjk3Mn0.JHbYKgIJxnCgLvpHgYp64iKm2it4irL9eT1iHrW9Ofs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
