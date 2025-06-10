import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback configuration for development/demo purposes
const fallbackUrl = 'https://demo.supabase.co';
const fallbackKey = 'demo-key';

// Use fallback values if environment variables are not available
const url = supabaseUrl || fallbackUrl;
const key = supabaseAnonKey || fallbackKey;

let supabase: any;

try {
  supabase = createClient(url, key);
} catch (error) {
  console.warn('Supabase client creation failed, using mock client:', error);
  // Create a mock client for development
  supabase = {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      delete: () => ({ error: null }),
      update: () => ({ error: null })
    })
  };
}

export { supabase };

export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  description?: string;
  youtube_url?: string;
  cloudinary_url?: string;
  thumbnail: string;
  views?: string;
  upload_type: 'file' | 'link';
  created_at: string;
  updated_at: string;
};