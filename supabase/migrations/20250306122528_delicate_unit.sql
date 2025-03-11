/*
  # Create alerts table

  1. New Tables
    - `alerts`
      - `id` (uuid, primary key)
      - `farmer_id` (uuid, foreign key to farmers)
      - `type` (text)
      - `title` (text)
      - `message` (text)
      - `read` (boolean)
      - `icon` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `alerts` table
    - Add policies for authenticated users to:
      - Read their own alerts
      - Update their own alerts
*/

-- Create alerts table if it doesn't exist
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid REFERENCES farmers NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can read own alerts" ON alerts;
  DROP POLICY IF EXISTS "Users can update own alerts" ON alerts;
END $$;

-- Create policies
CREATE POLICY "Users can read own alerts"
  ON alerts
  FOR SELECT
  TO authenticated
  USING (farmer_id IN (SELECT id FROM farmers WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own alerts"
  ON alerts
  FOR UPDATE
  TO authenticated
  USING (farmer_id IN (SELECT id FROM farmers WHERE user_id = auth.uid()));