// Convert text to speech using Google TTS API
const speakText = async (text: string, selectedLanguage: string) => {
  if (!text) {
    setError('No text provided for speech conversion');
    return;
  }

  try {
    setLoading(true);
    setError(null);
    setPausePlayback(false);
    
    // In development mode without API key, use mock data
    if (__DEV__ && GOOGLE_TTS_API_KEY === 'YOUR_GOOGLE_TTS_API_KEY') {
      console.log('Using mock TTS in development mode');
      await mockTextToSpeech(text, selectedLanguage);
      return;
    }

    console.log(`Sending request to Google TTS API for language: ${selectedLanguage}`);
    const requestBody = {
      input: { text },
      voice: {
        languageCode: getLanguageCode(selectedLanguage),
        name: getVoiceName(selectedLanguage),
        ssmlGender: 'NEUTRAL'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        pitch: 0,
        speakingRate: 1.0
      }
    };

    const response = await fetch(TTS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GOOGLE_TTS_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('TTS API error response:', errorData);
      throw new Error(`Text-to-Speech API error: ${response.status}. ${errorData}`);
    }

    const data = await response.json();
    
    if (!data || !data.audioContent) {
      throw new Error('No audio content returned from TTS API');
    }
    
    console.log('Successfully received TTS API response');
    const audioBase64 = data.audioContent;
    
    // Play the audio
    await playAudio(audioBase64);
    
  } catch (err: any) {
    console.error('Error converting text to speech:', err);
    setError(err.message || 'Failed to convert text to speech. Please try again.');
    setAudioUrl(null);
  } finally {
    setLoading(false);
  }
};

// Mock text-to-speech for development without API key
const mockTextToSpeech = async (text: string, language: string) => {
  try {
    // Simulate API delay
    const delayTime = 800 + Math.random() * 1500;
    console.log(`Simulating TTS API delay (${delayTime.toFixed(0)}ms)...`);
    await new Promise(resolve => setTimeout(resolve, delayTime));
    
    console.log(`Mock TTS processing complete for text in ${language}`);
    
    // In a real implementation, we would play the returned audio
    // For the mock, we'll simulate success but won't actually play audio
    setMockMessage(`[MOCK] Successfully converted: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}" to speech in ${language}`);
    
    // Use a local demo audio file based on the selected language
    // This is just for demonstration purposes
    let demoAudioUrl;
    if (language.includes('Hindi')) {
      demoAudioUrl = 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3';
    } else if (language.includes('Spanish')) {
      demoAudioUrl = 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3';
    } else {
      demoAudioUrl = 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3';
    }
    
    setAudioUrl(demoAudioUrl);
    
    // Load and play the audio
    const { sound } = await Audio.Sound.createAsync(
      { uri: demoAudioUrl },
      { shouldPlay: true }
    );
    
    setSound(sound);
    
    // Unload the sound when playback finishes
    sound.setOnPlaybackStatusUpdate(status => {
      if (status.didJustFinish) {
        sound.unloadAsync();
      }
    });
    
  } catch (error) {
    console.error('Error in mock TTS:', error);
    setError('Failed to play demo audio');
  }
};

// Helper function to play audio from base64 string
const playAudio = async (audioBase64: string) => {
  try {
    // Convert base64 to URI 
    const uri = `data:audio/mp3;base64,${audioBase64}`;
    setAudioUrl(uri);
    
    // Load the audio
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );
    
    setSound(sound);
    
    // Unload the sound when playback finishes
    sound.setOnPlaybackStatusUpdate(status => {
      if (status.didJustFinish) {
        sound.unloadAsync();
      }
    });
    
  } catch (error) {
    console.error('Error playing audio:', error);
    setError('Failed to play audio');
  }
};

// Helper function to get the appropriate language code
const getLanguageCode = (language: string): string => {
  switch (language) {
    case 'English':
      return 'en-US';
    case 'Hindi':
      return 'hi-IN';
    case 'Spanish':
      return 'es-ES';
    case 'French':
      return 'fr-FR';
    case 'German':
      return 'de-DE';
    case 'Japanese':
      return 'ja-JP';
    case 'Swahili':
      return 'sw-KE';
    default:
      return 'en-US';
  }
};

// Helper function to get appropriate voice name
const getVoiceName = (language: string): string => {
  switch (language) {
    case 'English':
      return 'en-US-Wavenet-F';
    case 'Hindi':
      return 'hi-IN-Wavenet-B';
    case 'Spanish':
      return 'es-ES-Wavenet-B';
    case 'French':
      return 'fr-FR-Wavenet-C';
    case 'German':
      return 'de-DE-Wavenet-B';
    case 'Japanese':
      return 'ja-JP-Wavenet-A';
    case 'Swahili':
      return 'sw-KE-Standard-A';
    default:
      return 'en-US-Wavenet-F';
  }
}; 