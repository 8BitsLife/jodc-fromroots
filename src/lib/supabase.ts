import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasValidConfig = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.trim() !== "" &&
  supabaseUrl !== "https://your-project-id.supabase.co"
);

export const isSupabaseConfigured = hasValidConfig;

export const supabase: SupabaseClient | null = hasValidConfig
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;
