import Constants from 'expo-constants';

const GOOGLE_TRANSLATE_API_KEY = Constants.expoConfig?.extra?.GOOGLE_TRANSLATE_API_KEY || 'YOUR_GOOGLE_TRANSLATE_API_KEY';
const TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

interface TranslateParams {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

interface TranslationResponse {
  data: {
    translations: {
      translatedText: string;
      detectedSourceLanguage?: string;
    }[];
  };
}

/**
 * Translates text using Google Cloud Translation API
 * @param text The text to translate
 * @param targetLanguage Target language code (e.g., 'en', 'hi', 'kn', 'ml')
 * @param sourceLanguage Optional source language code (if not provided, auto-detection is used)
 * @returns Translated text
 */
export async function translateText({ 
  text, 
  targetLanguage, 
  sourceLanguage 
}: TranslateParams): Promise<string> {
  try {
    // If app is in development mode and no API key, return mock translation
    if (__DEV__ && GOOGLE_TRANSLATE_API_KEY === 'YOUR_GOOGLE_TRANSLATE_API_KEY') {
      console.warn('Using mock translation because no API key is provided');
      return mockTranslate(text, targetLanguage);
    }

    const params = new URLSearchParams({
      key: GOOGLE_TRANSLATE_API_KEY,
      q: text,
      target: targetLanguage,
      format: 'text',
    });

    if (sourceLanguage) {
      params.append('source', sourceLanguage);
    }

    const response = await fetch(`${TRANSLATE_API_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json() as TranslationResponse;
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on error
  }
}

/**
 * Batch translates an array of texts
 * @param texts Array of texts to translate
 * @param targetLanguage Target language code
 * @param sourceLanguage Optional source language code
 * @returns Array of translated texts
 */
export async function batchTranslate(
  texts: string[],
  targetLanguage: string,
  sourceLanguage?: string
): Promise<string[]> {
  try {
    // For development without API key
    if (__DEV__ && GOOGLE_TRANSLATE_API_KEY === 'YOUR_GOOGLE_TRANSLATE_API_KEY') {
      return texts.map(text => mockTranslate(text, targetLanguage));
    }
    
    // In a real app, this would use the batch translation endpoint
    // For simplicity, we'll process serially here
    const translatedTexts = await Promise.all(
      texts.map(text => 
        translateText({ text, targetLanguage, sourceLanguage })
      )
    );
    
    return translatedTexts;
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts; // Return original texts on error
  }
}

/**
 * Mock translation function for development without API key
 */
function mockTranslate(text: string, targetLanguage: string): string {
  // Simple mock translation for development
  const mockTranslations: Record<string, Record<string, string>> = {
    'Hello': {
      'hi': 'नमस्ते',
      'kn': 'ಹಲೋ',
      'ml': 'ഹലോ',
    },
    'Welcome': {
      'hi': 'स्वागत है',
      'kn': 'ಸ್ವಾಗತ',
      'ml': 'സ്വാഗതം',
    },
    'Farm': {
      'hi': 'खेत',
      'kn': 'ಕೃಷಿ',
      'ml': 'കൃഷി',
    }
  };

  // Return the mock translation if available, otherwise return original with prefix
  if (Object.keys(mockTranslations).some(key => text.includes(key))) {
    for (const [key, translations] of Object.entries(mockTranslations)) {
      if (text.includes(key)) {
        const translatedPart = translations[targetLanguage] || key;
        return text.replace(key, translatedPart);
      }
    }
  }
  
  // If no specific translation, add a mock prefix
  return `[${targetLanguage}] ${text}`;
} 