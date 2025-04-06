import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  useColorScheme,
  Keyboard,
  Animated,
} from 'react-native';
import { Send, Mic, Bot, X, ChevronDown, RefreshCw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIChatbotProps {
  onClose: () => void;
}

const PREDEFINED_RESPONSES = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings'],
    response: "Hello! I'm your AI farming assistant. How can I help you today?"
  },
  {
    keywords: ['crops', 'plant', 'seed', 'sow'],
    response: "For optimal crop growth, ensure proper soil preparation, adequate spacing, and regular watering. What specific crop are you interested in growing?"
  },
  {
    keywords: ['fertilizer', 'nutrients', 'feed'],
    response: "Organic fertilizers like compost and manure improve soil health over time. Chemical fertilizers provide immediate nutrients. Consider a soil test to determine exactly what your soil needs."
  },
  {
    keywords: ['pest', 'insect', 'disease', 'bug'],
    response: "Integrated Pest Management (IPM) combines biological controls, habitat manipulation, and resistant crop varieties with judicious pesticide use. Could you describe the pest issue or upload a photo?"
  },
  {
    keywords: ['water', 'irrigation', 'drought', 'rain'],
    response: "For efficient water usage, consider drip irrigation, mulching to retain moisture, and watering during early morning or evening to reduce evaporation. How is your current irrigation setup?"
  },
  {
    keywords: ['weather', 'forecast', 'climate', 'rain'],
    response: "Weather patterns significantly impact farming decisions. I can help you understand forecasts and plan accordingly. Are you concerned about any specific upcoming weather conditions?"
  },
  {
    keywords: ['organic', 'natural', 'chemical-free'],
    response: "Organic farming focuses on ecological balance and biodiversity. Key practices include crop rotation, green manures, composting, and biological pest control. What aspect of organic farming interests you most?"
  },
  {
    keywords: ['market', 'price', 'sell', 'buyer'],
    response: "Local farmers' markets, CSAs (Community Supported Agriculture), wholesale to restaurants, and online marketplaces are all viable options for selling produce. Would you like more specific market information for your area?"
  },
  {
    keywords: ['soil', 'dirt', 'earth', 'ground'],
    response: "Healthy soil contains a balance of minerals, organic matter, air, and water. Regular testing helps maintain optimal pH and nutrient levels. Would you like tips on improving your soil quality?"
  },
  {
    keywords: ['thanks', 'thank you', 'helpful'],
    response: "You're welcome! I'm glad I could help. Feel free to ask if you have any other questions about farming."
  }
];

export default function AIChatbot({ onClose }: AIChatbotProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello, I'm your AI farming assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const heightAnim = useRef(new Animated.Value(500)).current;
  
  const toggleMinimize = () => {
    const newValue = !isMinimized;
    setIsMinimized(newValue);
    
    Animated.timing(heightAnim, {
      toValue: newValue ? 60 : 500,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  
  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const sendMessage = () => {
    if (inputText.trim() === '') return;
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages([...messages, newUserMessage]);
    setInputText('');
    setIsLoading(true);
    
    // Simulate AI response with a slight delay
    setTimeout(() => {
      const response = generateResponse(inputText);
      
      const newAIMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newAIMessage]);
      setIsLoading(false);
    }, 1000);
    
    Keyboard.dismiss();
  };
  
  const generateResponse = (query: string) => {
    // Simple keyword matching for demonstration
    const lowerQuery = query.toLowerCase();
    
    for (const item of PREDEFINED_RESPONSES) {
      if (item.keywords.some(keyword => lowerQuery.includes(keyword))) {
        return item.response;
      }
    }
    
    // Default response if no keywords match
    return "I understand you're asking about farming, but I need more specific information to provide a helpful answer. Could you please elaborate on your question? For example, you can ask about specific crops, pest management, irrigation techniques, or soil health.";
  };
  
  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: "Hello, I'm your AI farming assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Animated.View style={[styles.container, { height: heightAnim }]}>
      <LinearGradient
        colors={isDark ? ['#0F3123', '#1A2421'] : ['#F8FFEF', '#E9F5E1']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Bot size={24} color="#FFFFFF" />
          {!isMinimized && (
            <Text style={styles.headerTitle}>AI Farming Assistant</Text>
          )}
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.headerButton} onPress={toggleMinimize}>
              <ChevronDown size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={onClose}>
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      
      {!isMinimized && (
        <>
          <ScrollView
            ref={scrollViewRef}
            style={[styles.messagesContainer, { backgroundColor: isDark ? '#121212' : '#F8F9FA' }]}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageWrapper,
                  message.isUser ? styles.userMessageWrapper : styles.botMessageWrapper,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    message.isUser
                      ? [styles.userMessageBubble, { backgroundColor: '#38B000' }]
                      : [styles.botMessageBubble, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }],
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.isUser
                        ? styles.userMessageText
                        : [styles.botMessageText, { color: isDark ? '#FFFFFF' : '#333333' }],
                    ]}
                  >
                    {message.text}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.messageTime,
                    message.isUser ? styles.userMessageTime : styles.botMessageTime,
                  ]}
                >
                  {formatTime(message.timestamp)}
                </Text>
              </View>
            ))}
            {isLoading && (
              <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
                <ActivityIndicator size="small" color="#38B000" />
                <Text style={[styles.loadingText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                  AI is thinking...
                </Text>
              </View>
            )}
          </ScrollView>
          
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={[styles.inputContainer, { backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF' }]}
          >
            <TouchableOpacity
              style={[styles.resetButton, { backgroundColor: isDark ? '#333333' : '#EEEEEE' }]}
              onPress={clearChat}
            >
              <RefreshCw size={18} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>
            <TextInput
              style={[styles.input, { color: isDark ? '#FFFFFF' : '#333333', backgroundColor: isDark ? '#333333' : '#F0F0F0' }]}
              placeholder="Ask about farming..."
              placeholderTextColor={isDark ? '#888888' : '#999999'}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: inputText.trim() === '' ? '#CCCCCC' : '#38B000' }]}
              onPress={sendMessage}
              disabled={inputText.trim() === ''}
            >
              <Send size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 350,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  header: {
    height: 60,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 5,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageWrapper: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  userMessageWrapper: {
    alignSelf: 'flex-end',
  },
  botMessageWrapper: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 2,
  },
  userMessageBubble: {
    borderBottomRightRadius: 4,
  },
  botMessageBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  botMessageText: {
    color: '#333333',
  },
  messageTime: {
    fontSize: 11,
  },
  userMessageTime: {
    alignSelf: 'flex-end',
    color: '#888888',
  },
  botMessageTime: {
    alignSelf: 'flex-start',
    color: '#888888',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 18,
    marginBottom: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 