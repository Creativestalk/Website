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
    // Handle different Cloudinary URL formats
    const patterns = [
      /\/upload\/(?:v\d+\/)?([^\/\.]+)/,  // Standard upload URL
      /\/([^\/\.]+)\.[^\/]+$/,            // Simple filename
      /\/upload\/([^\/\.]+)/              // Without version
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
    console.log('🗑️ Attempting to delete from Cloudinary:', publicId);
    
    // Create signature for authenticated deletion
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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            public_id: publicId,
            timestamp: timestamp,
            upload_preset: CLOUDINARY_UPLOAD_PRESET
          }),
        });

        const result = await response.json();
        console.log(`☁️ Cloudinary response (${deleteUrl}):`, result);
        
        if (result.result === 'ok' || result.result === 'not found') {
          console.log('✅ Successfully deleted from Cloudinary');
          return true;
        }
      } catch (error) {
        console.log(`❌ Failed deletion attempt for ${deleteUrl}:`, error);
        continue;
      }
    }
    
    console.warn('⚠️ Could not delete from Cloudinary, but continuing...');
    return true;
  } catch (error) {
    console.error('💥 Error deleting from Cloudinary:', error);
    return true; // Don't block database deletion
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

  // COMPLETELY REWRITTEN REMOVE FUNCTION
  async remove(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      console.error('❌ Supabase not configured');
      return false;
    }

    console.log('\n🗑️ ===== STARTING DELETION PROCESS =====');
    console.log('🎯 Target ID:', id);

    try {
      // STEP 1: Verify item exists and get details
      console.log('\n📋 STEP 1: Fetching item details...');
      const { data: item, error: fetchError } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('id', id)
        .maybeSingle(); // Use maybeSingle to avoid errors if not found

      if (fetchError) {
        console.error('❌ Fetch error:', fetchError);
        return false;
      }

      if (!item) {
        console.log('⚠️ Item not found, considering deletion successful');
        return true;
      }

      console.log('✅ Found item:', {
        id: item.id,
        title: item.title,
        hasCloudinaryUrl: !!item.cloudinary_url
      });

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

      // STEP 3: Delete from database with multiple attempts
      console.log('\n🗄️ STEP 3: Deleting from database...');
      
      // Attempt 1: Direct delete
      console.log('🔄 Attempt 1: Direct DELETE...');
      const { error: deleteError, count } = await supabase
        .from('portfolio_items')
        .delete({ count: 'exact' })
        .eq('id', id);

      if (deleteError) {
        console.error('❌ Direct delete failed:', deleteError);
        
        // Attempt 2: Using RPC function
        console.log('🔄 Attempt 2: Using RPC function...');
        try {
          const { data: rpcResult, error: rpcError } = await supabase
            .rpc('delete_portfolio_item', { item_id: id });

          if (rpcError) {
            console.error('❌ RPC delete failed:', rpcError);
            return false;
          }

          console.log('✅ RPC delete result:', rpcResult);
          if (!rpcResult) {
            console.error('❌ RPC returned false');
            return false;
          }
        } catch (rpcErr) {
          console.error('❌ RPC function not available:', rpcErr);
          return false;
        }
      } else {
        console.log('✅ Direct delete succeeded, affected rows:', count);
      }

      // STEP 4: Verify deletion
      console.log('\n🔍 STEP 4: Verifying deletion...');
      const { data: verifyData, error: verifyError } = await supabase
        .from('portfolio_items')
        .select('id')
        .eq('id', id)
        .maybeSingle();

      if (verifyError) {
        console.error('❌ Verification error:', verifyError);
        return false;
      }

      if (verifyData) {
        console.error('❌ DELETION FAILED - Item still exists!');
        return false;
      }

      console.log('✅ DELETION VERIFIED - Item no longer exists');
      console.log('🎉 ===== DELETION COMPLETED SUCCESSFULLY =====\n');
      return true;

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

  // Bulk delete with better error handling
  async bulkRemove(ids: string[]): Promise<{ success: string[]; failed: string[] }> {
    const success: string[] = [];
    const failed: string[] = [];

    console.log('\n🗑️ ===== STARTING BULK DELETE =====');
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

    console.log('\n🏁 ===== BULK DELETE COMPLETED =====');
    console.log('✅ Successful deletions:', success.length);
    console.log('❌ Failed deletions:', failed.length);
    console.log('📊 Success rate:', `${Math.round((success.length / ids.length) * 100)}%`);
    
    return { success, failed };
  },

  // Enhanced connection test
  async testConnection(): Promise<{ connected: boolean; canRead: boolean; canWrite: boolean; canDelete: boolean }> {
    try {
      if (!isSupabaseConfigured()) {
        console.log('❌ Supabase not configured');
        return { connected: false, canRead: false, canWrite: false, canDelete: false };
      }

      console.log('\n🔍 ===== TESTING CONNECTION =====');

      // Test 1: Read
      console.log('📖 Test 1: Read permissions...');
      const { data: readData, error: readError } = await supabase
        .from('portfolio_items')
        .select('id, title')
        .limit(1);

      const canRead = !readError;
      console.log('📖 Read result:', canRead ? '✅ SUCCESS' : '❌ FAILED', readError?.message);

      // Test 2: Write
      console.log('✏️ Test 2: Write permissions...');
      const testItem = {
        title: `🧪 Test Item ${Date.now()}`,
        category: 'test',
        thumbnail: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=TEST',
        upload_type: 'link' as const,
        description: 'This is a test item for permission testing'
      };

      const { data: writeData, error: writeError } = await supabase
        .from('portfolio_items')
        .insert([testItem])
        .select()
        .single();

      const canWrite = !writeError && writeData;
      console.log('✏️ Write result:', canWrite ? '✅ SUCCESS' : '❌ FAILED', writeError?.message);

      // Test 3: Delete
      console.log('🗑️ Test 3: Delete permissions...');
      let canDelete = false;
      if (canWrite && writeData) {
        console.log('🎯 Attempting to delete test item:', writeData.id);
        
        // Try direct delete
        const { error: deleteError } = await supabase
          .from('portfolio_items')
          .delete()
          .eq('id', writeData.id);

        if (deleteError) {
          console.log('❌ Direct delete failed:', deleteError.message);
          
          // Try RPC delete
          try {
            const { data: rpcResult, error: rpcError } = await supabase
              .rpc('delete_portfolio_item', { item_id: writeData.id });
            
            canDelete = !rpcError && rpcResult;
            console.log('🗑️ RPC delete result:', canDelete ? '✅ SUCCESS' : '❌ FAILED', rpcError?.message);
          } catch (rpcErr) {
            console.log('❌ RPC not available:', rpcErr);
          }
        } else {
          canDelete = true;
          console.log('🗑️ Direct delete result: ✅ SUCCESS');
        }

        // Verify deletion
        if (canDelete) {
          const { data: verifyData } = await supabase
            .from('portfolio_items')
            .select('id')
            .eq('id', writeData.id)
            .maybeSingle();
          
          if (verifyData) {
            console.log('⚠️ Warning: Item still exists after deletion');
            canDelete = false;
          }
        }
      } else {
        console.log('⏭️ Skipping delete test - write failed');
      }

      const result = {
        connected: true,
        canRead,
        canWrite,
        canDelete
      };

      console.log('\n📊 ===== CONNECTION TEST RESULTS =====');
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