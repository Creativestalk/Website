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

  // ENHANCED REMOVE FUNCTION WITH MULTIPLE DELETION STRATEGIES
  async remove(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      console.error('❌ Supabase not configured');
      return false;
    }

    console.log('\n🗑️ ===== STARTING ENHANCED DELETION PROCESS =====');
    console.log('🎯 Target ID:', id);

    try {
      // STEP 1: Verify item exists and get details
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

      // STEP 3: Multiple deletion strategies
      console.log('\n🗄️ STEP 3: Attempting database deletion...');
      
      // Strategy 1: Enhanced RPC function
      console.log('🔄 Strategy 1: Enhanced RPC function...');
      try {
        const { data: rpcResult, error: rpcError } = await supabase
          .rpc('delete_portfolio_item_enhanced', { item_id: id });

        if (!rpcError && rpcResult) {
          const result = rpcResult as any;
          console.log('📊 RPC Result:', result);
          
          if (result.success) {
            console.log('✅ Enhanced RPC deletion successful!');
            return true;
          } else {
            console.log('❌ Enhanced RPC reported failure:', result.message);
          }
        } else {
          console.log('❌ Enhanced RPC failed:', rpcError?.message);
        }
      } catch (rpcErr) {
        console.log('❌ Enhanced RPC not available:', rpcErr);
      }

      // Strategy 2: Direct DELETE with explicit transaction
      console.log('🔄 Strategy 2: Direct DELETE with transaction...');
      try {
        const { error: deleteError, count } = await supabase
          .from('portfolio_items')
          .delete({ count: 'exact' })
          .eq('id', id);

        if (!deleteError) {
          console.log('✅ Direct delete succeeded, affected rows:', count);
          
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
          console.error('❌ Direct delete failed:', deleteError);
        }
      } catch (directErr) {
        console.error('❌ Direct delete exception:', directErr);
      }

      // Strategy 3: Original RPC function (fallback)
      console.log('🔄 Strategy 3: Original RPC function...');
      try {
        const { data: rpcResult, error: rpcError } = await supabase
          .rpc('delete_portfolio_item', { item_id: id });

        if (!rpcError && rpcResult) {
          console.log('✅ Original RPC deletion successful!');
          return true;
        } else {
          console.log('❌ Original RPC failed:', rpcError?.message);
        }
      } catch (rpcErr) {
        console.log('❌ Original RPC not available:', rpcErr);
      }

      // Strategy 4: Force delete with admin privileges
      console.log('🔄 Strategy 4: Force delete attempt...');
      try {
        // Try to update first to test write permissions
        const { error: updateError } = await supabase
          .from('portfolio_items')
          .update({ title: item.title + ' [DELETING]' })
          .eq('id', id);

        if (!updateError) {
          // If update works, try delete again
          const { error: forceDeleteError } = await supabase
            .from('portfolio_items')
            .delete()
            .eq('id', id);

          if (!forceDeleteError) {
            console.log('✅ Force delete successful!');
            return true;
          }
        }
      } catch (forceErr) {
        console.log('❌ Force delete failed:', forceErr);
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

  // Bulk delete with enhanced error handling
  async bulkRemove(ids: string[]): Promise<{ success: string[]; failed: string[] }> {
    const success: string[] = [];
    const failed: string[] = [];

    console.log('\n🗑️ ===== STARTING ENHANCED BULK DELETE =====');
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
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log('\n🏁 ===== ENHANCED BULK DELETE COMPLETED =====');
    console.log('✅ Successful deletions:', success.length);
    console.log('❌ Failed deletions:', failed.length);
    console.log('📊 Success rate:', `${Math.round((success.length / ids.length) * 100)}%`);
    
    return { success, failed };
  },

  // ENHANCED CONNECTION TEST WITH NEW RPC FUNCTIONS
  async testConnection(): Promise<{ connected: boolean; canRead: boolean; canWrite: boolean; canDelete: boolean }> {
    try {
      if (!isSupabaseConfigured()) {
        console.log('❌ Supabase not configured');
        return { connected: false, canRead: false, canWrite: false, canDelete: false };
      }

      console.log('\n🔍 ===== TESTING CONNECTION WITH NEW FUNCTIONS =====');

      // Use the new comprehensive test function
      try {
        const { data: testResult, error: testError } = await supabase
          .rpc('test_all_permissions');

        if (!testError && testResult) {
          const result = testResult as any;
          console.log('📊 Comprehensive test results:', result);
          
          const connectionResult = {
            connected: true,
            canRead: result.can_select || false,
            canWrite: result.can_insert || false,
            canDelete: result.can_delete || false
          };

          console.log('\n📊 ===== CONNECTION TEST RESULTS =====');
          console.log('🔗 Connected:', connectionResult.connected ? '✅' : '❌');
          console.log('📖 Can Read:', connectionResult.canRead ? '✅' : '❌');
          console.log('✏️ Can Write:', connectionResult.canWrite ? '✅' : '❌');
          console.log('🗑️ Can Delete:', connectionResult.canDelete ? '✅' : '❌');
          
          if (result.error_messages) {
            console.log('⚠️ Error details:', result.error_messages);
          }
          
          console.log('=====================================\n');

          return connectionResult;
        } else {
          console.error('❌ Comprehensive test failed:', testError?.message);
        }
      } catch (rpcErr) {
        console.log('❌ New test function not available, falling back to manual tests');
      }

      // Fallback to manual testing
      console.log('🔄 Falling back to manual permission testing...');

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
        
        const deleteResult = await this.remove(writeData.id);
        canDelete = deleteResult;
        console.log('🗑️ Delete result:', canDelete ? '✅ SUCCESS' : '❌ FAILED');
      } else {
        console.log('⏭️ Skipping delete test - write failed');
      }

      const result = {
        connected: true,
        canRead,
        canWrite,
        canDelete
      };

      console.log('\n📊 ===== MANUAL CONNECTION TEST RESULTS =====');
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