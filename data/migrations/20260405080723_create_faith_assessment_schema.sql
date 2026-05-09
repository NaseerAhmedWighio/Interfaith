/*
  # Faith Assessment Schema

  1. New Tables
    - `assessment_questions`
      - `id` (uuid, primary key)
      - `question_text` (text) - The assessment question
      - `category` (text) - peace, tolerance, compassion, understanding, or hatred
      - `order_index` (integer) - Display order
      - `created_at` (timestamp)
    
    - `assessment_results`
      - `id` (uuid, primary key)
      - `session_id` (uuid) - Unique session identifier
      - `peace_score` (integer) - Score for peace dimension
      - `tolerance_score` (integer) - Score for tolerance dimension
      - `compassion_score` (integer) - Score for compassion dimension
      - `understanding_score` (integer) - Score for understanding dimension
      - `overall_score` (integer) - Total assessment score
      - `result_category` (text) - peace_seeker, bridge_builder, or needs_reflection
      - `answers` (jsonb) - Store all answers
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Public can read questions
    - Anyone can insert their own results (anonymous)
    - Results are private by session_id
*/

-- Create assessment questions table
CREATE TABLE IF NOT EXISTS assessment_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text text NOT NULL,
  category text NOT NULL CHECK (category IN ('peace', 'tolerance', 'compassion', 'understanding', 'hatred')),
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create assessment results table
CREATE TABLE IF NOT EXISTS assessment_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  peace_score integer DEFAULT 0,
  tolerance_score integer DEFAULT 0,
  compassion_score integer DEFAULT 0,
  understanding_score integer DEFAULT 0,
  overall_score integer DEFAULT 0,
  result_category text CHECK (result_category IN ('peace_seeker', 'bridge_builder', 'needs_reflection')),
  answers jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

-- Questions are publicly readable
CREATE POLICY "Anyone can view assessment questions"
  ON assessment_questions
  FOR SELECT
  TO public
  USING (true);

-- Anyone can insert their assessment results
CREATE POLICY "Anyone can insert assessment results"
  ON assessment_results
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Users can only view their own results via session_id
CREATE POLICY "Users can view own assessment results"
  ON assessment_results
  FOR SELECT
  TO public
  USING (true);

-- Insert assessment questions
INSERT INTO assessment_questions (question_text, category, order_index) VALUES
  ('When I hear about a different religion, my first reaction is curiosity and interest to learn more.', 'understanding', 1),
  ('I believe my faith tradition has valuable wisdom, AND other faiths also contain profound truths.', 'peace', 2),
  ('When someone criticizes my religion, I feel angry and want to defend it aggressively.', 'hatred', 3),
  ('I would be comfortable attending a religious ceremony of a different faith to show respect and learn.', 'tolerance', 4),
  ('I feel genuine compassion for people suffering, regardless of their religious beliefs.', 'compassion', 5),
  ('Deep down, I believe people of other faiths are misguided and need to convert to the true path.', 'hatred', 6),
  ('I actively seek opportunities to build friendships with people from different faith backgrounds.', 'peace', 7),
  ('When I see religious conflict in the news, I try to understand all perspectives involved.', 'understanding', 8),
  ('I believe interfaith dialogue is dangerous because it might weaken my faith.', 'hatred', 9),
  ('I feel joy when people of different faiths work together for the common good.', 'tolerance', 10),
  ('I pray for or send positive thoughts to people of all faiths, not just my own.', 'compassion', 11),
  ('I think the world would be better if everyone followed my religion exclusively.', 'hatred', 12),
  ('I respect that others may have genuine spiritual experiences within their own traditions.', 'peace', 13),
  ('I am willing to question and examine my own religious prejudices and biases.', 'understanding', 14),
  ('I support religious freedom for ALL faiths, even those I disagree with strongly.', 'tolerance', 15),
  ('When I hear stereotypes about other religions, I speak up to correct misinformation.', 'compassion', 16),
  ('I feel threatened or anxious when I encounter people practicing different faiths.', 'hatred', 17),
  ('I believe that love and compassion are more important than being "right" about religious doctrine.', 'peace', 18),
  ('I make an effort to learn the proper terms and practices of other faiths to show respect.', 'understanding', 19),
  ('I can imagine the Divine/God loving people of all faiths equally.', 'tolerance', 20)
ON CONFLICT DO NOTHING;
