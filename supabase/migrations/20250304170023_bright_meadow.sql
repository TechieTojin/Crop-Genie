/*
  # Create weather data table

  1. New Tables
    - `weather_data`
      - `id` (uuid, primary key)
      - `farmer_id` (uuid, references farmers)
      - `location` (text)
      - `temperature` (numeric)
      - `condition` (text)
      - `humidity` (numeric)
      - `wind_speed` (numeric)
      - `rainfall` (numeric)
      - `forecast` (jsonb)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `weather_data` table
    - Add policies for authenticated users to read and insert their own data
*/

CREATE TABLE IF NOT EXISTS weather_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid REFERENCES farmers NOT NULL,
  location text NOT NULL,
  temperature numeric,
  condition text,
  humidity numeric,
  wind_speed numeric,
  rainfall numeric,
  forecast jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own weather data
CREATE POLICY "Users can read own weather data"
  ON weather_data
  FOR SELECT
  TO authenticated
  USING (farmer_id IN (SELECT id FROM farmers WHERE user_id = auth.uid()));

-- Policy for users to insert their own weather data
CREATE POLICY "Users can insert own weather data"
  ON weather_data
  FOR INSERT
  TO authenticated
  WITH CHECK (farmer_id IN (SELECT id FROM farmers WHERE user_id = auth.uid()));