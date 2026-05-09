/*
  # Interactive Sacred Texts Explorer Schema

  1. New Tables
    - `sacred_texts`
      - `id` (uuid, primary key)
      - `tradition_id` (uuid, foreign key to traditions)
      - `title` (text) - Name of the text/scripture
      - `source` (text) - Book/Chapter/Verse reference
      - `text_content` (text) - The actual sacred text passage
      - `theme` (text) - Universal theme (love, compassion, unity, peace, wisdom, justice, gratitude, forgiveness)
      - `context` (text) - Historical/cultural context
      - `translation` (text) - Translation credit
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `text_comparisons`
      - `id` (uuid, primary key)
      - `theme` (text) - The universal theme these texts share
      - `title` (text) - Comparison title
      - `description` (text) - What makes these texts similar
      - `created_at` (timestamptz)

    - `comparison_texts`
      - `id` (uuid, primary key)
      - `comparison_id` (uuid, foreign key to text_comparisons)
      - `sacred_text_id` (uuid, foreign key to sacred_texts)
      - `display_order` (integer)
      - `created_at` (timestamptz)

    - `shareable_quotes`
      - `id` (uuid, primary key)
      - `sacred_text_id` (uuid, foreign key to sacred_texts)
      - `quote_text` (text) - Shortened version for sharing
      - `background_style` (text) - gradient-1, gradient-2, etc.
      - `share_count` (integer) - Track popularity
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for all sacred texts (educational content)
    - Authenticated users can track shares

  3. Indexes
    - Index on theme for fast filtering
    - Index on tradition_id for tradition-specific queries
    - Index on share_count for popular quotes
*/

-- Create sacred_texts table
CREATE TABLE IF NOT EXISTS sacred_texts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tradition_id uuid REFERENCES traditions(id) ON DELETE CASCADE,
  title text NOT NULL,
  source text NOT NULL,
  text_content text NOT NULL,
  theme text NOT NULL,
  context text DEFAULT '',
  translation text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create text_comparisons table
CREATE TABLE IF NOT EXISTS text_comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create comparison_texts junction table
CREATE TABLE IF NOT EXISTS comparison_texts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comparison_id uuid REFERENCES text_comparisons(id) ON DELETE CASCADE,
  sacred_text_id uuid REFERENCES sacred_texts(id) ON DELETE CASCADE,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create shareable_quotes table
CREATE TABLE IF NOT EXISTS shareable_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sacred_text_id uuid REFERENCES sacred_texts(id) ON DELETE CASCADE,
  quote_text text NOT NULL,
  background_style text DEFAULT 'gradient-1',
  share_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sacred_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE text_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparison_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shareable_quotes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sacred_texts (public read)
CREATE POLICY "Anyone can view sacred texts"
  ON sacred_texts FOR SELECT
  TO public
  USING (true);

-- RLS Policies for text_comparisons (public read)
CREATE POLICY "Anyone can view text comparisons"
  ON text_comparisons FOR SELECT
  TO public
  USING (true);

-- RLS Policies for comparison_texts (public read)
CREATE POLICY "Anyone can view comparison texts"
  ON comparison_texts FOR SELECT
  TO public
  USING (true);

-- RLS Policies for shareable_quotes (public read)
CREATE POLICY "Anyone can view shareable quotes"
  ON shareable_quotes FOR SELECT
  TO public
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sacred_texts_theme ON sacred_texts(theme);
CREATE INDEX IF NOT EXISTS idx_sacred_texts_tradition ON sacred_texts(tradition_id);
CREATE INDEX IF NOT EXISTS idx_shareable_quotes_share_count ON shareable_quotes(share_count DESC);
CREATE INDEX IF NOT EXISTS idx_comparison_texts_comparison ON comparison_texts(comparison_id);
CREATE INDEX IF NOT EXISTS idx_text_comparisons_theme ON text_comparisons(theme);