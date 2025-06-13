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

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'dbthy4lg2';

// Helper function to extract public ID from Cloudinary URL
const extractCloudinaryPublicId = (url: string): string | null => {
  try {
    // Handle different Cloudinary URL formats
    const regex = /\/(?:v\d+\/)?([^\/]+)\.[^\/]+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting Cloudinary public ID:', error);
    return null;
  }
};

// Helper function to delete file from Cloudinary
const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    // Note: For security reasons, Cloudinary deletion should ideally be done server-side
    // This is a client-side approach using the unsigned delete API
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_id: publicId,
          // Note: In production, you should use a signed request with timestamp and signature
        }),
      }
    );

    const result = await response.json();
    console.log('Cloudinary deletion result:', result);
    
    // Cloudinary returns "ok" for successful deletions
    return result.result === 'ok' || result.result === 'not found';
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    // Don't fail the entire operation if Cloudinary deletion fails
    return true;
  }
};

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

  // Remove portfolio item (with Cloudinary cleanup)
  async remove(id: string): Promise<boolean> {
    try {
      if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured');
        return false;
      }

      // First, get the item to check if it has a Cloudinary URL
      const { data: item, error: fetchError } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching item for deletion:', fetchError);
        return false;
      }

      // If the item has a Cloudinary URL, try to delete the file
      if (item?.cloudinary_url) {
        const publicId = extractCloudinaryPublicId(item.cloudinary_url);
        if (publicId) {
          console.log('Attempting to delete from Cloudinary:', publicId);
          await deleteFromCloudinary(publicId);
        }
      }

      // Delete from Supabase database
      const { error: deleteError } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Error removing portfolio item from database:', deleteError);
        return false;
      }

      console.log('Successfully deleted item:', id);
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
  },

  // Bulk delete items
  async bulkRemove(ids: string[]): Promise<{ success: string[]; failed: string[] }> {
    const success: string[] = [];
    const failed: string[] = [];

    for (const id of ids) {
      try {
        const result = await this.remove(id);
        if (result) {
          success.push(id);
        } else {
          failed.push(id);
        }
      } catch (error) {
        console.error(`Failed to delete item ${id}:`, error);
        failed.push(id);
      }
    }

    return { success, failed };
  }
};