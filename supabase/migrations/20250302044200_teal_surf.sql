/*
  # Create crop health scans table

  1. New Tables
    - `crop_health_scans`
      - `id` (uuid, primary key)
      - `farmer_id` (uuid, references farmers)
      - `crop_type` (text)
      - `image_url` (text)
      - `status` (text)
      - `issue` (text)
      - `confidence` (numeric)
      - `description` (text)
      - `recommendations` (text[])
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `crop_health_scans` table
    - Add policies for authenticated users to read and insert their own data
*/

CREATE TABLE IF NOT EXISTS crop_health_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid REFERENCES farmers NOT NULL,
  crop_type text NOT NULL,
  image_url text,
  status text NOT NULL,
  issue text,
  confidence numeric,
  description text,
  recommendations text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE crop_health_scans ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own scans
CREATE POLICY "Users can read own crop health scans"
  ON crop_health_scans
  FOR SELECT
  TO authenticated
  USING (farmer_id IN (SELECT id FROM farmers WHERE user_id = auth.uid()));

-- Policy for users to insert their own scans
CREATE POLICY "Users can insert own crop health scans"
  ON crop_health_scans
  FOR INSERT
  TO authenticated
  WITH CHECK (farmer_id IN (SELECT id FROM farmers WHERE user_id = auth.uid()));