/*
  # Join the Movement - Member Registration Schema

  1. New Tables
    - `movement_members`
      - `id` (uuid, primary key) - Unique identifier for each member
      - `email` (text, unique, required) - Member's email address
      - `full_name` (text, required) - Member's full name
      - `country` (text) - Member's country
      - `interests` (text array) - Areas of interest (e.g., 'Education', 'Youth', 'Dialogue')
      - `tradition_affiliation` (text) - Member's faith tradition or spiritual background
      - `how_heard` (text) - How they heard about the movement
      - `message` (text) - Optional personal message
      - `wants_newsletter` (boolean, default true) - Newsletter subscription preference
      - `wants_volunteer` (boolean, default false) - Volunteer interest
      - `status` (text, default 'active') - Member status (active, inactive)
      - `created_at` (timestamptz) - Registration timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `movement_members` table
    - Add policy for public insert (registration)
    - Add policy for authenticated users to read their own data
    - Admin-only access for all member data
*/

CREATE TABLE IF NOT EXISTS movement_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  country text,
  interests text[] DEFAULT '{}',
  tradition_affiliation text,
  how_heard text,
  message text,
  wants_newsletter boolean DEFAULT true,
  wants_volunteer boolean DEFAULT false,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE movement_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register as a member"
  ON movement_members
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Members can read own data"
  ON movement_members
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE INDEX IF NOT EXISTS idx_movement_members_email ON movement_members(email);
CREATE INDEX IF NOT EXISTS idx_movement_members_created_at ON movement_members(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_movement_members_status ON movement_members(status);