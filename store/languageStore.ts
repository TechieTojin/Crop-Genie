import { create } from 'zustand';
import { translations } from '../constants/translations';
import { NativeModules, Platform } from 'react-native';
import { createContext, useContext } from 'react';
import SafeStorage from '../lib/storage';

// Define the available languages that we know exist in the translations
export type AvailableLanguage = 'English' | 'Hindi' | 'Kannada' | 'Malayalam';

// Cast translations to ensure TypeScript knows this is valid
const typedTranslations = translations as Record<AvailableLanguage, Record<string, string>>;

// A separate function to determine if a language is RTL
const isLanguageRTL = (language: string): boolean => {
  // We don't have RTL languages now, but we're ready for future
  return false; // Currently no RTL languages in our app
};

// Safe way to get device language that works on all platforms
const getDeviceLanguage = () => {
  try {
    let deviceLanguage = 'en'; // Default to English
    
    // Skip NativeModules access in SSR environment
    if (typeof window === 'undefined') {
      return deviceLanguage;
    }
    
    if (Platform.OS === 'ios') {
      // iOS language detection
      const iosLocale = NativeModules.SettingsManager?.settings?.AppleLocale || 
        NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] || 'en';
      deviceLanguage = iosLocale.substring(0, 2);
    } else if (Platform.OS === 'android') {
      // Android language detection with fallback
      if (NativeModules.I18nManager) {
        deviceLanguage = NativeModules.I18nManager.localeIdentifier?.split('_')[0] || 'en';
      }
    }
    
    return deviceLanguage;
  } catch (error) {
    console.warn('Error detecting device language:', error);
    return 'en'; // Default to English on error
  }
};

type LanguageState = {
  language: AvailableLanguage;
  translations: Record<string, string>;
  setLanguage: (language: AvailableLanguage) => Promise<void>;
  initializeLanguage: () => Promise<void>;
  isRTL: boolean; // Add RTL support for languages that need it
};

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: 'English',
  translations: typedTranslations.English,
  isRTL: false,
  
  // Enhanced setLanguage function that also saves the language preference
  setLanguage: async (language: AvailableLanguage) => {
    try {
      // Save language preference to SafeStorage
      await SafeStorage.setItem('userLanguage', language);
      
      // Update the store with properly typed translations
      set({ 
        language, 
        translations: typedTranslations[language] || typedTranslations.English,
        isRTL: isLanguageRTL(language)
      });
      
      console.log(`Language switched to: ${language}`);
    } catch (error) {
      console.error('Error setting language:', error);
    }
  },
  
  // Function to initialize language based on saved preferences or device locale
  initializeLanguage: async () => {
    try {
      // Try to get the saved language preference
      const savedLanguage = await SafeStorage.getItem('userLanguage');
      
      if (savedLanguage && Object.keys(typedTranslations).includes(savedLanguage)) {
        // Use saved language if available (cast to ensure it's a valid language)
        const language = savedLanguage as AvailableLanguage;
        
        set({
          language,
          translations: typedTranslations[language],
          isRTL: isLanguageRTL(language)
        });
        console.log(`Language initialized from preferences: ${language}`);
      } else {
        // If no saved preference, use device locale with our safe function
        const deviceLocale = getDeviceLanguage();
        
        // Map device locale to available languages
        let detectedLanguage: AvailableLanguage = 'English'; // Default
        
        if (deviceLocale === 'hi') detectedLanguage = 'Hindi';
        else if (deviceLocale === 'kn') detectedLanguage = 'Kannada';
        else if (deviceLocale === 'ml') detectedLanguage = 'Malayalam';
        
        // Update store with detected language
        set({
          language: detectedLanguage,
          translations: typedTranslations[detectedLanguage],
          isRTL: isLanguageRTL(detectedLanguage)
        });
        console.log(`Language initialized from device: ${detectedLanguage}`);
        
        // Save this detected language as user preference
        await SafeStorage.setItem('userLanguage', detectedLanguage);
      }
    } catch (error) {
      console.error('Error initializing language:', error);
      // Fallback to English in case of error
      set({
        language: 'English',
        translations: typedTranslations.English,
        isRTL: false
      });
    }
  }
}));

// Create a context provider to wrap the app with language support
export const LanguageContext = createContext<LanguageState | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};