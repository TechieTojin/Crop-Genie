/*
  # Create farmers table

  1. New Tables
    - `farmers`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `phone` (text)
      - `email` (text)
      - `location` (text)
      - `farm_size` (text)
      - `crops` (text[])
      - `soil_type` (text)
      - `water_source` (text)
      - `preferred_language` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `farmers` table
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS farmers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  phone text,
  email text,
  location text,
  farm_size text,
  crops text[] DEFAULT '{}',
  soil_type text,
  water_source text,
  preferred_language text DEFAULT 'English',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own profile
CREATE POLICY "Users can read own profile"
  ON farmers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy for users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON farmers
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy for users to update their own profile
CREATE POLICY "Users can update own profile"
  ON farmers
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());