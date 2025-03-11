/*
  # Create recommendations table

  1. New Tables
    - `recommendations`
      - `id` (uuid, primary key)
      - `farmer_id` (uuid, references farmers)
      - `type` (text)
      - `crop_type` (text)
      - `field_size` (text)
      - `current_status` (text)
      - `recommendation` (text)
      - `schedule` (jsonb)
      - `tips` (text array)
      - `applied` (boolean)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `recommendations` table
    - Add policies for authenticated users to read, insert, and update their own data
*/

CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid REFERENCES farmers NOT NULL,
  type text NOT NULL,
  crop_type text NOT NULL,
  field_size text,
  current_status text,
  recommendation text,
  schedule jsonb DEFAULT '{}'::jsonb,
  tips text[] DEFAULT '{}',
  applied boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own recommendations
CREATE POLICY "Users can read own recommendations"
  ON recommendations
  FOR SELECT
  TO authenticated
  USING (farmer_id IN (SELECT id FROM farmers WHERE user_id = auth.uid()));

-- Policy for users to insert their own recommendations
CREATE POLICY "Users can insert own recommendations"
  ON recommendations
  FOR INSERT
  TO authenticated
  WITH CHECK (farmer_id IN (SELECT id FROM farmers WHERE user_id = auth.uid()));

-- Policy for users to update their own recommendations
CREATE POLICY "Users can update own recommendations"
  ON recommendations
  FOR UPDATE
  TO authenticated
  USING (farmer_id IN (SELECT id FROM farmers WHERE user_id = auth.uid()));