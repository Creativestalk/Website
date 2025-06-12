import { supabase, PortfolioItem, isSupabaseConfigured } from '../lib/supabase';

export interface CreatePortfolioItem {
  title: string;
  category: string;
  description?: string;
  youtube_url?: string;
  cloudinary_url?: string;
  thumbnail: string;
  views?: string;
  upload_type: 'file' | 'link';
}

export const portfolioService = {
  // Get all portfolio items
  async getAll(): Promise<PortfolioItem[]> {
    try {
      if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured, returning empty array');
        return [];
      }

      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching portfolio items:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAll:', error);
      return [];
    }
  },

  // Add new portfolio item
  async add(item: CreatePortfolioItem): Promise<PortfolioItem | null> {
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured. Please set up your Supabase connection by adding VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
      }

      const { data, error } = await supabase
        .from('portfolio_items')
        .insert([item])
        .select()
        .single();

      if (error) {
        console.error('Error adding portfolio item:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error in add:', error);
      throw error;
    }
  },

  // Remove portfolio item
  async remove(id: string): Promise<boolean> {
    try {
      if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured');
        return false;
      }

      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error removing portfolio item:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in remove:', error);
      return false;
    }
  },

  // Update portfolio item
  async update(id: string, updates: Partial<CreatePortfolioItem>): Promise<boolean> {
    try {
      if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured');
        return false;
      }

      const { error } = await supabase
        .from('portfolio_items')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error updating portfolio item:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in update:', error);
      return false;
    }
  }
};