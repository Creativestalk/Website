/*
  # Create portfolio_items table

  1. New Tables
    - `portfolio_items`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `category` (text, required)
      - `description` (text, optional)
      - `youtube_url` (text, optional)
      - `cloudinary_url` (text, optional)
      - `thumbnail` (text, required)
      - `views` (text, optional)
      - `upload_type` (text, required, must be 'file' or 'link')
      - `created_at` (timestamptz, auto-generated)
      - `updated_at` (timestamptz, auto-generated)

  2. Security
    - Enable RLS on `portfolio_items` table
    - Add policies for public access (read, insert, update)

  3. Functions & Triggers
    - Create function to auto-update `updated_at` timestamp
    - Add trigger to call function on updates
*/

-- Create the portfolio_items table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  description text,
  youtube_url text,
  cloudinary_url text,
  thumbnail text NOT NULL,
  views text,
  upload_type text NOT NULL CHECK (upload_type IN ('file', 'link')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Anyone can view portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Anyone can insert portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Anyone can update portfolio items" ON portfolio_items;

-- Create policies for public access
CREATE POLICY "Anyone can view portfolio items"
  ON portfolio_items
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert portfolio items"
  ON portfolio_items
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update portfolio items"
  ON portfolio_items
  FOR UPDATE
  TO public
  USING (true);

-- Create or replace function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists and recreate it
DROP TRIGGER IF EXISTS update_portfolio_items_updated_at ON portfolio_items;

-- Create trigger to automatically update updated_at column
CREATE TRIGGER update_portfolio_items_updated_at
    BEFORE UPDATE ON portfolio_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();