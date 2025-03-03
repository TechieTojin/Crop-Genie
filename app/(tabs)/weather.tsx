import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, useColorScheme, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Cloud, Droplets, Wind, Thermometer, Sun } from 'lucide-react-native';
import { useLanguageStore } from '../../store/languageStore';
import { getWeatherData, WeatherData } from '../../lib/api/weatherApi';

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

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDark ? '#7CFC00' : '#006400'} />
          <Text style={[styles.loadingText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            Loading weather data...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
        <View style={styles.errorContainer}>
          <Cloud size={50} color={isDark ? '#FF6B6B' : '#FF6B6B'} />
          <Text style={[styles.errorText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            {error}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.currentWeather, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}>
          <Text style={[styles.location, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            {weatherData?.location || 'Unknown Location'}
          </Text>
          <View style={styles.tempContainer}>
            <Text style={[styles.temperature, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              {weatherData?.currentTemp || '--'}°C
            </Text>
            <Text style={[styles.condition, { color: isDark ? '#BBBBBB' : '#666666' }]}>
              {weatherData?.condition || 'Unknown'}
            </Text>
          </View>
          
          <View style={styles.weatherDetails}>
            <View style={styles.weatherDetail}>
              <Droplets size={20} color={isDark ? '#7CFC00' : '#006400'} />
              <Text style={[styles.detailText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                {weatherData?.humidity || '--'}%
              </Text>
              <Text style={[styles.detailLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>{t.humidity}</Text>
            </View>
            
            <View style={styles.weatherDetail}>
              <Wind size={20} color={isDark ? '#7CFC00' : '#006400'} />
              <Text style={[styles.detailText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                {weatherData?.windSpeed || '--'} km/h
              </Text>
              <Text style={[styles.detailLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>{t.wind}</Text>
            </View>
            
            <View style={styles.weatherDetail}>
              <Cloud size={20} color={isDark ? '#7CFC00' : '#006400'} />
              <Text style={[styles.detailText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                {weatherData?.rainfall || '0'} mm
              </Text>
              <Text style={[styles.detailLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>{t.rain}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>{t.forecast}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastContainer}>
            {weatherData?.forecast.map((day, index) => (
              <View key={index} style={styles.forecastDay}>
                <Text style={[styles.forecastDayText, { color: isDark ? '#FFFFFF' : '#000000' }]}>{day.day}</Text>
                <Image source={{ uri: day.icon }} style={styles.forecastIcon} />
                <Text style={[styles.forecastTemp, { color: isDark ? '#FFFFFF' : '#000000' }]}>{day.temp}°C</Text>
                <Text style={[styles.forecastCondition, { color: isDark ? '#BBBBBB' : '#666666' }]}>{day.condition}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.section, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>{t.farmingRecommendations}</Text>
          {weatherData?.farmingTips.map((tip, index) => (
            <View key={index} style={[styles.tipItem, { borderBottomColor: isDark ? '#444444' : '#EEEEEE' }]}>
              <Sun size={20} color={isDark ? '#7CFC00' : '#006400'} />
              <Text style={[styles.tipText, { color: isDark ? '#FFFFFF' : '#000000' }]}>{tip}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  currentWeather: {
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  location: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tempContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  condition: {
    fontSize: 18,
    marginTop: 5,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  weatherDetail: {
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 5,
  },
  detailLabel: {
    fontSize: 12,
    marginTop: 2,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  forecastContainer: {
    flexDirection: 'row',
  },
  forecastDay: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  forecastDayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  forecastIcon: {
    width: 50,
    height: 50,
    marginVertical: 5,
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  forecastCondition: {
    fontSize: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  tipText: {
    marginLeft: 10,
    fontSize: 14,
    flex: 1,
  },
});