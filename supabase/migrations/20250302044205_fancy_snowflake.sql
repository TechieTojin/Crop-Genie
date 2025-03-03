/*
  # Create alerts table

  1. New Tables
    - `alerts`
      - `id` (uuid, primary key)
      - `farmer_id` (uuid, references farmers)
      - `type` (text)
      - `title` (text)
      - `message` (text)
      - `read` (boolean)
      - `icon` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `alerts` table
    - Add policies for authenticated users to read and update their own alerts
*/

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

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own alerts
CREATE POLICY "Users can read own alerts"
  ON alerts
  FOR SELECT
  TO authenticated
  USING (farmer_id IN (SELECT id FROM farmers WHERE user_id = auth.uid()));

-- Policy for users to update their own alerts
CREATE POLICY "Users can update own alerts"
  ON alerts
  FOR UPDATE
  TO authenticated
  USING (farmer_id IN (SELECT id FROM farmers WHERE user_id = auth.uid()));