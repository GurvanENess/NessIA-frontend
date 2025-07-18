import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL_PROD;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY_PROD;

// Supabase service
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
