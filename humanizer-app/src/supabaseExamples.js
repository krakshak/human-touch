// Example Supabase usage for registration, credit tracking, and history
import { supabase } from './supabaseClient';

// Register a user (custom, no Supabase Auth)
import bcrypt from 'bcryptjs';

export async function registerUser(email, password) {
  if (!password || password.length < 8) {
    return { user: null, error: { message: 'Password must be at least 8 characters.' } };
  }
  try {
    // Check if user already exists
    const { data: existing, error: findErr } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    if (existing) {
      return { user: null, error: { message: 'User already exists' } };
    }
    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    // Insert new user
    const { data: user, error } = await supabase
      .from('users')
      .insert([{ email, password_hash: hash }])
      .select()
      .single();
    if (error) return { user: null, error };
    // Assign 20 credits to the new user
    const { error: creditError } = await supabase
      .from('credits')
      .insert([{ user_id: user.id, credits_left: 20 }]);
    if (creditError) return { user: null, error: creditError };
    return { user, error: null };
  } catch (err) {
    return { user: null, error: { message: err.message } };
  }
}

// Decrement credits for a user by 1
export async function decrementCredits(user_id) {
  // Get current credits
  const { data, error } = await supabase
    .from('credits')
    .select('credits_left')
    .eq('user_id', user_id)
    .single();
  if (error || !data) return { error: error || { message: 'No credits found' } };
  const newCredits = Math.max(0, (data.credits_left || 0) - 1);
  const { error: updateError } = await supabase
    .from('credits')
    .update({ credits_left: newCredits, updated_at: new Date().toISOString() })
    .eq('user_id', user_id);
  if (updateError) return { error: updateError };
  return { credits_left: newCredits };
}

// Login a user (custom, no Supabase Auth)
export async function loginUser(email, password) {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    if (error || !user) {
      return { user: null, error: { message: 'No user found' } };
    }
    // Compare password
    const match = bcrypt.compareSync(password, user.password_hash);
    if (!match) {
      return { user: null, error: { message: 'Incorrect password' } };
    }
    return { user, error: null };
  } catch (err) {
    return { user: null, error: { message: err.message } };
  }
}

// Get credits for a user
export async function getCredits(user_id) {
  const { data, error } = await supabase
    .from('credits')
    .select('credits_left')
    .eq('user_id', user_id)
    .single();
  return { credits: data?.credits_left, error };
}

// Update credits for a user
export async function updateCredits(user_id, credits_left) {
  const { data, error } = await supabase
    .from('credits')
    .update({ credits_left, updated_at: new Date().toISOString() })
    .eq('user_id', user_id);
  return { data, error };
}

// Add a history record
export async function addHistory(user_id, file_name, content) {
  const { data, error } = await supabase
    .from('history')
    .insert([{ user_id, file_name, content }]);
  return { data, error };
}

// Add a project with input and humanized output
export async function addProject(user_id, text_input, humanized_text_output) {
  const { data, error } = await supabase
    .from('projects')
    .insert([{ user_id, text_input, humanized_text_output }]);
  return { data, error };
}

// Get history for a user
export async function getHistory(user_id) {
  const { data, error } = await supabase
    .from('history')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });
  return { data, error };
}



// Get projects for a user
export async function getProjects(user_id) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });
  return { data, error };
}
