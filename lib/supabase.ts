import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Update Supabase configuration with direct values to ensure connection works
// Initialize the Supabase client
const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL || 
                   process.env.EXPO_PUBLIC_SUPABASE_URL ||
                   'https://qnxzrcuvtthuvlokstij.supabase.co';

const supabaseAnonKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
                       process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
                       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFueHpyY3V2dHRodXZsb2tzdGlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5NDU4MDgsImV4cCI6MjAxNTUyMTgwOH0.6rhXWDEQG_z7hrzOOCi9kGsLz0uSfMlQL8FXGNpVGvw';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or Anon Key - Authentication will fail');
}

console.log('Initializing Supabase with URL:', 
  supabaseUrl ? `${supabaseUrl.substring(0, 15)}...` : 'MISSING URL');

// Create Supabase client with proper AsyncStorage configuration for React Native
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  }
});

// Add connection check function
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    console.log('Testing Supabase connection...');
    const { error } = await supabase.from('farmer_profiles').select('count').limit(1);
    
    if (error && !error.message.includes('does not exist')) {
      console.error('Supabase connection error:', error.message);
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    return false;
  }
}

// Types for our database tables
export type Farmer = {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  farm_size: string;
  crops: string[];
  soil_type: string;
  water_source: string;
  preferred_language: string;
  created_at: string;
  updated_at: string;
};

export type CropHealthScan = {
  id: string;
  farmer_id: string;
  crop_type: string;
  image_url: string;
  status: 'healthy' | 'disease' | 'pest';
  issue: string;
  confidence: number;
  description: string;
  recommendations: string[];
  created_at: string;
};

export type Alert = {
  id: string;
  farmer_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  icon: string;
  created_at: string;
};

// Helper functions for database operations
export async function getFarmerProfile(userId: string): Promise<Farmer | null> {
  const { data, error } = await supabase
    .from('farmers')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching farmer profile:', error);
    return null;
  }
  
  return data;
}

export async function createFarmerProfile(farmerData: Partial<Farmer>): Promise<Farmer | null> {
  const { data, error } = await supabase
    .from('farmers')
    .insert([farmerData])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating farmer profile:', error);
    return null;
  }
  
  return data;
}

export async function updateFarmerProfile(farmerId: string, updates: Partial<Farmer>): Promise<Farmer | null> {
  const { data, error } = await supabase
    .from('farmers')
    .update(updates)
    .eq('id', farmerId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating farmer profile:', error);
    return null;
  }
  
  return data;
}

export async function getAlerts(farmerId: string): Promise<Alert[]> {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('farmer_id', farmerId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
  
  return data || [];
}

export async function markAlertAsRead(alertId: string): Promise<void> {
  const { error } = await supabase
    .from('alerts')
    .update({ read: true })
    .eq('id', alertId);
  
  if (error) {
    console.error('Error marking alert as read:', error);
  }
}

export async function saveCropHealthScan(scanData: Partial<CropHealthScan>): Promise<CropHealthScan | null> {
  const { data, error } = await supabase
    .from('crop_health_scans')
    .insert([scanData])
    .select()
    .single();
  
  if (error) {
    console.error('Error saving crop health scan:', error);
    return null;
  }
  
  return data;
}

export async function getCropHealthScans(farmerId: string): Promise<CropHealthScan[]> {
  const { data, error } = await supabase
    .from('crop_health_scans')
    .select('*')
    .eq('farmer_id', farmerId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching crop health scans:', error);
    return [];
  }
  
  return data || [];
}