/*
  # Fix Delete Policy for Portfolio Items

  1. Security Updates
    - Add DELETE policy for portfolio_items table
    - Ensure proper permissions for all CRUD operations

  2. Policy Changes
    - Allow public delete access (you can restrict this later if needed)
    - Maintain existing read, insert, and update policies
*/

-- Drop existing delete policy if it exists
DROP POLICY IF EXISTS "Anyone can delete portfolio items" ON portfolio_items;

-- Create delete policy for portfolio items
CREATE POLICY "Anyone can delete portfolio items"
  ON portfolio_items
  FOR DELETE
  TO public
  USING (true);

-- Verify all policies exist
DO $$
BEGIN
  -- Check if all required policies exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'portfolio_items' 
    AND policyname = 'Anyone can view portfolio items'
  ) THEN
    CREATE POLICY "Anyone can view portfolio items"
      ON portfolio_items
      FOR SELECT
      TO public
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'portfolio_items' 
    AND policyname = 'Anyone can insert portfolio items'
  ) THEN
    CREATE POLICY "Anyone can insert portfolio items"
      ON portfolio_items
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'portfolio_items' 
    AND policyname = 'Anyone can update portfolio items'
  ) THEN
    CREATE POLICY "Anyone can update portfolio items"
      ON portfolio_items
      FOR UPDATE
      TO public
      USING (true);
  END IF;
END $$;