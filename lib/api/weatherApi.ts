import axios from 'axios';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

// OpenWeatherMap API key
const OPENWEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // Replace with your actual API key
const WEATHERAPI_KEY = 'YOUR_WEATHERAPI_KEY'; // Replace with your actual API key

// Base URLs
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const WEATHERAPI_BASE_URL = 'https://api.weatherapi.com/v1';

// Types
export interface WeatherData {
  location: string;
  currentTemp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  forecast: ForecastDay[];
  farmingTips: string[];
}

export interface ForecastDay {
  day: string;
  temp: number;
  condition: string;
  icon: string;
}

// Get current location
export const getCurrentLocation = async (): Promise<Location.LocationObject | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return null;
    }
    
    const location = await Location.getCurrentPositionAsync({});
    return location;
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};

// Get weather data from OpenWeatherMap
export const getOpenWeatherData = async (lat: number, lon: number): Promise<WeatherData | null> => {
  try {
    // Get current weather
    const currentResponse = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
      },
    });
    
    // Get 5-day forecast
    const forecastResponse = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
      },
    });
    
    const currentData = currentResponse.data;
    const forecastData = forecastResponse.data;
    
    // Process forecast data to get daily forecasts
    const dailyForecasts = processDailyForecasts(forecastData.list);
    
    // Generate farming tips based on weather conditions
    const farmingTips = generateFarmingTips(currentData, dailyForecasts);
    
    return {
      location: currentData.name + ', ' + currentData.sys.country,
      currentTemp: Math.round(currentData.main.temp),
      condition: currentData.weather[0].main,
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
      rainfall: currentData.rain ? currentData.rain['1h'] || 0 : 0,
      forecast: dailyForecasts,
      farmingTips,
    };
  } catch (error) {
    console.error('Error fetching OpenWeatherMap data:', error);
    return null;
  }
};

// Get weather data from WeatherAPI
export const getWeatherAPIData = async (lat: number, lon: number): Promise<WeatherData | null> => {
  try {
    // Get current weather and 3-day forecast
    const response = await axios.get(`${WEATHERAPI_BASE_URL}/forecast.json`, {
      params: {
        key: WEATHERAPI_KEY,
        q: `${lat},${lon}`,
        days: 5,
        aqi: 'yes',
        alerts: 'yes',
      },
    });
    
    const data = response.data;
    
    // Process forecast data
    const dailyForecasts = data.forecast.forecastday.map((day: any, index: number) => ({
      day: index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' }),
      temp: Math.round(day.day.avgtemp_c),
      condition: day.day.condition.text,
      icon: day.day.condition.icon.replace('//', 'https://'),
    }));
    
    // Generate farming tips
    const farmingTips = generateFarmingTipsFromWeatherAPI(data);
    
    return {
      location: `${data.location.name}, ${data.location.country}`,
      currentTemp: Math.round(data.current.temp_c),
      condition: data.current.condition.text,
      humidity: data.current.humidity,
      windSpeed: Math.round(data.current.wind_kph),
      rainfall: data.current.precip_mm,
      forecast: dailyForecasts,
      farmingTips,
    };
  } catch (error) {
    console.error('Error fetching WeatherAPI data:', error);
    return null;
  }
};

// Helper function to process OpenWeatherMap forecast data
const processDailyForecasts = (forecastList: any[]): ForecastDay[] => {
  const dailyData: { [key: string]: any } = {};
  
  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    if (!dailyData[day] || date.getHours() === 12) {
      dailyData[day] = {
        temp: Math.round(item.main.temp),
        condition: item.weather[0].main,
        icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
      };
    }
  });
  
  // Convert to array and limit to 5 days
  return Object.keys(dailyData).slice(0, 5).map((day, index) => ({
    day: index === 0 ? 'Today' : day,
    temp: dailyData[day].temp,
    condition: dailyData[day].condition,
    icon: dailyData[day].icon,
  }));
};

// Generate farming tips based on OpenWeatherMap data
const generateFarmingTips = (currentData: any, forecast: ForecastDay[]): string[] => {
  const tips: string[] = [];
  
  // Check for rain in the forecast
  const rainInForecast = forecast.some(day => 
    day.condition.toLowerCase().includes('rain') || 
    day.condition.toLowerCase().includes('shower')
  );
  
  // Check for high temperatures
  const highTemp = currentData.main.temp > 30;
  
  // Check for low humidity
  const lowHumidity = currentData.main.humidity < 40;
  
  // Generate tips based on conditions
  if (rainInForecast) {
    tips.push('Consider harvesting crops before the expected rainfall');
    tips.push('Ensure proper drainage in fields to prevent waterlogging');
  }
  
  if (highTemp) {
    tips.push('Increase irrigation frequency due to high temperatures');
    tips.push('Consider providing shade for sensitive crops');
  }
  
  if (lowHumidity) {
    tips.push('Monitor soil moisture levels closely in these dry conditions');
    tips.push('Consider mulching to retain soil moisture');
  }
  
  // Add general tips if we don't have enough specific ones
  if (tips.length < 3) {
    tips.push('Current weather conditions are favorable for regular farming activities');
  }
  
  return tips;
};

// Generate farming tips based on WeatherAPI data
const generateFarmingTipsFromWeatherAPI = (data: any): string[] => {
  const tips: string[] = [];
  const current = data.current;
  const forecast = data.forecast.forecastday;
  
  // Check for rain in the forecast
  const rainInForecast = forecast.some((day: any) => 
    day.day.daily_chance_of_rain > 60 || 
    day.day.totalprecip_mm > 5
  );
  
  // Check for high UV index
  const highUV = current.uv > 6;
  
  // Check for strong winds
  const strongWinds = current.wind_kph > 20;
  
  // Generate tips based on conditions
  if (rainInForecast) {
    const rainDay = forecast.find((day: any) => day.day.daily_chance_of_rain > 60);
    if (rainDay) {
      const date = new Date(rainDay.date).toLocaleDateString('en-US', { weekday: 'long' });
      tips.push(`Heavy rainfall expected on ${date}, consider adjusting irrigation schedules`);
    } else {
      tips.push('Rainfall expected in the coming days, plan harvesting accordingly');
    }
  }
  
  if (highUV) {
    tips.push('High UV levels detected, ensure workers have adequate protection');
    tips.push('Consider irrigating during early morning or evening to reduce evaporation');
  }
  
  if (strongWinds) {
    tips.push('Strong winds may affect spraying operations, plan accordingly');
    tips.push('Check supports for tall crops due to windy conditions');
  }
  
  // Add air quality based tips if available
  if (data.current.air_quality && data.current.air_quality['us-epa-index']) {
    const aqiLevel = data.current.air_quality['us-epa-index'];
    if (aqiLevel > 3) {
      tips.push('Poor air quality may affect crop pollination, monitor closely');
    }
  }
  
  // Add general tips if we don't have enough specific ones
  if (tips.length < 3) {
    tips.push('Current weather conditions are favorable for regular farming activities');
    tips.push('Ideal conditions for monitoring pest activity in crops');
  }
  
  return tips;
};

// Get weather data (tries WeatherAPI first, falls back to OpenWeatherMap)
export const getWeatherData = async (): Promise<WeatherData | null> => {
  try {
    const location = await getCurrentLocation();
    
    if (!location) {
      // Return mock data if location is not available
      return getMockWeatherData();
    }
    
    const { latitude, longitude } = location.coords;
    
    // Try WeatherAPI first
    const weatherAPIData = await getWeatherAPIData(latitude, longitude);
    if (weatherAPIData) {
      return weatherAPIData;
    }
    
    // Fall back to OpenWeatherMap
    const openWeatherData = await getOpenWeatherData(latitude, longitude);
    if (openWeatherData) {
      return openWeatherData;
    }
    
    // If both APIs fail, return mock data
    return getMockWeatherData();
  } catch (error) {
    console.error('Error getting weather data:', error);
    return getMockWeatherData();
  }
};

// Mock weather data for testing or when APIs fail
export const getMockWeatherData = (): WeatherData => {
  return {
    location: 'Pune, Maharashtra',
    currentTemp: 28,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    rainfall: 0,
    forecast: [
      { day: 'Today', temp: 28, condition: 'Partly Cloudy', icon: 'https://openweathermap.org/img/wn/02d@2x.png' },
      { day: 'Tomorrow', temp: 30, condition: 'Sunny', icon: 'https://openweathermap.org/img/wn/01d@2x.png' },
      { day: 'Wednesday', temp: 29, condition: 'Cloudy', icon: 'https://openweathermap.org/img/wn/03d@2x.png' },
      { day: 'Thursday', temp: 27, condition: 'Rain', icon: 'https://openweathermap.org/img/wn/10d@2x.png' },
      { day: 'Friday', temp: 26, condition: 'Rain', icon: 'https://openweathermap.org/img/wn/10d@2x.png' },
    ],
    farmingTips: [
      'Consider harvesting crops before Thursday due to expected rainfall',
      'Ideal conditions for spraying pesticides tomorrow',
      'Soil moisture levels expected to increase by end of week'
    ]
  };
};