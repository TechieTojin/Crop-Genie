import { Audio } from 'expo-av';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

// API Key for Google Text-to-Speech API
const TTS_API_KEY = Constants.expoConfig?.extra?.GOOGLE_TTS_API_KEY || 'YOUR_GOOGLE_TTS_API_KEY';
const TTS_API_URL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${TTS_API_KEY}`;

// Available languages
export const availableLanguages = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'hi-IN', name: 'Hindi (India)' },
  { code: 'bn-IN', name: 'Bengali (India)' },
  { code: 'te-IN', name: 'Telugu (India)' },
  { code: 'ta-IN', name: 'Tamil (India)' },
  { code: 'mr-IN', name: 'Marathi (India)' },
  { code: 'gu-IN', name: 'Gujarati (India)' },
  { code: 'kn-IN', name: 'Kannada (India)' },
  { code: 'ml-IN', name: 'Malayalam (India)' },
];

// Available voices
const voices = {
  'en-US': ['en-US-Standard-B', 'en-US-Standard-C', 'en-US-Standard-D'],
  'en-GB': ['en-GB-Standard-A', 'en-GB-Standard-B', 'en-GB-Standard-C'],
  'hi-IN': ['hi-IN-Standard-A', 'hi-IN-Standard-B', 'hi-IN-Standard-C'],
  'bn-IN': ['bn-IN-Standard-A', 'bn-IN-Standard-B'],
  'te-IN': ['te-IN-Standard-A'],
  'ta-IN': ['ta-IN-Standard-A', 'ta-IN-Standard-B'],
  'mr-IN': ['mr-IN-Standard-A'],
  'gu-IN': ['gu-IN-Standard-A'],
  'kn-IN': ['kn-IN-Standard-A'],
  'ml-IN': ['ml-IN-Standard-A'],
};

// Interface for Text-to-Speech options
export interface TTSOptions {
  text: string;
  languageCode?: string;
  gender?: 'MALE' | 'FEMALE' | 'NEUTRAL';
  speakingRate?: number;
  pitch?: number;
}

// Interface for the sound object
export interface SoundObject {
  sound: Audio.Sound;
  status: any;
  uri: string;
}

// Mock audio cache for development without API
const mockAudioCache: Record<string, string> = {};

// In-memory audio cache for web platform
const webAudioCache: Record<string, string> = {};

/**
 * Converts text to speech using Google's Text-to-Speech API
 * @param options Text-to-Speech options
 * @returns Sound object that can be played
 */
export async function textToSpeech(options: TTSOptions): Promise<SoundObject> {
  try {
    const {
      text,
      languageCode = 'en-US',
      gender = 'NEUTRAL',
      speakingRate = 1.0,
      pitch = 0.0,
    } = options;

    // Create a cache key based on the options
    const cacheKey = `${text}_${languageCode}_${gender}_${speakingRate}_${pitch}`;

    // For web platform, we'll use a simplified approach without FileSystem
    if (Platform.OS === 'web') {
      // Check if we have it in our web cache
      if (webAudioCache[cacheKey]) {
        const { sound, status } = await Audio.Sound.createAsync(
          { uri: webAudioCache[cacheKey] },
          { shouldPlay: false }
        );
        return { sound, status, uri: webAudioCache[cacheKey] };
      }
      
      // If we're in development mode and don't have an API key, use mock web audio
      if (__DEV__ && TTS_API_KEY === 'YOUR_GOOGLE_TTS_API_KEY') {
        return await getMockWebAudio(cacheKey, text);
      }
      
      // Prepare the request to Google's Text-to-Speech API
      const request = {
        input: { text },
        voice: {
          languageCode,
          name: voices[languageCode as keyof typeof voices]?.[0] || voices['en-US'][0],
          ssmlGender: gender,
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate,
          pitch,
        },
      };

      // Make the API request
      const response = await fetch(TTS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }

      // Parse the response
      const data = await response.json();
      const audioContent = data.audioContent;
      
      // Create a data URI for web
      const audioUri = `data:audio/mp3;base64,${audioContent}`;
      webAudioCache[cacheKey] = audioUri;
      
      // Create a sound object from the audio content
      const { sound, status } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: false }
      );

      return { sound, status, uri: audioUri };
    }
    
    // === Native platforms (iOS, Android) implementation ===
    // Check if we have a cached audio file for these parameters
    const cacheDir = `${FileSystem.cacheDirectory}tts/`;
    const cacheFilePath = `${cacheDir}${cacheKey.replace(/[^a-z0-9]/gi, '_')}.mp3`;

    // Create cache directory if it doesn't exist
    const dirInfo = await FileSystem.getInfoAsync(cacheDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
    }

    // Check if file exists in cache
    const fileInfo = await FileSystem.getInfoAsync(cacheFilePath);
    
    // If we're in development mode and don't have an API key, use mock data
    if (__DEV__ && TTS_API_KEY === 'YOUR_GOOGLE_TTS_API_KEY') {
      return await getMockAudio(cacheKey, cacheFilePath, text);
    }

    // If file exists in cache, use it
    if (fileInfo.exists) {
      const { sound, status } = await Audio.Sound.createAsync(
        { uri: cacheFilePath },
        { shouldPlay: false }
      );
      
      return { sound, status, uri: cacheFilePath };
    }

    // Select an appropriate voice based on language and gender
    const voiceOptions = voices[languageCode as keyof typeof voices] || voices['en-US'];
    let voiceName = voiceOptions[0];
    
    // Simple logic to try to match gender with available voices
    if (gender === 'MALE' && voiceOptions.some(v => v.endsWith('B'))) {
      voiceName = voiceOptions.find(v => v.endsWith('B')) || voiceOptions[0];
    } else if (gender === 'FEMALE' && voiceOptions.some(v => v.endsWith('A'))) {
      voiceName = voiceOptions.find(v => v.endsWith('A')) || voiceOptions[0];
    }

    // Prepare the request to Google's Text-to-Speech API
    const request = {
      input: { text },
      voice: {
        languageCode,
        name: voiceName,
        ssmlGender: gender,
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate,
        pitch,
      },
    };

    // Make the API request
    const response = await fetch(TTS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.status}`);
    }

    // Parse the response
    const data = await response.json();
    const audioContent = data.audioContent;

    // Save the audio file to cache
    await FileSystem.writeAsStringAsync(cacheFilePath, audioContent, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Create a sound object from the audio file
    const { sound, status } = await Audio.Sound.createAsync(
      { uri: cacheFilePath },
      { shouldPlay: false }
    );

    return { sound, status, uri: cacheFilePath };
  } catch (error) {
    console.error('Error in text-to-speech:', error);
    throw error;
  }
}

/**
 * Gets a mock audio file for web platform
 */
async function getMockWebAudio(cacheKey: string, text: string): Promise<SoundObject> {
  try {
    // Check if we already have a mock audio for this cache key
    if (webAudioCache[cacheKey]) {
      const { sound, status } = await Audio.Sound.createAsync(
        { uri: webAudioCache[cacheKey] },
        { shouldPlay: false }
      );
      
      return { sound, status, uri: webAudioCache[cacheKey] };
    }
    
    // Use a publicly accessible sample sound for web
    const demoAudioUrl = 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3';
    webAudioCache[cacheKey] = demoAudioUrl;
    
    // Create a sound object from the sample URL
    const { sound, status } = await Audio.Sound.createAsync(
      { uri: demoAudioUrl },
      { shouldPlay: false }
    );
    
    return { sound, status, uri: demoAudioUrl };
  } catch (error) {
    console.error('Error getting mock web audio:', error);
    throw error;
  }
}

/**
 * Gets a mock audio file for development without an API key
 * @param cacheKey Cache key for the text
 * @param cacheFilePath Path to cache the audio file
 * @param text Text to convert to speech
 * @returns Mock sound object
 */
async function getMockAudio(cacheKey: string, cacheFilePath: string, text: string): Promise<SoundObject> {
  try {
    // Check if we already have a mock audio for this cache key
    if (mockAudioCache[cacheKey]) {
      const { sound, status } = await Audio.Sound.createAsync(
        { uri: mockAudioCache[cacheKey] },
        { shouldPlay: false }
      );
      
      return { sound, status, uri: mockAudioCache[cacheKey] };
    }
    
    // For development, we'll use a sample MP3 file that's bundled with the app
    // We use different built-in sounds based on text length for variety
    const moduleId = text.length % 3 === 0 
      ? require('../../assets/sounds/notification1.mp3') 
      : text.length % 3 === 1 
        ? require('../../assets/sounds/notification2.mp3')
        : require('../../assets/sounds/notification3.mp3');
    
    const { sound, status } = await Audio.Sound.createAsync(
      moduleId,
      { shouldPlay: false }
    );
    
    // Cache the mock audio
    mockAudioCache[cacheKey] = cacheFilePath;
    
    return { sound, status, uri: cacheFilePath };
  } catch (error) {
    console.error('Error getting mock audio:', error);
    throw error;
  }
}

/**
 * Speaks the given text using Text-to-Speech
 * @param options Text-to-Speech options
 * @returns Promise that resolves when speech is complete
 */
export async function speak(options: TTSOptions): Promise<void> {
  try {
    // Unload any existing audio
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      allowsRecordingIOS: false,
    });
    
    // Get the sound object
    const { sound } = await textToSpeech(options);
    
    // Play the sound
    await sound.playAsync();
    
    // Return a promise that resolves when sound finishes playing
    return new Promise((resolve) => {
      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.didJustFinish) {
          sound.unloadAsync().then(() => resolve());
        }
      });
    });
  } catch (error) {
    console.error('Error in speak function:', error);
    throw error;
  }
}

/**
 * Converts a batch of texts to speech
 * @param texts Array of text items to convert
 * @param languageCode Language code
 * @returns Array of Sound objects
 */
export async function batchTextToSpeech(
  texts: string[],
  languageCode: string = 'en-US'
): Promise<SoundObject[]> {
  try {
    // Process texts in parallel
    const promises = texts.map(text => 
      textToSpeech({
        text,
        languageCode,
      })
    );
    
    // Wait for all promises to resolve
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error in batch text-to-speech:', error);
    throw error;
  }
}

/**
 * Speaks a series of texts in sequence
 * @param texts Array of texts to speak
 * @param languageCode Language code
 * @returns Promise that resolves when all speech is complete
 */
export async function speakSequence(
  texts: string[],
  languageCode: string = 'en-US'
): Promise<void> {
  try {
    // Process each text in sequence
    for (const text of texts) {
      await speak({
        text,
        languageCode,
      });
      
      // Small pause between phrases
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  } catch (error) {
    console.error('Error in speak sequence:', error);
    throw error;
  }
} 