/*
  # Chatbot Database Schema

  1. New Tables
    - `chat_sessions`
      - `id` (uuid, primary key)
      - `user_id` (text, optional)
      - `wallet_address` (text, optional)
      - `context` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `chat_messages`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key)
      - `content` (text)
      - `role` (text, 'user' or 'assistant')
      - `timestamp` (timestamp)
    
    - `leads`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `wallet_address` (text, optional)
      - `source` (text)
      - `interests` (text array)
      - `messages` (text array)
      - `created_at` (timestamp)
    
    - `analytics_events`
      - `id` (uuid, primary key)
      - `event` (text)
      - `properties` (jsonb)
      - `session_id` (text, optional)
      - `timestamp` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (since this is a portfolio chatbot)
*/

-- Chat Sessions Table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text,
  wallet_address text,
  context jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to chat sessions"
  ON chat_sessions
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  content text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to chat messages"
  ON chat_messages
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Leads Table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  wallet_address text,
  source text NOT NULL DEFAULT 'chatbot',
  interests text[] DEFAULT '{}',
  messages text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on leads"
  ON leads
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read on leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event text NOT NULL,
  properties jsonb DEFAULT '{}',
  session_id text,
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to analytics events"
  ON analytics_events
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event ON analytics_events(event);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for chat_sessions
CREATE TRIGGER update_chat_sessions_updated_at
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();