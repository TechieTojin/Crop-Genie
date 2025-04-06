import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Create a custom storage adapter that handles SSR/Node environments
class CustomStorageAdapter {
  constructor() {
    this.inMemoryStorage = new Map();
  }

  async getItem(key) {
    // Check if running in Node.js environment (SSR or tests)
    if (typeof window === 'undefined' || !AsyncStorage) {
      return this.inMemoryStorage.get(key) || null;
    }
    
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from AsyncStorage:', error);
      return null;
    }
  }

  async setItem(key, value) {
    // Check if running in Node.js environment (SSR or tests)
    if (typeof window === 'undefined' || !AsyncStorage) {
      this.inMemoryStorage.set(key, value);
      return;
    }
    
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error writing to AsyncStorage:', error);
    }
  }

  async removeItem(key) {
    // Check if running in Node.js environment (SSR or tests)
    if (typeof window === 'undefined' || !AsyncStorage) {
      this.inMemoryStorage.delete(key);
      return;
    }
    
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from AsyncStorage:', error);
    }
  }
}

// Get Supabase URL and key from Constants or environment variables
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

// Log initialization with partial URL for debugging (security)
if (supabaseUrl) {
  const visiblePart = supabaseUrl.substring(0, 10) + '...';
  console.log(`Initializing Supabase with URL: ${visiblePart}`);
}

// Create Supabase client with SSR-safe storage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: new CustomStorageAdapter(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});

export default supabase; 