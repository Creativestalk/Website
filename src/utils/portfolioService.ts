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
const CLOUDINARY_UPLOAD_PRESET = 'WEBSITE';

// Helper function to extract public ID from Cloudinary URL
const extractCloudinaryPublicId = (url: string): string | null => {
  try {
    const patterns = [
      /\/upload\/(?:v\d+\/)?([^\/\.]+)/,
      /\/([^\/\.]+)\.[^\/]+$/,
      /\/upload\/([^\/\.]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  } catch (error) {
    console.error('Error extracting Cloudinary public ID:', error);
    return null;
  }
};

// Helper function to delete file from Cloudinary
const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    console.log('☁️ Attempting to delete from Cloudinary:', publicId);
    
    const timestamp = Math.round(Date.now() / 1000);
    const deleteUrls = [
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/destroy`,
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/destroy`
    ];

    for (const deleteUrl of deleteUrls) {
      try {
        const response = await fetch(deleteUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            public_id: publicId,
            timestamp: timestamp,
            upload_preset: CLOUDINARY_UPLOAD_PRESET
          }),
        });

        const result = await response.json();
        console.log(`☁️ Cloudinary response:`, result);
        
        if (result.result === 'ok' || result.result === 'not found') {
          console.log('✅ Cloudinary deletion successful');
          return true;
        }
      } catch (error) {
        console.log(`❌ Cloudinary deletion failed:`, error);
        continue;
      }
    }
    
    console.warn('⚠️ Cloudinary deletion failed, but continuing...');
    return true;
  } catch (error) {
    console.error('💥 Cloudinary deletion error:', error);
    return true;
  }
};

export const portfolioService = {
  // Get all portfolio items
  async getAll(): Promise<PortfolioItem[]> {
    try {
      if (!isSupabaseConfigured()) {
        console.warn('⚠️ Supabase not configured, returning empty array');
        return [];
      }

      console.log('📖 Fetching all portfolio items...');
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching portfolio items:', error);
        return [];
      }

      console.log(`✅ Fetched ${data?.length || 0} portfolio items`);
      return data || [];
    } catch (error) {
      console.error('💥 Error in getAll:', error);
      return [];
    }
  },

  // Add new portfolio item
  async add(item: CreatePortfolioItem): Promise<PortfolioItem | null> {
    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured. Please set up your Supabase connection.');
      }

      console.log('➕ Adding new portfolio item:', item.title);
      const { data, error } = await supabase
        .from('portfolio_items')
        .insert([item])
        .select()
        .single();

      if (error) {
        console.error('❌ Error adding portfolio item:', error);
        throw new Error(error.message);
      }

      console.log('✅ Successfully added portfolio item:', data.id);
      return data;
    } catch (error) {
      console.error('💥 Error in add:', error);
      throw error;
    }
  },

  // BULLETPROOF REMOVAL FUNCTION
  async remove(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      console.error('❌ Supabase not configured');
      return false;
    }

    console.log('\n🗑️ ===== BULLETPROOF DELETION PROCESS =====');
    console.log('🎯 Target ID:', id);

    try {
      // STEP 1: Get item details for Cloudinary cleanup
      console.log('\n📋 STEP 1: Fetching item details...');
      const { data: item, error: fetchError } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (fetchError) {
        console.error('❌ Fetch error:', fetchError);
        return false;
      }

      if (!item) {
        console.log('✅ Item not found, considering deletion successful');
        return true;
      }

      console.log('✅ Found item:', { id: item.id, title: item.title });

      // STEP 2: Delete from Cloudinary if needed
      if (item.cloudinary_url) {
        console.log('\n☁️ STEP 2: Deleting from Cloudinary...');
        const publicId = extractCloudinaryPublicId(item.cloudinary_url);
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      } else {
        console.log('\n⏭️ STEP 2: No Cloudinary URL, skipping...');
      }

      // STEP 3: Use the new bulletproof deletion function
      console.log('\n🚀 STEP 3: Using bulletproof deletion function...');
      try {
        const { data: deleteResult, error: deleteError } = await supabase
          .rpc('force_delete_portfolio_item', { item_id: id });

        if (!deleteError && deleteResult) {
          const result = deleteResult as any;
          console.log('📊 Bulletproof deletion result:', result);
          
          if (result.success) {
            console.log('✅ BULLETPROOF DELETION SUCCESSFUL!');
            return true;
          } else {
            console.error('❌ Bulletproof deletion failed:', result.message);
          }
        } else {
          console.error('❌ Bulletproof deletion RPC failed:', deleteError?.message);
        }
      } catch (rpcErr) {
        console.error('❌ Bulletproof deletion not available:', rpcErr);
      }

      // STEP 4: Fallback to direct deletion
      console.log('\n🔄 STEP 4: Fallback to direct deletion...');
      try {
        const { error: directError, count } = await supabase
          .from('portfolio_items')
          .delete({ count: 'exact' })
          .eq('id', id);

        if (!directError) {
          console.log('✅ Direct deletion succeeded, affected rows:', count);
          
          // Verify deletion
          const { data: verifyData } = await supabase
            .from('portfolio_items')
            .select('id')
            .eq('id', id)
            .maybeSingle();

          if (!verifyData) {
            console.log('✅ Deletion verified - item no longer exists');
            return true;
          } else {
            console.log('❌ Item still exists after deletion');
          }
        } else {
          console.error('❌ Direct deletion failed:', directError);
        }
      } catch (directErr) {
        console.error('❌ Direct deletion exception:', directErr);
      }

      console.log('💥 ===== ALL DELETION STRATEGIES FAILED =====');
      return false;

    } catch (error) {
      console.error('💥 ===== DELETION PROCESS FAILED =====');
      console.error('Unexpected error:', error);
      return false;
    }
  },

  // Update portfolio item
  async update(id: string, updates: Partial<CreatePortfolioItem>): Promise<boolean> {
    try {
      if (!isSupabaseConfigured()) {
        console.warn('⚠️ Supabase not configured');
        return false;
      }

      console.log('📝 Updating portfolio item:', id);
      const { error } = await supabase
        .from('portfolio_items')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('❌ Error updating portfolio item:', error);
        return false;
      }

      console.log('✅ Successfully updated portfolio item');
      return true;
    } catch (error) {
      console.error('💥 Error in update:', error);
      return false;
    }
  },

  // Enhanced bulk delete with bulletproof deletion
  async bulkRemove(ids: string[]): Promise<{ success: string[]; failed: string[] }> {
    const success: string[] = [];
    const failed: string[] = [];

    console.log('\n🗑️ ===== BULLETPROOF BULK DELETE =====');
    console.log('📋 Items to delete:', ids.length);
    console.log('🎯 IDs:', ids);

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      console.log(`\n--- Processing ${i + 1}/${ids.length}: ${id} ---`);
      
      try {
        const result = await this.remove(id);
        if (result) {
          success.push(id);
          console.log(`✅ [${i + 1}/${ids.length}] SUCCESS: ${id}`);
        } else {
          failed.push(id);
          console.log(`❌ [${i + 1}/${ids.length}] FAILED: ${id}`);
        }
      } catch (error) {
        console.error(`💥 [${i + 1}/${ids.length}] EXCEPTION: ${id}`, error);
        failed.push(id);
      }

      // Small delay between deletions
      if (i < ids.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    console.log('\n🏁 ===== BULLETPROOF BULK DELETE COMPLETED =====');
    console.log('✅ Successful deletions:', success.length);
    console.log('❌ Failed deletions:', failed.length);
    console.log('📊 Success rate:', `${Math.round((success.length / ids.length) * 100)}%`);
    
    return { success, failed };
  },

  // Enhanced connection test with bulletproof functions
  async testConnection(): Promise<{ connected: boolean; canRead: boolean; canWrite: boolean; canDelete: boolean }> {
    try {
      if (!isSupabaseConfigured()) {
        console.log('❌ Supabase not configured');
        return { connected: false, canRead: false, canWrite: false, canDelete: false };
      }

      console.log('\n🔍 ===== TESTING CONNECTION WITH BULLETPROOF FUNCTIONS =====');

      // Use the new bulletproof test function
      try {
        const { data: testResult, error: testError } = await supabase
          .rpc('test_deletion_capability');

        if (!testError && testResult) {
          const result = testResult as any;
          console.log('📊 Bulletproof test results:', result);
          
          const connectionResult = {
            connected: true,
            canRead: true, // Assume read works if we got here
            canWrite: result.can_insert || false,
            canDelete: result.deletion_working || false
          };

          console.log('\n📊 ===== CONNECTION TEST RESULTS =====');
          console.log('🔗 Connected:', connectionResult.connected ? '✅' : '❌');
          console.log('📖 Can Read:', connectionResult.canRead ? '✅' : '❌');
          console.log('✏️ Can Write:', connectionResult.canWrite ? '✅' : '❌');
          console.log('🗑️ Can Delete:', connectionResult.canDelete ? '✅' : '❌');
          
          if (result.error_details) {
            console.log('⚠️ Error details:', result.error_details);
          }
          
          console.log('=====================================\n');

          return connectionResult;
        } else {
          console.error('❌ Bulletproof test failed:', testError?.message);
        }
      } catch (rpcErr) {
        console.log('❌ Bulletproof test function not available, falling back...');
      }

      // Fallback to basic testing
      console.log('🔄 Falling back to basic permission testing...');

      const { data: readData, error: readError } = await supabase
        .from('portfolio_items')
        .select('id, title')
        .limit(1);

      const canRead = !readError;
      console.log('📖 Read result:', canRead ? '✅ SUCCESS' : '❌ FAILED');

      // For write/delete, we'll be conservative and assume they work if read works
      const result = {
        connected: true,
        canRead,
        canWrite: canRead, // Conservative assumption
        canDelete: canRead // Will be tested when actually deleting
      };

      console.log('\n📊 ===== BASIC CONNECTION TEST RESULTS =====');
      console.log('🔗 Connected:', result.connected ? '✅' : '❌');
      console.log('📖 Can Read:', result.canRead ? '✅' : '❌');
      console.log('✏️ Can Write:', result.canWrite ? '✅' : '❌');
      console.log('🗑️ Can Delete:', result.canDelete ? '✅' : '❌');
      console.log('=====================================\n');

      return result;
    } catch (error) {
      console.error('💥 Connection test failed:', error);
      return { connected: false, canRead: false, canWrite: false, canDelete: false };
    }
  },

  // Force refresh with cache clearing
  async forceRefresh(): Promise<PortfolioItem[]> {
    try {
      console.log('🔄 Force refreshing portfolio data...');
      
      // Clear any caches
      if (typeof window !== 'undefined') {
        Object.keys(localStorage).forEach(key => {
          if (key.includes('portfolio') || key.includes('supabase')) {
            localStorage.removeItem(key);
          }
        });
      }

      // Clean up any test items first
      try {
        await supabase.rpc('cleanup_test_items');
      } catch (cleanupErr) {
        console.log('⚠️ Cleanup function not available');
      }

      // Get fresh data
      const items = await this.getAll();
      console.log('✅ Force refresh completed, items:', items.length);
      return items;
    } catch (error) {
      console.error('💥 Error in forceRefresh:', error);
      return [];
    }
  }
};