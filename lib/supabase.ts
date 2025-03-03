import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Initialize the Supabase client
const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL || 
                   process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
                       process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or Anon Key');
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

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