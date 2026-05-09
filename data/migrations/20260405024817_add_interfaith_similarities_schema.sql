/*
  # Add Interfaith Similarities Schema
  
  1. New Tables
    - `similarity_themes`
      - `id` (uuid, primary key)
      - `title` (text) - Theme name like "Golden Rule", "Compassion", "Prayer"
      - `description` (text) - Brief overview of the theme
      - `icon` (text) - Icon name for UI
      - `slug` (text, unique) - URL-friendly identifier
      - `order_index` (integer) - Display order
      - `created_at` (timestamptz)
    
    - `similarity_teachings`
      - `id` (uuid, primary key)
      - `theme_id` (uuid, foreign key to similarity_themes)
      - `tradition_id` (uuid, foreign key to traditions)
      - `teaching` (text) - The specific teaching/quote
      - `source` (text) - Scripture or text reference
      - `context` (text) - Additional explanation
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (authenticated users)
    - No write access needed for now (admin-managed content)
*/

-- Create similarity_themes table
CREATE TABLE IF NOT EXISTS similarity_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  slug text UNIQUE NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create similarity_teachings table
CREATE TABLE IF NOT EXISTS similarity_teachings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id uuid REFERENCES similarity_themes(id) ON DELETE CASCADE NOT NULL,
  tradition_id uuid REFERENCES traditions(id) ON DELETE CASCADE NOT NULL,
  teaching text NOT NULL,
  source text NOT NULL,
  context text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE similarity_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE similarity_teachings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view similarity themes"
  ON similarity_themes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view similarity teachings"
  ON similarity_teachings
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_similarity_themes_slug ON similarity_themes(slug);
CREATE INDEX IF NOT EXISTS idx_similarity_teachings_theme ON similarity_teachings(theme_id);
CREATE INDEX IF NOT EXISTS idx_similarity_teachings_tradition ON similarity_teachings(tradition_id);
