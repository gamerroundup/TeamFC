import { createClient } from '@supabase/supabase-js'

export const getSupabaseClient = (url, anonKey) => {
  if (!url || !anonKey) return null;
  try {
    return createClient(url, anonKey);
  } catch (e) {
    console.error("Failed to initialize Supabase client:", e);
    return null;
  }
};
