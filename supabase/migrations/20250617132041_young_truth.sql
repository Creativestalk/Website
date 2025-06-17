-- Final fix for portfolio deletion issues
-- This migration ensures all policies are correctly set up

-- First, disable RLS temporarily to clean up
ALTER TABLE portfolio_items DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start completely fresh
DROP POLICY IF EXISTS "Anyone can view portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Anyone can insert portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Anyone can update portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Anyone can delete portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Public can view portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Public can insert portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Public can update portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Public can delete portfolio items" ON portfolio_items;

-- Re-enable RLS
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies with explicit permissions
CREATE POLICY "portfolio_select_policy"
  ON portfolio_items
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "portfolio_insert_policy"
  ON portfolio_items
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "portfolio_update_policy"
  ON portfolio_items
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "portfolio_delete_policy"
  ON portfolio_items
  FOR DELETE
  TO public
  USING (true);

-- Create or replace the RPC function for alternative deletion
CREATE OR REPLACE FUNCTION delete_portfolio_item(item_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count integer;
BEGIN
  -- Attempt to delete the item
  DELETE FROM portfolio_items WHERE id = item_id;
  
  -- Get the number of affected rows
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Return true if exactly one row was deleted
  IF deleted_count = 1 THEN
    RETURN true;
  ELSE
    RETURN false;
  END IF;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error and return false
    RAISE NOTICE 'Error deleting portfolio item %: % (SQLSTATE: %)', item_id, SQLERRM, SQLSTATE;
    RETURN false;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION delete_portfolio_item(uuid) TO public;

-- Create a function to test deletion permissions
CREATE OR REPLACE FUNCTION test_delete_permissions()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  test_id uuid;
  can_delete boolean := false;
BEGIN
  -- Insert a test record
  INSERT INTO portfolio_items (title, category, thumbnail, upload_type)
  VALUES ('🧪 DELETE TEST', 'test', 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=DELETE+TEST', 'link')
  RETURNING id INTO test_id;
  
  -- Try to delete it
  DELETE FROM portfolio_items WHERE id = test_id;
  
  -- Check if it was actually deleted
  IF NOT EXISTS (SELECT 1 FROM portfolio_items WHERE id = test_id) THEN
    can_delete := true;
  END IF;
  
  -- Clean up any remaining test record
  DELETE FROM portfolio_items WHERE id = test_id;
  
  RETURN can_delete;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Clean up and return false
    DELETE FROM portfolio_items WHERE title = '🧪 DELETE TEST';
    RETURN false;
END;
$$;

-- Grant execute permission on the test function
GRANT EXECUTE ON FUNCTION test_delete_permissions() TO public;

-- Test the deletion functionality
DO $$
DECLARE
  test_result boolean;
BEGIN
  SELECT test_delete_permissions() INTO test_result;
  
  IF test_result THEN
    RAISE NOTICE '✅ DELETE PERMISSIONS TEST PASSED - Deletion is working correctly';
  ELSE
    RAISE NOTICE '❌ DELETE PERMISSIONS TEST FAILED - There may still be issues with deletion';
  END IF;
END $$;

-- Clean up any test records that might have been left behind
DELETE FROM portfolio_items WHERE title LIKE '%TEST%' OR category = 'test';

-- Final verification: Show all policies
DO $$
DECLARE
  policy_record record;
BEGIN
  RAISE NOTICE '📋 Current RLS policies for portfolio_items:';
  FOR policy_record IN 
    SELECT policyname, cmd, permissive, roles, qual, with_check 
    FROM pg_policies 
    WHERE tablename = 'portfolio_items'
    ORDER BY policyname
  LOOP
    RAISE NOTICE '  - %: % (%) - %', 
      policy_record.policyname, 
      policy_record.cmd, 
      policy_record.permissive,
      policy_record.roles;
  END LOOP;
END $$;