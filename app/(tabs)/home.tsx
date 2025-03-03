import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, useColorScheme, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Droplets, Zap, Languages, Cloud } from 'lucide-react-native';
import { useLanguageStore } from '../../store/languageStore';
import { getWeatherData } from '../../lib/api/weatherApi';
import { getCropRecommendations, getIrrigationRecommendations, getFertilizerRecommendations } from '../../lib/api/agricultureApi';
import ResourceRecommendation from '../../components/ResourceRecommendation';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { language, setLanguage, translations: t } = useLanguageStore();

  const [weatherSummary, setWeatherSummary] = useState<{ temp: number; condition: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [resourceType, setResourceType] = useState<'irrigation' | 'fertilizer' | null>(null);
  const [resourceData, setResourceData] = useState<any>(null);

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

  const toggleLanguage = () => {
    setLanguage(language === 'English' ? 'Hindi' : 'English');
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }} 
            style={styles.headerImage}
          />
          <View style={styles.headerOverlay}>
            <Text style={styles.headerTitle}>{t.welcome}</Text>
            <Text style={styles.headerSubtitle}>{t.tagline}</Text>
          </View>
        </View>

        {weatherSummary && (
          <TouchableOpacity 
            style={[styles.weatherWidget, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}
          >
            <Cloud size={24} color={isDark ? '#7CFC00' : '#006400'} />
            <View style={styles.weatherInfo}>
              <Text style={[styles.weatherTemp, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                {weatherSummary.temp}°C
              </Text>
              <Text style={[styles.weatherCondition, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                {weatherSummary.condition}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}
          >
            <Camera size={24} color={isDark ? '#7CFC00' : '#006400'} />
            <Text style={[styles.actionText, { color: isDark ? '#FFFFFF' : '#000000' }]}>{t.scanCrop}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}
            onPress={handleIrrigationPress}
            disabled={loading}
          >
            <Droplets size={24} color={isDark ? '#7CFC00' : '#006400'} />
            <Text style={[styles.actionText, { color: isDark ? '#FFFFFF' : '#000000' }]}>{t.irrigation}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}
            onPress={handleFertilizerPress}
            disabled={loading}
          >
            <Zap size={24} color={isDark ? '#7CFC00' : '#006400'} />
            <Text style={[styles.actionText, { color: isDark ? '#FFFFFF' : '#000000' }]}>{t.fertilizer}</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={isDark ? '#7CFC00' : '#006400'} />
            <Text style={[styles.loadingText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Generating recommendations...
            </Text>
          </View>
        )}

        <View style={[styles.section, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}>
          <Text style={[styles.sectionText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            {t.additionalInfo}
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.languageButton, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}
          onPress={toggleLanguage}
        >
          <Languages size={20} color={isDark ? '#7CFC00' : '#006400'} />
          <Text style={[styles.languageButtonText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            {t.switchLanguage}: {language}
          </Text>
        </TouchableOpacity>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'relative',
    height: 200,
    marginBottom: 20,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 5,
  },
  weatherWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
    marginTop: 0,
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  weatherInfo: {
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherTemp: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  weatherCondition: {
    fontSize: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  actionButton: {
    width: '31%',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  section: {
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 30,
  },
  languageButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});