/*
  # Fix RLS Policies for Similarity Tables
  
  1. Changes
    - Drop existing restrictive policies
    - Add new policies allowing public read access (both authenticated and anonymous users)
  
  2. Security
    - Allow anyone to view similarity themes and teachings
    - Maintain RLS enabled for security
    - No write access (content is admin-managed)
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view similarity themes" ON similarity_themes;
DROP POLICY IF EXISTS "Anyone can view similarity teachings" ON similarity_teachings;

-- Create new policies for public read access
CREATE POLICY "Public can view similarity themes"
  ON similarity_themes
  FOR SELECT
  USING (true);

CREATE POLICY "Public can view similarity teachings"
  ON similarity_teachings
  FOR SELECT
  USING (true);
