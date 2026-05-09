/*
  # Interfaith Peace Platform Schema

  1. New Tables
    - `traditions`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the faith tradition
      - `description` (text) - Brief description
      - `core_values` (text[]) - Array of core values
      - `created_at` (timestamptz)
    
    - `teachings`
      - `id` (uuid, primary key)
      - `title` (text) - Teaching title
      - `content` (text) - Full teaching content
      - `source` (text) - Source/attribution
      - `tradition_id` (uuid, nullable) - Optional link to tradition
      - `category` (text) - peace, love, unity, compassion, etc.
      - `created_at` (timestamptz)
    
    - `misconceptions`
      - `id` (uuid, primary key)
      - `tradition_id` (uuid) - Related faith tradition
      - `misconception` (text) - Common misconception
      - `truth` (text) - Accurate explanation
      - `created_at` (timestamptz)
    
    - `peace_initiatives`
      - `id` (uuid, primary key)
      - `title` (text) - Initiative title
      - `description` (text) - Detailed description
      - `impact` (text) - Expected/achieved impact
      - `status` (text) - active, completed, planned
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (educational content)
*/

-- Traditions table
CREATE TABLE IF NOT EXISTS traditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  core_values text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE traditions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view traditions"
  ON traditions FOR SELECT
  TO public
  USING (true);

-- Teachings table
CREATE TABLE IF NOT EXISTS teachings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  source text NOT NULL,
  tradition_id uuid REFERENCES traditions(id),
  category text NOT NULL DEFAULT 'peace',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE teachings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view teachings"
  ON teachings FOR SELECT
  TO public
  USING (true);

-- Misconceptions table
CREATE TABLE IF NOT EXISTS misconceptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tradition_id uuid REFERENCES traditions(id) NOT NULL,
  misconception text NOT NULL,
  truth text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE misconceptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view misconceptions"
  ON misconceptions FOR SELECT
  TO public
  USING (true);

-- Peace initiatives table
CREATE TABLE IF NOT EXISTS peace_initiatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  impact text NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE peace_initiatives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view peace initiatives"
  ON peace_initiatives FOR SELECT
  TO public
  USING (true);

-- Insert initial traditions
INSERT INTO traditions (name, description, core_values) VALUES
  ('Sufism', 'The mystical dimension of Islam emphasizing divine love, inner purification, and unity with the Divine', ARRAY['Love', 'Unity', 'Compassion', 'Inner Peace', 'Divine Connection']),
  ('Islam', 'Abrahamic monotheistic religion emphasizing submission to God, peace, and righteous living', ARRAY['Peace', 'Justice', 'Charity', 'Mercy', 'Brotherhood']),
  ('Christianity', 'Followers of Jesus Christ emphasizing love, forgiveness, and salvation', ARRAY['Love', 'Forgiveness', 'Charity', 'Faith', 'Hope']),
  ('Judaism', 'Ancient monotheistic tradition emphasizing justice, learning, and ethical living', ARRAY['Justice', 'Study', 'Community', 'Righteousness', 'Covenant']),
  ('Buddhism', 'Path to enlightenment through compassion, mindfulness, and ethical living', ARRAY['Compassion', 'Mindfulness', 'Non-violence', 'Wisdom', 'Peace']),
  ('Hinduism', 'Ancient tradition emphasizing dharma, karma, and spiritual liberation', ARRAY['Dharma', 'Ahimsa', 'Truth', 'Unity in Diversity', 'Spiritual Growth']);

-- Insert Sufi and interfaith teachings
INSERT INTO teachings (title, content, source, tradition_id, category) VALUES
  (
    'The Unity of Hearts',
    'The heart is a sanctuary. When it is purified, it becomes a mirror reflecting the Divine Light. In this state, one sees the same light in all beings, transcending divisions of faith, race, or creed.',
    'Sufi Master Rumi',
    (SELECT id FROM traditions WHERE name = 'Sufism'),
    'unity'
  ),
  (
    'Love Conquers All',
    'Love is the bridge between you and everything. Let love be your guide, for in its embrace, all barriers dissolve and humanity becomes one family.',
    'Hazrat Inayat Khan',
    (SELECT id FROM traditions WHERE name = 'Sufism'),
    'love'
  ),
  (
    'The Ocean of Compassion',
    'Just as rivers of different names and forms all merge into the same ocean, so too do the prayers of all faiths merge into the infinite ocean of Divine Compassion.',
    'Sufi Wisdom',
    (SELECT id FROM traditions WHERE name = 'Sufism'),
    'compassion'
  ),
  (
    'The Inner Journey',
    'Know that the outward form is but a shell. The true essence of faith lies in the journey inward, where the seeker discovers that all paths lead to the same Divine Source.',
    'Ibn Arabi',
    (SELECT id FROM traditions WHERE name = 'Sufism'),
    'peace'
  ),
  (
    'Love Your Neighbor',
    'Love your neighbor as yourself. There is no commandment greater than these.',
    'Gospel of Mark 12:31',
    (SELECT id FROM traditions WHERE name = 'Christianity'),
    'love'
  ),
  (
    'Universal Compassion',
    'Develop a heart that embraces all beings with compassion, with a boundless heart towards all, with no obstruction, no enmity, no rivalry.',
    'The Buddha',
    (SELECT id FROM traditions WHERE name = 'Buddhism'),
    'compassion'
  ),
  (
    'Peace and Mercy',
    'God does not look at your forms and possessions but He looks at your hearts and your deeds. Show mercy to those on earth, and the One in heaven will show mercy to you.',
    'Prophet Muhammad (PBUH)',
    (SELECT id FROM traditions WHERE name = 'Islam'),
    'compassion'
  );

-- Insert misconceptions and truths
INSERT INTO misconceptions (tradition_id, misconception, truth) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Sufism'),
    'Sufism is a separate religion from Islam',
    'Sufism is the mystical and spiritual dimension of Islam, not a separate faith. It represents the inner, esoteric aspect of Islamic practice focused on divine love and spiritual purification.'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Islam'),
    'Islam promotes violence and intolerance',
    'Islam literally means "peace" and "submission to God." The Quran teaches respect for all people, especially People of the Book (Christians and Jews), and emphasizes that there is no compulsion in religion (Quran 2:256). Violence by any group contradicts core Islamic teachings.'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Christianity'),
    'All Christians think and believe exactly the same',
    'Christianity encompasses diverse traditions, interpretations, and practices across many denominations. Christians share core beliefs but express faith in wonderfully varied ways across cultures and communities.'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Judaism'),
    'Judaism is only about strict rules and rituals',
    'While Jewish practice includes meaningful traditions, Judaism emphasizes ethical living, justice, learning, questioning, and repairing the world (tikkun olam). It values debate, growth, and compassionate action.'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Buddhism'),
    'Buddhism is pessimistic and focused on suffering',
    'Buddhism acknowledges suffering as part of existence but focuses on the path to liberation, peace, and enlightenment. It teaches practical methods for cultivating joy, compassion, and inner freedom.'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Hinduism'),
    'Hinduism has millions of gods and is polytheistic',
    'Hinduism recognizes one ultimate reality (Brahman) that manifests in many forms. The diverse deities represent different aspects of the Divine, allowing practitioners to connect with the infinite in personally meaningful ways.'
  );

-- Insert peace initiatives
INSERT INTO peace_initiatives (title, description, impact, status) VALUES
  (
    'Hearts United: Interfaith Dialogue Circles',
    'Monthly gatherings bringing together people of all faiths to share stories, wisdom, and build genuine friendships across religious boundaries.',
    'Over 500 participants have formed lasting friendships, breaking down prejudices and building bridges of understanding in local communities.',
    'active'
  ),
  (
    'Wisdom Without Walls',
    'Educational program teaching the beautiful commonalities shared across all faiths - compassion, justice, love, and service to humanity.',
    'Reached 10,000+ students, helping young people appreciate diversity while recognizing our shared human values.',
    'active'
  ),
  (
    'Sufi Peace Garden Project',
    'Creating sacred spaces for contemplation and interfaith meditation, inspired by Sufi principles of universal love and unity.',
    'Five peace gardens established, serving as neutral ground where people of all backgrounds can find tranquility and connection.',
    'active'
  ),
  (
    'Sacred Stories Exchange',
    'Digital platform and live events where people share personal faith journeys, highlighting transformation, healing, and the common thread of seeking meaning.',
    'Breaking stereotypes through authentic storytelling, with participants reporting 85% reduction in religious prejudice after engagement.',
    'active'
  );
