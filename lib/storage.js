import AsyncStorage from '@react-native-async-storage/async-storage';

// In-memory storage as fallback for SSR or when AsyncStorage is not available
const memoryStorage = new Map();

/**
 * Safe AsyncStorage wrapper that works in all environments including SSR
 */
export const SafeStorage = {
  /**
   * Get an item from storage
   * @param {string} key - The key to retrieve
   * @returns {Promise<string|null>} - The stored value or null
   */
  getItem: async (key) => {
    try {
      if (typeof window === 'undefined') {
        return memoryStorage.get(key) || null;
      }
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.warn(`Failed to get item [${key}]:`, error);
      return null;
    }
  },

  /**
   * Store an item in storage
   * @param {string} key - The key to store under
   * @param {string} value - The value to store
   * @returns {Promise<void>}
   */
  setItem: async (key, value) => {
    try {
      if (typeof window === 'undefined') {
        memoryStorage.set(key, value);
        return;
      }
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.warn(`Failed to set item [${key}]:`, error);
    }
  },

  /**
   * Remove an item from storage
   * @param {string} key - The key to remove
   * @returns {Promise<void>}
   */
  removeItem: async (key) => {
    try {
      if (typeof window === 'undefined') {
        memoryStorage.delete(key);
        return;
      }
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove item [${key}]:`, error);
    }
  },

  /**
   * Clear all storage
   * @returns {Promise<void>}
   */
  clear: async () => {
    try {
      if (typeof window === 'undefined') {
        memoryStorage.clear();
        return;
      }
      await AsyncStorage.clear();
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }
  },

  /**
   * Get all keys in storage
   * @returns {Promise<string[]>} - Array of keys
   */
  getAllKeys: async () => {
    try {
      if (typeof window === 'undefined') {
        return Array.from(memoryStorage.keys());
      }
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.warn('Failed to get all keys:', error);
      return [];
    }
  }
};

export default SafeStorage; 