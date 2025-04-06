import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, useColorScheme, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Cloud, Droplets, Wind, Thermometer, Sun, RefreshCw, Umbrella, CloudRain } from 'lucide-react-native';
import { useLanguageStore } from '../../store/languageStore';
import { getWeatherData, WeatherData } from '../../lib/api/weatherApi';
import { LinearGradient } from 'expo-linear-gradient';

export default function WeatherScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { translations: t } = useLanguageStore();
  
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWeatherData();
      setWeatherData(data);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to load weather data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Weather card component with improved design
  const WeatherDetailCard = ({ icon, value, label, color }) => (
    <View style={[styles.detailCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        {icon}
      </View>
      <Text style={[styles.detailValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>{value}</Text>
      <Text style={[styles.detailLabel, { color: isDark ? '#AAAAAA' : '#777777' }]}>{label}</Text>
    </View>
  );

  // Forecast day component
  const ForecastDay = ({ day, temp, condition, icon }) => (
    <View style={[styles.forecastDay, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
      <Text style={[styles.forecastDayText, { color: isDark ? '#FFFFFF' : '#333333' }]}>{day}</Text>
      {icon}
      <Text style={[styles.forecastTemp, { color: isDark ? '#FFFFFF' : '#333333' }]}>{temp}°C</Text>
      <Text style={[styles.forecastCondition, { color: isDark ? '#AAAAAA' : '#777777' }]}>{condition}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F9FA' }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDark ? '#7CFC00' : '#4CAF50'} />
          <Text style={[styles.loadingText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            Loading weather data...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F9FA' }]}>
        <View style={styles.errorContainer}>
          <Cloud size={50} color="#FF5252" />
          <Text style={[styles.errorText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            {error}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchWeatherData}>
            <RefreshCw size={18} color="#FFFFFF" />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F9FA' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={isDark ? ['#0F3443', '#34E89E'] : ['#56ab2f', '#a8e063']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.mainWeather}>
            <View>
              <Text style={styles.location}>
                {weatherData?.location || 'Unknown Location'}
              </Text>
              <Text style={styles.date}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </Text>
            </View>
            
            <View style={styles.temperatureContainer}>
              <Text style={styles.temperature}>
                {weatherData?.currentTemp || '--'}°C
              </Text>
              <Text style={styles.condition}>
                {weatherData?.condition || 'Unknown'}
              </Text>
            </View>
          </View>
          
          <View style={styles.developerTag}>
            <Text style={styles.developerText}>TOJIN VARKEY SIMSON</Text>
          </View>
        </LinearGradient>

        <View style={styles.detailsSection}>
          <View style={styles.detailsRow}>
            <WeatherDetailCard 
              icon={<Droplets size={24} color="#4FC3F7" />} 
              value={`${weatherData?.humidity || '--'}%`} 
              label={t.humidity}
              color="#4FC3F7"
            />
            
            <WeatherDetailCard 
              icon={<Wind size={24} color="#FFD54F" />} 
              value={`${weatherData?.windSpeed || '--'} km/h`} 
              label={t.wind}
              color="#FFD54F"
            />
            
            <WeatherDetailCard 
              icon={<CloudRain size={24} color="#81C784" />} 
              value={`${weatherData?.rainfall || '0'} mm`} 
              label={t.rain}
              color="#81C784"
            />
          </View>
        </View>

        <View style={styles.forecastSection}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            {t.forecast}
          </Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastScroll}>
            <ForecastDay 
              day="Mon" 
              temp="28" 
              condition="Sunny" 
              icon={<Sun size={24} color="#FFD54F" />} 
            />
            <ForecastDay 
              day="Tue" 
              temp="26" 
              condition="Cloudy" 
              icon={<Cloud size={24} color="#90A4AE" />} 
            />
            <ForecastDay 
              day="Wed" 
              temp="25" 
              condition="Rain" 
              icon={<CloudRain size={24} color="#4FC3F7" />} 
            />
            <ForecastDay 
              day="Thu" 
              temp="27" 
              condition="Sunny" 
              icon={<Sun size={24} color="#FFD54F" />} 
            />
            <ForecastDay 
              day="Fri" 
              temp="29" 
              condition="Partly Cloudy" 
              icon={<Cloud size={24} color="#B0BEC5" />} 
            />
          </ScrollView>
        </View>

        <View style={[styles.recommendationsCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <Text style={[styles.recommendationsTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            {t.farmingRecommendations}
          </Text>
          
          <Text style={[styles.recommendationText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
            • Perfect day for planting due to moderate humidity levels.
            {'\n'}• Consider irrigating crops early morning to avoid water loss.
            {'\n'}• Watch for increased pest activity with rising temperatures.
            {'\n'}• Ventilate greenhouses during peak afternoon heat.
          </Text>
          
          <Text style={[styles.creditText, { color: isDark ? '#7CFC00' : '#4CAF50' }]}>
            - TOJIN VARKEY SIMSON
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
  },
  mainWeather: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  location: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  temperatureContainer: {
    alignItems: 'flex-end',
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  condition: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  developerTag: {
    position: 'absolute',
    bottom: 10,
    right: 20,
  },
  developerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  detailsSection: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailCard: {
    width: '31%',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 12,
  },
  forecastSection: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  forecastScroll: {
    paddingBottom: 15,
  },
  forecastDay: {
    width: 100,
    padding: 15,
    marginRight: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  forecastDayText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  forecastCondition: {
    fontSize: 12,
  },
  recommendationsCard: {
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 24,
  },
  creditText: {
    marginTop: 15,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});