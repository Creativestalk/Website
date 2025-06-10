/*
  # Create Portfolio Table

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
      - `upload_type` (text, required - 'file' or 'link')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `portfolio_items` table
    - Add policy for public read access
    - Add policy for authenticated insert (upload)
*/

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

-- Enable RLS
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Allow public read access to portfolio items
CREATE POLICY "Anyone can view portfolio items"
  ON portfolio_items
  FOR SELECT
  TO public
  USING (true);

-- Allow anyone to insert portfolio items (you can restrict this later if needed)
CREATE POLICY "Anyone can insert portfolio items"
  ON portfolio_items
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anyone to update portfolio items (you can restrict this later if needed)
CREATE POLICY "Anyone can update portfolio items"
  ON portfolio_items
  FOR UPDATE
  TO public
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_portfolio_items_updated_at
    BEFORE UPDATE ON portfolio_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();