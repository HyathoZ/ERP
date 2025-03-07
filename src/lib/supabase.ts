import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please connect to Supabase using the button in the top right.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper to check if user has a specific role
export async function userHasRole(userId: string, roleName: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', userId)
    .eq('roles.name', roleName)
    .single();

  if (error) {
    console.error('Error checking user role:', error);
    return false;
  }

  return !!data;
}

// Helper to get user's company ID
export async function getUserCompanyId(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('users')
    .select('company_id')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('Error getting user company:', error);
    return null;
  }

  return data.company_id;
}