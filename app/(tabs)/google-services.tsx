import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { LinearGradient } from 'expo-linear-gradient';
import GoogleVisionAnalysis from '../../components/GoogleVisionAnalysis';
import GoogleSoilAnalysis from '../../components/GoogleSoilAnalysis';
import { speak, availableLanguages } from '../../lib/api/textToSpeechApi';
import { translateText } from '../../lib/api/translateApi';
import { ChevronDown, Volume2, Languages, Cpu, BarChart2 } from 'lucide-react-native';

export default function GoogleServicesScreen() {
  const { isDark } = useThemeStore();
  const [selectedTab, setSelectedTab] = useState<'vision' | 'soil' | 'tts' | 'translate'>('vision');
  const [textToSpeak, setTextToSpeak] = useState('Welcome to CropGenies. How can I help you with your farm today?');
  const [selectedLanguage, setSelectedLanguage] = useState(availableLanguages[0]);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [textToTranslate, setTextToTranslate] = useState('The best time to plant rice is during the rainy season.');
  const [translatedText, setTranslatedText] = useState('');
  const [translating, setTranslating] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Handle text to speech
  const handleSpeak = async () => {
    if (!textToSpeak) return;
    
    try {
      setLoading(true);
      console.log(`Attempting to speak text in ${selectedLanguage.name}`);
      
      await speak({
        text: textToSpeak,
        languageCode: selectedLanguage.code,
      });
      
      console.log('Text-to-speech conversion complete');
    } catch (error) {
      console.error('Error speaking text:', error);
      alert(`Failed to convert text to speech: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle text translation
  const handleTranslate = async () => {
    if (!textToTranslate) return;
    
    try {
      setTranslating(true);
      console.log(`Translating text to ${selectedLanguage.name}`);
      
      const result = await translateText({
        text: textToTranslate,
        targetLanguage: selectedLanguage.code.split('-')[0],
        sourceLanguage: 'en',
      });
      
      console.log('Translation complete');
      setTranslatedText(result);
    } catch (error) {
      console.error('Error translating text:', error);
      setTranslatedText('');
      alert(`Failed to translate text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTranslating(false);
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F9FA' }]}>
      <LinearGradient
        colors={isDark ? ['#1A2421', '#0F3123'] : ['#E9F5E1', '#F8FFEF']}
        style={styles.header}
      >
        <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
          Google AI Services
        </Text>
        <Text style={[styles.headerSubtitle, { color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }]}>
          Advanced ML tools for your farm
        </Text>
      </LinearGradient>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'vision' && styles.activeTab,
            { backgroundColor: isDark ? '#2D2D2D' : '#FFFFFF' }
          ]}
          onPress={() => setSelectedTab('vision')}
        >
          <Cpu size={20} color={isDark ? '#FFFFFF' : '#333333'} />
          <Text style={[styles.tabText, { color: isDark ? '#FFFFFF' : '#333333' }]}>Vision</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'soil' && styles.activeTab,
            { backgroundColor: isDark ? '#2D2D2D' : '#FFFFFF' }
          ]}
          onPress={() => setSelectedTab('soil')}
        >
          <BarChart2 size={20} color={isDark ? '#FFFFFF' : '#333333'} />
          <Text style={[styles.tabText, { color: isDark ? '#FFFFFF' : '#333333' }]}>Soil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'tts' && styles.activeTab,
            { backgroundColor: isDark ? '#2D2D2D' : '#FFFFFF' }
          ]}
          onPress={() => setSelectedTab('tts')}
        >
          <Volume2 size={20} color={isDark ? '#FFFFFF' : '#333333'} />
          <Text style={[styles.tabText, { color: isDark ? '#FFFFFF' : '#333333' }]}>Speech</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'translate' && styles.activeTab,
            { backgroundColor: isDark ? '#2D2D2D' : '#FFFFFF' }
          ]}
          onPress={() => setSelectedTab('translate')}
        >
          <Languages size={20} color={isDark ? '#FFFFFF' : '#333333'} />
          <Text style={[styles.tabText, { color: isDark ? '#FFFFFF' : '#333333' }]}>Translate</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {selectedTab === 'vision' && (
          <View style={styles.tabContent}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
              Crop Analysis with Google Vision AI
            </Text>
            <Text style={[styles.sectionDescription, { color: isDark ? '#BBBBBB' : '#666666' }]}>
              Take a picture of your crop to analyze its health, identify issues, and get recommendations.
            </Text>
            
            <GoogleVisionAnalysis />
          </View>
        )}
        
        {selectedTab === 'soil' && (
          <View style={styles.tabContent}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
              Soil Analysis with Google ML
            </Text>
            <Text style={[styles.sectionDescription, { color: isDark ? '#BBBBBB' : '#666666' }]}>
              Take a picture of your soil to analyze its composition, nutrient levels, and get crop recommendations.
            </Text>
            
            <GoogleSoilAnalysis />
          </View>
        )}
        
        {selectedTab === 'tts' && (
          <View style={styles.tabContent}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
              Text-to-Speech
            </Text>
            <Text style={[styles.sectionDescription, { color: isDark ? '#BBBBBB' : '#666666' }]}>
              Convert text to natural-sounding speech in multiple languages for farming advice.
            </Text>
            
            <View style={styles.ttsContainer}>
              <View style={styles.languageSelector}>
                <Text style={[styles.inputLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                  Language:
                </Text>
                
                <TouchableOpacity 
                  style={[
                    styles.dropdown, 
                    { backgroundColor: isDark ? '#2D2D2D' : '#FFFFFF' }
                  ]}
                  onPress={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                >
                  <Text style={[styles.dropdownText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                    {selectedLanguage.name}
                  </Text>
                  <ChevronDown size={18} color={isDark ? '#FFFFFF' : '#333333'} />
                </TouchableOpacity>
                
                {languageDropdownOpen && (
                  <View style={[
                    styles.dropdownOptions,
                    { backgroundColor: isDark ? '#2D2D2D' : '#FFFFFF' }
                  ]}>
                    {availableLanguages.map((language, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => {
                          setSelectedLanguage(language);
                          setLanguageDropdownOpen(false);
                        }}
                      >
                        <Text style={[styles.dropdownOptionText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                          {language.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              
              <Text style={[styles.inputLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                Enter text to speak:
              </Text>
              
              <TextInput
                style={[
                  styles.textInput,
                  { 
                    color: isDark ? '#FFFFFF' : '#333333',
                    backgroundColor: isDark ? '#2D2D2D' : '#FFFFFF'
                  }
                ]}
                value={textToSpeak}
                onChangeText={setTextToSpeak}
                multiline
                numberOfLines={4}
                placeholder="Enter text to be spoken..."
                placeholderTextColor={isDark ? '#999999' : '#AAAAAA'}
              />
              
              <TouchableOpacity
                style={[styles.speakButton, { opacity: textToSpeak ? 1 : 0.5 }]}
                disabled={!textToSpeak}
                onPress={handleSpeak}
              >
                <Volume2 size={18} color="#FFFFFF" />
                <Text style={styles.speakButtonText}>Speak</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {selectedTab === 'translate' && (
          <View style={styles.tabContent}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
              Translation
            </Text>
            <Text style={[styles.sectionDescription, { color: isDark ? '#BBBBBB' : '#666666' }]}>
              Translate farming advice and guidelines into local languages.
            </Text>
            
            <View style={styles.translateContainer}>
              <Text style={[styles.inputLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                Enter English text to translate:
              </Text>
              
              <TextInput
                style={[
                  styles.textInput,
                  { 
                    color: isDark ? '#FFFFFF' : '#333333',
                    backgroundColor: isDark ? '#2D2D2D' : '#FFFFFF'
                  }
                ]}
                value={textToTranslate}
                onChangeText={setTextToTranslate}
                multiline
                numberOfLines={4}
                placeholder="Enter text to translate..."
                placeholderTextColor={isDark ? '#999999' : '#AAAAAA'}
              />
              
              <View style={styles.languageSelector}>
                <Text style={[styles.inputLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                  Target Language:
                </Text>
                
                <TouchableOpacity 
                  style={[
                    styles.dropdown, 
                    { backgroundColor: isDark ? '#2D2D2D' : '#FFFFFF' }
                  ]}
                  onPress={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                >
                  <Text style={[styles.dropdownText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                    {selectedLanguage.name}
                  </Text>
                  <ChevronDown size={18} color={isDark ? '#FFFFFF' : '#333333'} />
                </TouchableOpacity>
                
                {languageDropdownOpen && (
                  <View style={[
                    styles.dropdownOptions,
                    { backgroundColor: isDark ? '#2D2D2D' : '#FFFFFF' }
                  ]}>
                    {availableLanguages.map((language, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownOption}
                        onPress={() => {
                          setSelectedLanguage(language);
                          setLanguageDropdownOpen(false);
                        }}
                      >
                        <Text style={[styles.dropdownOptionText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                          {language.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              
              <TouchableOpacity
                style={[
                  styles.translateButton, 
                  { opacity: textToTranslate && !translating ? 1 : 0.5 }
                ]}
                disabled={!textToTranslate || translating}
                onPress={handleTranslate}
              >
                <Languages size={18} color="#FFFFFF" />
                <Text style={styles.translateButtonText}>
                  {translating ? 'Translating...' : 'Translate'}
                </Text>
              </TouchableOpacity>
              
              {translatedText && (
                <View style={[
                  styles.translationResult,
                  { backgroundColor: isDark ? '#2D2D2D' : '#FFFFFF' }
                ]}>
                  <Text style={[styles.translationTitle, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                    Translation to {selectedLanguage.name}:
                  </Text>
                  <Text style={[styles.translatedText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                    {translatedText}
                  </Text>
                  
                  <TouchableOpacity
                    style={styles.speakTranslationButton}
                    onPress={() => speak({ text: translatedText, languageCode: selectedLanguage.code })}
                  >
                    <Volume2 size={16} color="#FFFFFF" />
                    <Text style={styles.speakTranslationText}>Listen</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
    paddingTop: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#38B000',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 5,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  tabContent: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  ttsContainer: {
    marginTop: 10,
  },
  languageSelector: {
    marginBottom: 15,
    position: 'relative',
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  dropdownText: {
    fontSize: 14,
  },
  dropdownOptions: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 200,
  },
  dropdownOption: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  dropdownOptionText: {
    fontSize: 14,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  speakButton: {
    backgroundColor: '#38B000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  speakButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  translateContainer: {
    marginTop: 10,
  },
  translateButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  translateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  translationResult: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  translationTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  translatedText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  speakTranslationButton: {
    backgroundColor: '#38B000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  speakTranslationText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
}); 