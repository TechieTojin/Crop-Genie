import { useState, useEffect } from 'react';
import * as React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, useColorScheme, ActivityIndicator, ImageBackground, Dimensions, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Droplets, Zap, Languages, Cloud, Leaf, Sun, Wind, Moon, ChevronDown, Check, Bot, MessageCircle, Menu, BarChart, Calendar, AlertCircle, MapPin, Sprout, Users, } from 'lucide-react-native';
import { useLanguageStore } from '../../store/languageStore';
import { useThemeStore } from '../../store/themeStore';
import { getWeatherData } from '../../lib/api/weatherApi';
import { getCropRecommendations, getIrrigationRecommendations, getFertilizerRecommendations } from '../../lib/api/agricultureApi';
import ResourceRecommendation from '../../components/ResourceRecommendation';
import AIChatbot from '../../components/AIChatbot';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/colors';
import { useDrawerStatus } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import type { AvailableLanguage } from '../../store/languageStore';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

const { width } = Dimensions.get('window');

// Define types for the dashboard card component props
interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  value?: string | number;
  color: string;
  onPress: () => void;
  disabled?: boolean;
  isLarge?: boolean;
}

export default function HomeScreen() {
  const { isDark, toggleTheme, primaryColor } = useThemeStore();
  const { language, setLanguage, translations: t } = useLanguageStore();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const isDrawerOpen = useDrawerStatus() === 'open';

  const [weatherSummary, setWeatherSummary] = useState<{ temp: number; condition: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [resourceType, setResourceType] = useState<'irrigation' | 'fertilizer' | null>(null);
  const [resourceData, setResourceData] = useState<any>(null);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [chatbotVisible, setChatbotVisible] = useState(false);

  const availableLanguages = ['English', 'Hindi', 'Kannada', 'Malayalam'];

  useEffect(() => {
    fetchWeatherSummary();
  }, []);

  const fetchWeatherSummary = async () => {
    try {
      const weatherData = await getWeatherData();
      if (weatherData) {
        setWeatherSummary({
          temp: weatherData.currentTemp,
          condition: weatherData.condition
        });
      }
    } catch (error) {
      console.error('Error fetching weather summary:', error);
    }
  };

  const handleIrrigationPress = async () => {
    try {
      setLoading(true);
      // In a real app, these would come from the user's profile
      const cropType = 'Rice';
      const fieldSize = '5 acres';
      
      // Get irrigation recommendations
      const recommendations = await getIrrigationRecommendations(18.52, 73.85, cropType, fieldSize);
      
      if (recommendations) {
        setResourceType('irrigation');
        setResourceData(recommendations);
      }
    } catch (error) {
      console.error('Error getting irrigation recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFertilizerPress = async () => {
    try {
      setLoading(true);
      // In a real app, these would come from the user's profile
      const cropType = 'Wheat';
      const fieldSize = '5 acres';
      const soilType = 'Black soil (Regur)';
      
      // Get fertilizer recommendations
      const recommendations = await getFertilizerRecommendations(18.52, 73.85, cropType, fieldSize, soilType);
      
      if (recommendations) {
        setResourceType('fertilizer');
        setResourceData(recommendations);
      }
    } catch (error) {
      console.error('Error getting fertilizer recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResourceApply = () => {
    // In a real app, this would save the recommendation to the user's profile
    // and potentially schedule notifications or tasks
    setResourceType(null);
    setResourceData(null);
  };

  // Modern Dashboard Card component
  const DashboardCard = ({ 
    icon, 
    title, 
    subtitle, 
    value, 
    color, 
    onPress, 
    disabled = false,
    isLarge = false
  }: DashboardCardProps) => (
    <TouchableOpacity
      style={[
        styles.dashboardCard,
        isLarge ? styles.dashboardCardLarge : {},
        { 
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
          opacity: disabled ? 0.7 : 1,
        }
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={[styles.dashboardCardIconContainer, { backgroundColor: `${color}20` }]}>
        {icon}
      </View>
      
      <View style={styles.dashboardCardContent}>
        <Text style={[styles.dashboardCardTitle, { 
          color: isDark ? Colors.DARK.TEXT.PRIMARY : Colors.NEUTRAL.TEXT.PRIMARY
        }]}>
          {title}
        </Text>
        
        {subtitle && (
          <Text style={[styles.dashboardCardSubtitle, { 
            color: isDark ? Colors.DARK.TEXT.SECONDARY : Colors.NEUTRAL.TEXT.SECONDARY
          }]}>
            {subtitle}
          </Text>
        )}
        
        {value && (
          <Text style={[styles.dashboardCardValue, { color }]}>
            {value}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { 
      backgroundColor: isDark ? '#121212' : '#F5F7FA'
    }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Menu size={24} color={isDark ? "#FFFFFF" : "#000000"} />
        </TouchableOpacity>
        
        <View>
          <Text style={[styles.greeting, { color: isDark ? '#FFFFFF' : '#333333', opacity: 0.7 }]}>
            {t.greeting}
          </Text>
          <Text style={[styles.farmName, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            CropGenies and Co
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          <LanguageSwitcher buttonStyle={styles.languageButton} />
          
          <TouchableOpacity
            style={[styles.themeToggle, { 
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
            }]}
            onPress={toggleTheme}
          >
            {isDark ? (
              <Sun size={20} color="#FFFFFF" />
            ) : (
              <Moon size={20} color="#333333" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Weather Card */}
        <LinearGradient
          colors={isDark ? 
            ['#17332A', '#0D261E'] : 
            ['#E9F5E1', '#C7E5B7']
          }
          style={styles.weatherCard}
        >
          {weatherSummary ? (
            <>
              <View style={styles.weatherCardHeader}>
                <Text style={styles.weatherCardTitle}>Current Weather</Text>
                <MapPin size={18} color="#FFFFFF" />
              </View>
              
              <View style={styles.weatherCardContent}>
                <View>
                  <Text style={styles.weatherCardTemp}>{weatherSummary.temp}°C</Text>
                  <Text style={styles.weatherCardCondition}>{weatherSummary.condition}</Text>
                </View>
                
                <View style={styles.weatherCardIconContainer}>
                  {weatherSummary.condition.toLowerCase().includes('sun') ? (
                    <Sun size={40} color="#FFD700" />
                  ) : weatherSummary.condition.toLowerCase().includes('cloud') ? (
                    <Cloud size={40} color="#FFFFFF" />
                  ) : weatherSummary.condition.toLowerCase().includes('rain') ? (
                    <Droplets size={40} color="#FFFFFF" />
                  ) : (
                    <Wind size={40} color="#FFFFFF" />
                  )}
                </View>
              </View>
            </>
          ) : (
            <View style={styles.loadingWeather}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.loadingWeatherText}>Loading weather data...</Text>
            </View>
          )}
        </LinearGradient>
        
        {/* Quick Access Section */}
        <View style={styles.quickAccessSection}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            Quick Access
          </Text>
          
          <View style={styles.quickAccessGrid}>
            <DashboardCard 
              icon={<Bot size={24} color="#4361EE" />}
              title="AI Assistant"
              subtitle="Get answers"
              color="#4361EE"
              onPress={() => setChatbotVisible(true)}
            />
            
            <DashboardCard 
              icon={<AlertCircle size={24} color="#F72585" />}
              title="Alerts"
              subtitle="2 new alerts"
              color="#F72585"
              onPress={() => {}}
            />
            
            <DashboardCard 
              icon={<BarChart size={24} color="#7209B7" />}
              title="Reports"
              subtitle="View statistics"
              color="#7209B7"
              onPress={() => {}}
            />
            
            <DashboardCard 
              icon={<Calendar size={24} color="#3A86FF" />}
              title="Schedule"
              subtitle="Upcoming tasks"
              color="#3A86FF"
              onPress={() => {}}
            />
          </View>
        </View>
        
        {/* Resource Management Section */}
        <View style={styles.resourceSection}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            Resource Management
          </Text>
          
          <View style={styles.resourceCards}>
            <DashboardCard 
              icon={<Droplets size={24} color="#38B000" />}
              title="Water Management"
              subtitle="Smart irrigation"
              value="Last check: Today"
              color="#38B000"
              onPress={handleIrrigationPress}
              isLarge={true}
            />
            
            <DashboardCard 
              icon={<Sprout size={24} color="#FB8500" />}
              title="Fertilizer Plan"
              subtitle="Optimize nutrients"
              value="Last update: 2 days ago"
              color="#FB8500"
              onPress={handleFertilizerPress}
              isLarge={true}
            />
          </View>
        </View>
        
        {/* Farm Analytics Section */}
        <View style={styles.analyticsSection}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            Farm Analytics
          </Text>
          
          <View style={styles.analyticsGrid}>
            <DashboardCard 
              icon={<Leaf size={24} color="#2EC4B6" />}
              title="Crop Health"
              subtitle="Monitor conditions"
              color="#2EC4B6"
              onPress={() => {}}
            />
            
            <DashboardCard 
              icon={<Users size={24} color="#FF9F1C" />}
              title="Labor Management"
              subtitle="Schedule & track"
              color="#FF9F1C"
              onPress={() => {}}
            />
            
            <DashboardCard 
              icon={<Camera size={24} color="#E71D36" />}
              title="Crop Scanner"
              subtitle="Disease detection"
              color="#E71D36"
              onPress={() => {}}
            />
            
            <DashboardCard 
              icon={<Zap size={24} color="#8338EC" />}
              title="Energy Usage"
              subtitle="Monitor & optimize"
              color="#8338EC"
              onPress={() => {}}
            />
          </View>
        </View>
        
        {/* About Section */}
        <View style={[styles.aboutSection, { 
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF'
        }]}>
          <View style={styles.aboutHeader}>
            <Leaf size={22} color={primaryColor} />
            <Text style={[styles.aboutTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
              About Our Mission
            </Text>
          </View>
          
          <Text style={[styles.aboutText, { 
            color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
          }]}>
            {t.additionalInfo}
          </Text>
          
          <Text style={[styles.signature, { color: primaryColor }]}>
            - TOJIN VARKEY SIMSON
          </Text>
        </View>
      </ScrollView>

      {resourceType && resourceData && (
        <ResourceRecommendation
          type={resourceType}
          data={resourceData}
          onApply={handleResourceApply}
          onClose={() => {
            setResourceType(null);
            setResourceData(null);
          }}
        />
      )}

      {/* AI Chatbot */}
      {chatbotVisible && (
        <AIChatbot onClose={() => setChatbotVisible(false)} />
      )}

      {/* Floating action button for AI Assistant */}
      {!chatbotVisible && (
        <TouchableOpacity 
          style={[styles.fabButton, { backgroundColor: primaryColor }]}
          onPress={() => setChatbotVisible(true)}
        >
          <Bot size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {loading && (
        <View style={styles.fullscreenLoader}>
          <View style={[styles.loaderContainer, { 
            backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)' 
          }]}>
            <ActivityIndicator size="large" color={primaryColor} />
            <Text style={[styles.loaderText, { 
              color: isDark ? '#FFFFFF' : '#333333' 
            }]}>
              Generating recommendations...
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  menuButton: {
    padding: 8,
    borderRadius: 12,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
  },
  farmName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  themeToggle: {
    padding: 8,
    borderRadius: 20,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  weatherCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  weatherCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  weatherCardTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  weatherCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherCardTemp: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  weatherCardCondition: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  weatherCardIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 16,
    borderRadius: 20,
  },
  loadingWeather: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  loadingWeatherText: {
    color: '#FFFFFF',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quickAccessSection: {
    marginBottom: 24,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  resourceSection: {
    marginBottom: 24,
  },
  resourceCards: {
    marginBottom: 8,
  },
  analyticsSection: {
    marginBottom: 24,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dashboardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: width / 2 - 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dashboardCardLarge: {
    width: '100%',
  },
  dashboardCardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  dashboardCardContent: {
    flex: 1,
  },
  dashboardCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dashboardCardSubtitle: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 8,
  },
  dashboardCardValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  aboutSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
  },
  signature: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#38B000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 100,
  },
  fullscreenLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loaderContainer: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
  },
});