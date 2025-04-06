import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Animated, 
  Dimensions, 
  Platform, 
  StatusBar,
  ImageBackground
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguageStore } from '../store/languageStore';

const { width, height } = Dimensions.get('window');

// Custom icon components that use FontAwesome5 instead of Lucide
const CustomIcons = {
  Bot: ({ size, color }: {size: number, color: string}) => (
    <FontAwesome5 name="robot" size={size} color={color} />
  ),
  Cloud: ({ size, color }: {size: number, color: string}) => (
    <FontAwesome5 name="cloud" size={size} color={color} />
  ),
  Leaf: ({ size, color }: {size: number, color: string}) => (
    <FontAwesome5 name="leaf" size={size} color={color} />
  ),
  Droplets: ({ size, color }: {size: number, color: string}) => (
    <FontAwesome5 name="tint" size={size} color={color} />
  ),
  ArrowRight: ({ size, color, style }: {size: number, color: string, style?: any}) => (
    <FontAwesome5 name="arrow-right" size={size} color={color} style={style} />
  )
};

export default function WelcomeScreen() {
  const { isDark, primaryColor, updateWithColorScheme } = useThemeStore();
  const { translations: t } = useLanguageStore();
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const insets = useSafeAreaInsets();

  // Define slides with high-quality imagery
  const slides = [
    {
      title: "AI-Powered Farming",
      description: "Smart solutions for smallholder farmers",
      iconName: "robot",
      color: primaryColor || "#38B000",
      image: "https://plus.unsplash.com/premium_photo-1661962692059-55d5a4319814?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YWdyaWN1bHR1cmV8ZW58MHx8MHx8fDA%3D",
      gradient: ['rgba(0,0,0,0)', 'rgba(26, 36, 33, 0.85)', 'rgba(15, 49, 35, 0.98)'] as [string, string, string]
    },
    {
      title: "Modern Farming Techniques",
      description: "Digital tools to maximize your yield",
      iconName: "cloud",
      color: "#4361EE",
      image: "https://c4.wallpaperflare.com/wallpaper/289/877/184/farm-modern-agriculture-digital-art-others-wallpaper-preview.jpg",
      gradient: ['rgba(0,0,0,0)', 'rgba(26, 33, 36, 0.85)', 'rgba(15, 35, 49, 0.98)'] as [string, string, string]
    },
    {
      title: "Sustainable Agriculture",
      description: "Eco-friendly solutions for better farming",
      iconName: "leaf",
      color: "#F72585",
      image: "https://www.ippi.org.il/wp-content/uploads/2023/03/Sustainable-Agriculture_Zeller-1-PhotoRoom.png",
      gradient: ['rgba(0,0,0,0)', 'rgba(36, 26, 33, 0.85)', 'rgba(49, 15, 35, 0.98)'] as [string, string, string]
    },
    {
      title: "Smart Monitoring",
      description: "Real-time data for informed decisions",
      iconName: "tint",
      color: "#3A86FF",
      image: "https://thumbs.dreamstime.com/b/smart-farm-technology-plant-sprout-growing-soil-infographic-icons-infographics-red-alert-icon-temperature-207022867.jpg",
      gradient: ['rgba(0,0,0,0)', 'rgba(26, 33, 36, 0.85)', 'rgba(15, 35, 49, 0.98)'] as [string, string, string]
    }
  ];

  useEffect(() => {
    // Fade in animation when component mounts
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    // Reset slider animation
    slideAnim.setValue(0);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Automatically advance to the next slide every 3 seconds
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentSlide, slides.length]);

  const handleGetStarted = () => {
    // Navigate to home screen
    router.replace('/(tabs)/home');
  };

  const skipToSlide = (index: number) => {
    if (index === currentSlide) return;
    
    setCurrentSlide(index);
    // Reset the timer when manually changing slides
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 3000);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <ImageBackground 
        source={{ uri: slides[currentSlide].image }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={slides[currentSlide].gradient}
          style={styles.gradient}
        />
        
        <Animated.View 
          style={[styles.content, { 
              opacity: fadeAnim,
              paddingTop: insets.top + 20,
              paddingBottom: insets.bottom + 20
            }]}
        >
          {/* Header Logo */}
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <FontAwesome5 
                name={slides[currentSlide].iconName} 
                size={28} 
                color={slides[currentSlide].color} 
              />
            </View>
            <Text style={styles.logoText}>CropGenies and Co</Text>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <Animated.View
              style={[
                styles.slideTextContainer,
                {
                  opacity: Animated.subtract(1, slideAnim),
                  transform: [
                    { translateY: Animated.multiply(slideAnim, 20) }
                  ]
                }
              ]}
            >
              <Text style={styles.slideNumber}>
                {currentSlide + 1}/{slides.length}
              </Text>
              <Text style={styles.slideTitle}>
                {slides[currentSlide].title}
              </Text>
              <Text style={styles.slideDescription}>
                {slides[currentSlide].description}
              </Text>
            </Animated.View>
            
            <View style={styles.dotsContainer}>
              {slides.map((_, index) => (
                <TouchableOpacity 
                  key={index} 
                  onPress={() => skipToSlide(index)}
                  style={[
                    styles.dot, 
                    { 
                      backgroundColor: currentSlide === index ? 
                        slides[currentSlide].color : 
                        'rgba(255, 255, 255, 0.3)',
                      width: currentSlide === index ? 24 : 10 
                    }
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={[styles.skipButton]}
              onPress={handleGetStarted}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.getStartedButton, { backgroundColor: slides[currentSlide].color }]}
              onPress={handleGetStarted}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
              <FontAwesome5 
                name="arrow-right" 
                size={20} 
                color="#FFFFFF" 
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingBottom: 60,
  },
  slideTextContainer: {
    width: '100%',
    maxWidth: 320,
  },
  slideNumber: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 8,
    fontWeight: '500',
  },
  slideTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 42
  },
  slideDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
    marginBottom: 32
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  getStartedButton: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  skipButton: {
    padding: 16,
  },
  skipText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.7,
  }
});