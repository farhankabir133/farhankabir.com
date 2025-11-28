/*
  # Newsletter Subscribers Table

  1. New Table
    - `newsletter_subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `status` (text, default 'active')
      - `source` (text, default 'website')
      - `subscribed_at` (timestamp)
      - `unsubscribed_at` (timestamp, optional)

  2. Security
    - Enable RLS
    - Allow public insert (for new subscriptions)
    - Allow public read on active subscribers count
*/

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  source text NOT NULL DEFAULT 'website',
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert new subscribers
CREATE POLICY "Allow public insert on newsletter_subscribers"
  ON newsletter_subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public read access (can be restricted later if needed)
CREATE POLICY "Allow public read on newsletter_subscribers"
  ON newsletter_subscribers
  FOR SELECT
  TO public
  USING (true);
