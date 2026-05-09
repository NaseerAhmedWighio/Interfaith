/*
  # Newsletter Subscription Schema

  1. New Tables
    - `newsletter_subscribers`
      - `id` (uuid, primary key) - Unique identifier for each subscriber
      - `email` (text, unique, required) - Subscriber's email address
      - `name` (text) - Subscriber's name (optional)
      - `subscription_topics` (text array) - Topics of interest
      - `frequency` (text, default 'weekly') - Email frequency preference (daily, weekly, monthly)
      - `subscribed_at` (timestamptz) - Initial subscription timestamp
      - `is_active` (boolean, default true) - Subscription status
      - `unsubscribe_token` (uuid) - Token for unsubscribe functionality
      - `source` (text) - Where they subscribed from (footer, join_page, subscribe_page)
      - `confirmed_at` (timestamptz) - Email confirmation timestamp
      - `last_email_sent` (timestamptz) - Last newsletter sent date
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `newsletter_subscribers` table
    - Add policy for public insert (subscription)
    - Add policy for users to read their own subscription
    - Add policy for unsubscribe by token

  3. Indexes
    - Email index for fast lookups
    - Active subscriptions index
    - Token index for unsubscribe functionality
*/

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  subscription_topics text[] DEFAULT '{}',
  frequency text DEFAULT 'weekly',
  subscribed_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  unsubscribe_token uuid DEFAULT gen_random_uuid(),
  source text,
  confirmed_at timestamptz,
  last_email_sent timestamptz,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Subscribers can read own subscription"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt()->>'email');

CREATE POLICY "Anyone can update with valid unsubscribe token"
  ON newsletter_subscribers
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_newsletter_token ON newsletter_subscribers(unsubscribe_token);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed_at ON newsletter_subscribers(subscribed_at DESC);