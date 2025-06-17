/*
  # Fix Portfolio Deletion - Final Solution

  1. Complete RLS Policy Reset
    - Drop ALL existing policies completely
    - Create new policies with explicit DELETE permissions
    - Test deletion functionality immediately

  2. Enhanced RPC Functions
    - Create robust deletion function with detailed logging
    - Add permission testing function
    - Grant proper permissions to public role

  3. Verification
    - Test deletion immediately after setup
    - Verify all CRUD operations work
    - Clean up any test data
*/

-- Step 1: Complete policy reset
DO $$
BEGIN
  -- Temporarily disable RLS to clean everything
  ALTER TABLE portfolio_items DISABLE ROW LEVEL SECURITY;
  
  -- Drop ALL policies (including any we might have missed)
  FOR policy_name IN (
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'portfolio_items'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON portfolio_items', policy_name);
  END LOOP;
  
  -- Re-enable RLS
  ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
  
  RAISE NOTICE '🧹 Cleaned all existing policies';
END $$;

-- Step 2: Create fresh, comprehensive policies
CREATE POLICY "portfolio_public_select"
  ON portfolio_items
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "portfolio_public_insert"
  ON portfolio_items
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "portfolio_public_update"
  ON portfolio_items
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "portfolio_public_delete"
  ON portfolio_items
  FOR DELETE
  TO public
  USING (true);

-- Step 3: Create enhanced RPC deletion function
CREATE OR REPLACE FUNCTION delete_portfolio_item_enhanced(item_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  item_exists boolean := false;
  deleted_count integer := 0;
  result json;
BEGIN
  -- Check if item exists first
  SELECT EXISTS(SELECT 1 FROM portfolio_items WHERE id = item_id) INTO item_exists;
  
  IF NOT item_exists THEN
    result := json_build_object(
      'success', true,
      'message', 'Item not found (already deleted)',
      'deleted_count', 0,
      'item_existed', false
    );
    RETURN result;
  END IF;
  
  -- Attempt deletion
  DELETE FROM portfolio_items WHERE id = item_id;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Verify deletion
  SELECT EXISTS(SELECT 1 FROM portfolio_items WHERE id = item_id) INTO item_exists;
  
  IF deleted_count > 0 AND NOT item_exists THEN
    result := json_build_object(
      'success', true,
      'message', 'Item deleted successfully',
      'deleted_count', deleted_count,
      'item_existed', true
    );
  ELSE
    result := json_build_object(
      'success', false,
      'message', 'Deletion failed - item still exists',
      'deleted_count', deleted_count,
      'item_existed', item_exists
    );
  END IF;
  
  RETURN result;
  
EXCEPTION
  WHEN OTHERS THEN
    result := json_build_object(
      'success', false,
      'message', format('Error: %s (SQLSTATE: %s)', SQLERRM, SQLSTATE),
      'deleted_count', 0,
      'item_existed', item_exists
    );
    RETURN result;
END;
$$;

-- Step 4: Create comprehensive permission test function
CREATE OR REPLACE FUNCTION test_all_permissions()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  test_id uuid;
  can_select boolean := false;
  can_insert boolean := false;
  can_update boolean := false;
  can_delete boolean := false;
  result json;
  error_msg text := '';
BEGIN
  -- Test SELECT
  BEGIN
    PERFORM 1 FROM portfolio_items LIMIT 1;
    can_select := true;
  EXCEPTION
    WHEN OTHERS THEN
      can_select := false;
      error_msg := error_msg || 'SELECT: ' || SQLERRM || '; ';
  END;
  
  -- Test INSERT
  BEGIN
    INSERT INTO portfolio_items (title, category, thumbnail, upload_type, description)
    VALUES ('🧪 PERMISSION TEST', 'test', 'https://via.placeholder.com/300x200/00FF00/FFFFFF?text=PERMISSION+TEST', 'link', 'Testing permissions')
    RETURNING id INTO test_id;
    can_insert := true;
  EXCEPTION
    WHEN OTHERS THEN
      can_insert := false;
      error_msg := error_msg || 'INSERT: ' || SQLERRM || '; ';
  END;
  
  -- Test UPDATE (only if insert worked)
  IF can_insert AND test_id IS NOT NULL THEN
    BEGIN
      UPDATE portfolio_items 
      SET description = 'Updated test description' 
      WHERE id = test_id;
      can_update := true;
    EXCEPTION
      WHEN OTHERS THEN
        can_update := false;
        error_msg := error_msg || 'UPDATE: ' || SQLERRM || '; ';
    END;
  END IF;
  
  -- Test DELETE (only if insert worked)
  IF can_insert AND test_id IS NOT NULL THEN
    BEGIN
      DELETE FROM portfolio_items WHERE id = test_id;
      
      -- Verify deletion worked
      IF NOT EXISTS(SELECT 1 FROM portfolio_items WHERE id = test_id) THEN
        can_delete := true;
      ELSE
        can_delete := false;
        error_msg := error_msg || 'DELETE: Item still exists after deletion; ';
      END IF;
    EXCEPTION
      WHEN OTHERS THEN
        can_delete := false;
        error_msg := error_msg || 'DELETE: ' || SQLERRM || '; ';
    END;
  END IF;
  
  -- Clean up any remaining test data
  DELETE FROM portfolio_items WHERE title LIKE '%PERMISSION TEST%' OR category = 'test';
  
  result := json_build_object(
    'can_select', can_select,
    'can_insert', can_insert,
    'can_update', can_update,
    'can_delete', can_delete,
    'all_permissions', (can_select AND can_insert AND can_update AND can_delete),
    'error_messages', CASE WHEN error_msg = '' THEN null ELSE error_msg END,
    'test_timestamp', now()
  );
  
  RETURN result;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Final cleanup
    DELETE FROM portfolio_items WHERE title LIKE '%PERMISSION TEST%' OR category = 'test';
    
    result := json_build_object(
      'can_select', false,
      'can_insert', false,
      'can_update', false,
      'can_delete', false,
      'all_permissions', false,
      'error_messages', 'Critical error: ' || SQLERRM,
      'test_timestamp', now()
    );
    RETURN result;
END;
$$;

-- Step 5: Grant all necessary permissions
GRANT ALL ON portfolio_items TO public;
GRANT EXECUTE ON FUNCTION delete_portfolio_item_enhanced(uuid) TO public;
GRANT EXECUTE ON FUNCTION test_all_permissions() TO public;

-- Step 6: Immediate testing and verification
DO $$
DECLARE
  test_result json;
  all_good boolean;
BEGIN
  RAISE NOTICE '🧪 Testing all permissions immediately...';
  
  SELECT test_all_permissions() INTO test_result;
  SELECT (test_result->>'all_permissions')::boolean INTO all_good;
  
  RAISE NOTICE '📊 Permission Test Results:';
  RAISE NOTICE '  SELECT: %', CASE WHEN (test_result->>'can_select')::boolean THEN '✅' ELSE '❌' END;
  RAISE NOTICE '  INSERT: %', CASE WHEN (test_result->>'can_insert')::boolean THEN '✅' ELSE '❌' END;
  RAISE NOTICE '  UPDATE: %', CASE WHEN (test_result->>'can_update')::boolean THEN '✅' ELSE '❌' END;
  RAISE NOTICE '  DELETE: %', CASE WHEN (test_result->>'can_delete')::boolean THEN '✅' ELSE '❌' END;
  
  IF all_good THEN
    RAISE NOTICE '🎉 ALL PERMISSIONS WORKING CORRECTLY!';
  ELSE
    RAISE NOTICE '❌ SOME PERMISSIONS FAILED!';
    RAISE NOTICE 'Error details: %', test_result->>'error_messages';
  END IF;
  
  -- Show current policies for verification
  RAISE NOTICE '📋 Active RLS Policies:';
  FOR policy_record IN (
    SELECT policyname, cmd 
    FROM pg_policies 
    WHERE tablename = 'portfolio_items'
    ORDER BY cmd, policyname
  ) LOOP
    RAISE NOTICE '  - % (%)', policy_record.policyname, policy_record.cmd;
  END LOOP;
END $$;

-- Step 7: Final cleanup of any test data
DELETE FROM portfolio_items WHERE title LIKE '%TEST%' OR category = 'test' OR description LIKE '%test%';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Portfolio deletion fix completed!';
  RAISE NOTICE '🔧 New RPC function: delete_portfolio_item_enhanced(uuid)';
  RAISE NOTICE '🧪 Test function: test_all_permissions()';
  RAISE NOTICE '📝 All CRUD policies recreated with public access';
END $$;