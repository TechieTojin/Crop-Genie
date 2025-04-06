import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  Image,
} from 'react-native';
import { Send, Mic, X, Leaf, Bot, RefreshCw } from 'lucide-react-native';
import { useThemeStore } from '../../store/themeStore';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  FadeIn,
  FadeOut
} from 'react-native-reanimated';

// Mock data for suggestions
const suggestions = [
  "How to deal with tomato leaf blight?",
  "Best practices for water conservation",
  "Organic fertilizers for vegetables",
  "When to harvest maize?",
  "How to identify nutrient deficiency?",
  "Pest control for small farms"
];

// Mock responses for demonstration
const mockResponses: Record<string, string> = {
  "How to deal with tomato leaf blight?": 
    "To manage tomato leaf blight:\n\n1. Remove and destroy infected leaves\n2. Improve air circulation around plants\n3. Water at the base of plants to avoid wetting leaves\n4. Apply copper-based fungicides as a preventative\n5. Rotate crops to prevent disease buildup in soil\n6. Consider resistant varieties for future planting",
  
  "Best practices for water conservation":
    "Effective water conservation strategies include:\n\n1. Install drip irrigation systems for targeted watering\n2. Apply mulch around plants to reduce evaporation\n3. Harvest rainwater using barrels or tanks\n4. Water early morning or evening to reduce evaporation\n5. Group plants with similar water needs together\n6. Monitor soil moisture regularly to avoid overwatering",
  
  "Organic fertilizers for vegetables":
    "Recommended organic fertilizers for vegetables:\n\n1. Compost - balanced nutrients and improves soil structure\n2. Manure (aged) - high in nitrogen and organic matter\n3. Bone meal - excellent source of phosphorus\n4. Fish emulsion - quick-release nitrogen\n5. Seaweed extract - contains trace minerals and growth hormones\n6. Green manure - cover crops turned into soil for nutrients",
  
  "When to harvest maize?":
    "For maize harvest timing:\n\n1. Sweet corn: harvest when kernels are plump and produce milky juice when punctured\n2. Field corn: allow to dry on stalk until husks turn brown\n3. The silks should be dry and brown\n4. Kernels should be firm but not hard\n5. For sweet corn, check regularly as optimal harvest window is only 2-3 days\n6. Harvest in the morning for best flavor",
  
  "How to identify nutrient deficiency?":
    "To identify common nutrient deficiencies in crops:\n\n1. Nitrogen: yellowing of older leaves starting at tips\n2. Phosphorus: purple discoloration, stunted growth\n3. Potassium: brown scorching and curling of leaf tips\n4. Calcium: young leaves distorted, blossom end rot in fruits\n5. Magnesium: yellowing between leaf veins, starting with older leaves\n6. Iron: yellowing between veins of young leaves",
  
  "Pest control for small farms":
    "Sustainable pest control methods for small farms:\n\n1. Companion planting to repel pests naturally\n2. Introduce beneficial insects like ladybugs and praying mantis\n3. Use physical barriers like row covers and netting\n4. Apply neem oil or insecticidal soaps for mild infestations\n5. Practice crop rotation to break pest cycles\n6. Maintain healthy soil to grow stronger, pest-resistant plants",
  
  // New Q&A data
  "What is CropGenies and Co?": 
    "CropGenies and Co is an AI-powered smart farming solution that helps smallholder farmers optimize crop management, detect pests early, and improve productivity using AI-driven insights.",
  
  "How does the platform assist farmers?": 
    "It provides real-time alerts, AI-powered crop analysis, soil analysis, weather forecasting, and multi-language support to help farmers make informed decisions.",
  
  "What makes CropGenies and Co different from other farming apps?": 
    "It integrates AI with real-time analytics, multi-language support, and Google-powered tools, offering tailored insights for smallholder farmers.",
  
  "Why is AI important in smart farming?": 
    "AI helps analyze vast amounts of agricultural data, providing real-time insights on crop health, soil conditions, and weather patterns, improving farming efficiency.",
  
  "How does multi-language support benefit farmers?": 
    "The platform includes text-to-speech and translation services in 10+ Indian languages, making information accessible to a wider audience.",
  
  "What is the primary color of the app's design system?": 
    "The primary brand color is Green (#38B000), symbolizing growth and sustainability.",
  
  "What is the purpose of the Secondary Teal color?": 
    "The Teal (#00B4D8) color is used for secondary actions and information display.",
  
  "How does the app ensure accessibility?": 
    "It uses high-contrast text, consistent spacing, and subtle shadows for better visibility, even in outdoor settings.",
  
  "Why is the background color chosen as Light Mint?": 
    "It provides a soft, eye-friendly background that enhances readability in bright conditions.",
  
  "What color is used for alerts and warnings?": 
    "Amber (#FFBB38) is used for alerts, while Coral (#FF7B67) is used for warnings and important notifications.",
  
  "What is AI-powered crop and disease analysis?": 
    "Farmers can upload crop images, and the system uses Google Vision AI to detect diseases and suggest remedies.",
  
  "How does soil analysis work?": 
    "AI analyzes soil composition and recommends the best crops suited for the detected soil type.",
  
  "Why is real-time weather forecasting important?": 
    "It helps farmers plan irrigation, pest control, and harvesting schedules based on accurate weather predictions.",
  
  "How does Google Maps integration help farmers?": 
    "Farmers can locate nearby agricultural services, such as suppliers, markets, and advisory centers.",
  
  "What is the benefit of a user-friendly UI?": 
    "The interface is optimized for both mobile and web use, ensuring easy navigation for all users.",
  
  "Does the app support Dark Mode?": 
    "Yes, users can switch between Dark and Light modes for comfortable viewing in any environment.",
  
  "What role does Google Text-to-Speech play?": 
    "It allows farmers to listen to information in their preferred language, improving accessibility.",
  
  "How does AI contribute to pest detection?": 
    "The AI model identifies pests in crop images and suggests immediate countermeasures.",
  
  "Can the app be used offline?": 
    "Yes, it has PWA (Progressive Web App) support, enabling offline access to essential features.",
  
  "What platforms does the app support?": 
    "It runs on Web, iOS, Android, and also functions as a Progressive Web App (PWA).",
  
  "Which AI models power crop and soil analysis?": 
    "Google Vision AI and Google ML are used for image recognition and soil analysis.",
  
  "How does the app provide multi-language support?": 
    "Google Translation services enable automatic text conversion into different languages.",
  
  "Which cloud services are used?": 
    "Google's AI and ML services, along with cloud-based data processing, power the system.",
  
  "Why is Google Maps used in the app?": 
    "It helps farmers find local agribusiness services such as markets and suppliers.",
  
  "Is the app built using a cross-platform framework?": 
    "Yes, it is developed using React Native and Expo, ensuring smooth performance across devices.",
  
  "Is the app optimized for mobile devices?": 
    "Yes, it offers a fully native experience for both iOS and Android.",
  
  "Does the app work on desktop browsers?": 
    "Yes, it is optimized for web use via React Native Web.",
  
  "What ensures smooth API integration across platforms?": 
    "Cross-platform API integration with graceful fallbacks ensures stability.",
  
  "Can users install the app like a regular app?": 
    "Yes, the PWA support allows it to be installed on devices without an app store.",
  
  "How does the app handle network failures?": 
    "Offline caching and PWA capabilities allow essential features to work without the internet.",
  
  "Can users contribute to the project?": 
    "Yes, contributions are welcome via pull requests and issue tracking.",
  
  "What license does the project use?": 
    "It is licensed under the MIT License.",
  
  "Where should users report bugs?": 
    "Bugs can be reported by opening an issue in the GitHub repository.",
  
  "How to submit major code changes?": 
    "Open an issue first to discuss the proposed changes before submitting a pull request.",
  
  "How can this app help me improve my farming?": 
    "This app provides AI-powered crop analysis, soil testing, and real-time weather updates to help you make better farming decisions.",
  
  "Can I check if my crops are infected with pests?": 
    "Yes! You can upload a photo of your crops, and our AI will analyze it to detect pests or diseases and suggest solutions.",
  
  "How does the app help me choose the right crop for my land?": 
    "The soil analysis feature checks soil composition and gives recommendations on the best crops for your land.",
  
  "Will the app tell me when to water my crops?": 
    "Yes, the real-time weather forecast helps you plan irrigation efficiently, saving water and improving yield.",
  
  "I don't speak English well. Can I use this app in my language?": 
    "Of course! The app supports over 10 Indian languages with text-to-speech and translation services.",
  
  "Can I use the app without an internet connection?": 
    "Yes! The Progressive Web App (PWA) feature allows offline access to important tools and data.",
  
  "How does this app know about the weather?": 
    "The app pulls real-time weather data from trusted sources to give you accurate forecasts for your farm.",
  
  "I don't know much about technology. Is the app easy to use?": 
    "Yes! The app is designed with a simple and user-friendly interface, making it easy for all farmers to navigate.",
  
  "Can I find nearby fertilizer or seed stores using this app?": 
    "Yes! The app integrates Google Maps to help you locate nearby agricultural services and suppliers.",
  
  "Will this app remind me when to apply fertilizers or pesticides?": 
    "Yes! You can set alerts and reminders to manage your crop schedule efficiently.",
  
  "Does the app tell me the best time to plant my crops?": 
    "Yes! Based on weather patterns and soil conditions, the app suggests the best planting times.",
  
  "Can I get voice guidance instead of reading?": 
    "Yes! The app includes a voice assistant that reads out important information for you.",
  
  "Does the app support both mobile and computer use?": 
    "Yes! You can use it on your smartphone, tablet, or computer for easy access.",
  
  "How do I take a soil test using the app?": 
    "Simply enter soil details manually, or use an external soil testing device that can connect to the app.",
  
  "Can I share my farming data with other farmers or experts?": 
    "Yes! You can share reports and insights with experts or other farmers to get advice.",
  
  "Does the app work in very bright sunlight?": 
    "Yes! The app design ensures high contrast and readability for outdoor use.",
  
  "How does the AI decide what's wrong with my crops?": 
    "The AI compares your crop image with a large database of plant diseases and gives recommendations based on patterns.",
  
  "Will the app tell me how much profit I can make from my crops?": 
    "Not yet, but we plan to add financial tools to estimate crop yield and profit soon!",
  
  "How often should I update the app?": 
    "It's best to keep the app updated to get the latest features and improvements."
};

// For other queries, generate a response based on predefined knowledge
const generateResponse = (query: string) => {
  // Check exact matches first
  if (mockResponses[query]) {
    return mockResponses[query];
  }
  
  // Handle general queries
  if (query.toLowerCase().includes('fertilizer') || query.toLowerCase().includes('nutrient')) {
    return "For healthy crops, ensure balanced application of NPK fertilizers. Consider soil testing before application. Organic options include compost, manure, and bone meal. Apply fertilizers in the morning or evening for best results.";
  }
  
  if (query.toLowerCase().includes('water') || query.toLowerCase().includes('irrigation')) {
    return "Water conservation is crucial for sustainable farming. Consider drip irrigation, water early morning or evening, and use mulch to reduce evaporation. Monitor soil moisture regularly and adjust watering based on weather conditions.";
  }
  
  if (query.toLowerCase().includes('pest') || query.toLowerCase().includes('disease')) {
    return "Integrated Pest Management (IPM) combines prevention, monitoring, and control strategies. Start with resistant varieties, maintain field hygiene, and introduce beneficial insects. Use chemical controls only as a last resort, following all safety guidelines.";
  }
  
  // Default response
  return "That's an interesting farming question. To provide the most accurate advice, I'd recommend consulting with your local agricultural extension officer for region-specific guidance. Would you like information on any specific farming practices?";
};

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function AIAssistant() {
  const { isDark } = useThemeStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your farming assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const inputHeight = useSharedValue(48);
  
  // Animated styles
  const inputContainerStyle = useAnimatedStyle(() => {
    return {
      height: inputHeight.value,
    };
  });

  // Scroll to bottom when new messages come in
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setShowSuggestions(false);
    
    // Hide keyboard
    Keyboard.dismiss();
    
    // Simulate API response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputText),
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
    handleSendMessage();
  };

  const handleInputFocus = () => {
    inputHeight.value = withTiming(80);
  };

  const handleInputBlur = () => {
    inputHeight.value = withTiming(48);
  };

  const resetChat = () => {
    setMessages([
      {
        id: '1',
        text: "Hello! I'm your farming assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    setShowSuggestions(true);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#1A1A1A' : '#ffffff' }]}>
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <Bot size={24} color="#38B000" />
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#333333' }]}>
              FarmGenius
            </Text>
            <Text style={[styles.headerSubtitle, { color: isDark ? '#bbbbbb' : '#666666' }]}>
              AI Farming Assistant
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.resetButton} onPress={resetChat}>
          <RefreshCw size={18} color={isDark ? '#dddddd' : '#666666'} />
        </TouchableOpacity>
      </View>
      
      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <Animated.View 
            key={message.id}
            entering={FadeIn.duration(300)}
            style={[
              styles.messageBubble,
              message.isUser 
                ? [styles.userBubble, { backgroundColor: '#38B000' }] 
                : [styles.botBubble, { backgroundColor: isDark ? '#2A2A2A' : '#ffffff' }]
            ]}
          >
            {!message.isUser && (
              <View style={styles.bubbleAvatar}>
                <Bot size={16} color="#38B000" />
              </View>
            )}
            <Text 
              style={[
                styles.messageText, 
                message.isUser 
                  ? styles.userText 
                  : { color: isDark ? '#ffffff' : '#333333' }
              ]}
            >
              {message.text}
            </Text>
          </Animated.View>
        ))}
        
        {isLoading && (
          <Animated.View 
            entering={FadeIn.duration(300)}
            style={[
              styles.messageBubble,
              styles.botBubble,
              { backgroundColor: isDark ? '#2A2A2A' : '#ffffff' }
            ]}
          >
            <ActivityIndicator size="small" color="#38B000" />
          </Animated.View>
        )}
      </ScrollView>
      
      {/* Suggested Questions */}
      {showSuggestions && messages.length < 3 && (
        <View style={styles.suggestionsContainer}>
          <Text style={[styles.suggestionsTitle, { color: isDark ? '#ffffff' : '#333333' }]}>
            Suggested Questions
          </Text>
          <View style={styles.suggestionsList}>
            {suggestions.map((suggestion, index) => (
              <AnimatedTouchableOpacity
                key={index}
                entering={FadeIn.delay(index * 100).duration(300)}
                style={[
                  styles.suggestionChip,
                  { backgroundColor: isDark ? '#2A2A2A' : '#ffffff' }
                ]}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <Leaf size={14} color="#38B000" style={styles.suggestionIcon} />
                <Text 
                  style={[
                    styles.suggestionText,
                    { color: isDark ? '#DDDDDD' : '#333333' }
                  ]}
                  numberOfLines={1}
                >
                  {suggestion}
                </Text>
              </AnimatedTouchableOpacity>
            ))}
          </View>
        </View>
      )}
      
      {/* Input Area */}
      <Animated.View 
        style={[
          styles.inputContainer, 
          { backgroundColor: isDark ? '#1A1A1A' : '#ffffff' },
          inputContainerStyle
        ]}
      >
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: isDark ? '#2A2A2A' : '#f0f0f0',
              color: isDark ? '#ffffff' : '#333333' 
            }
          ]}
          placeholder="Ask anything about farming..."
          placeholderTextColor={isDark ? '#888888' : '#999999'}
          value={inputText}
          onChangeText={setInputText}
          multiline
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            { backgroundColor: inputText.trim() ? '#38B000' : isDark ? '#2A2A2A' : '#e0e0e0' }
          ]}
          onPress={handleSendMessage}
          disabled={inputText.trim() === ''}
        >
          <Send 
            size={20} 
            color={inputText.trim() ? '#ffffff' : isDark ? '#888888' : '#999999'} 
          />
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(56, 176, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
  },
  resetButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bubbleAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(56, 176, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  userText: {
    color: '#ffffff',
  },
  suggestionsContainer: {
    padding: 16,
    paddingTop: 8,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  suggestionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    maxWidth: '47%',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  suggestionIcon: {
    marginRight: 6,
  },
  suggestionText: {
    fontSize: 14,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 120,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
}); 