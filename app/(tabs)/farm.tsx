import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../../store/themeStore';
import { useLanguageStore } from '../../store/languageStore';
import {
  Cloud,
  Droplets,
  Sun,
  Wind,
  Thermometer,
  Sprout,
  Calendar,
  ChevronRight,
  RefreshCw,
  Bell,
  AlertTriangle,
  Leaf,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// Define interfaces for the data types
interface CropDetails {
  soilType: string;
  waterNeeds: string;
  sunExposure: string;
  plantingDate: string;
  expectedYield: string;
  description: string;
}

interface Crop {
  id: string;
  name: string;
  variety: string;
  status: string;
  health: string;
  daysToHarvest: number;
  image: string;
  progress: number;
  details: CropDetails;
}

interface WeatherForecast {
  day: string;
  temp: number;
  icon: string;
}

interface Weather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  forecast: WeatherForecast[];
}

interface Alert {
  id: string;
  title: string;
  message: string;
  time: string;
  type: string;
}

// Update the crops array type
const crops: Crop[] = [
  {
    id: '1',
    name: 'Maize (Corn)',
    variety: 'Hybrid 614',
    status: 'Growing',
    health: 'Excellent',
    daysToHarvest: 70,
    image: 'https://media.istockphoto.com/id/1150439636/photo/the-corn-plant-in-the-field.jpg?s=612x612&w=0&k=20&c=s74ght8V9pbvIRmdO4tzOZj5QKTV2d1Hl2SeTJyiyO4=',
    progress: 65,
    details: {
      soilType: 'Loamy',
      waterNeeds: 'Medium',
      sunExposure: 'Full sun',
      plantingDate: '2023-03-15',
      expectedYield: '8-10 tons/hectare',
      description: 'Maize is one of the most versatile emerging crops having wider adaptability. Globally, maize is known as queen of cereals because of its highest genetic yield potential.'
    }
  },
  {
    id: '2',
    name: 'Barley',
    variety: 'Six-row',
    status: 'Growing',
    health: 'Good',
    daysToHarvest: 45,
    image: 'https://i.pinimg.com/736x/d0/38/8a/d0388a1516f2c391d905c370086a355b.jpg',
    progress: 75,
    details: {
      soilType: 'Well-drained',
      waterNeeds: 'Low to Medium',
      sunExposure: 'Full sun',
      plantingDate: '2023-02-20',
      expectedYield: '3-5 tons/hectare',
      description: 'Barley is a widely adaptable cereal grain that is drought and salt tolerant. It is an excellent crop for sustainable agriculture with high nutritional value.'
    }
  },
  {
    id: '3',
    name: 'Soybeans',
    variety: 'Round-up ready',
    status: 'Growing',
    health: 'Good',
    daysToHarvest: 90,
    image: 'https://c4.wallpaperflare.com/wallpaper/1023/102/576/field-fog-dawn-morning-wallpaper-preview.jpg',
    progress: 50,
    details: {
      soilType: 'Clay or loam',
      waterNeeds: 'Medium',
      sunExposure: 'Full sun',
      plantingDate: '2023-04-05',
      expectedYield: '2-4 tons/hectare',
      description: 'Soybeans are legumes that enrich the soil with nitrogen. They are a great source of protein and are increasingly important for both human consumption and animal feed.'
    }
  },
  {
    id: '4',
    name: 'Potatoes',
    variety: 'Russet',
    status: 'Growing',
    health: 'Excellent',
    daysToHarvest: 110,
    image: 'https://t4.ftcdn.net/jpg/02/75/77/89/360_F_275778955_xxJe5fQvDy5oXbjupdJ162zLwU4sf3kT.jpg',
    progress: 40,
    details: {
      soilType: 'Loose, sandy loam',
      waterNeeds: 'Medium to High',
      sunExposure: 'Full sun',
      plantingDate: '2023-03-30',
      expectedYield: '25-35 tons/hectare',
      description: 'Potatoes are the world\'s fourth-largest food crop. They are relatively easy to grow and provide excellent nutrition, being high in potassium and vitamin C.'
    }
  },
  {
    id: '5',
    name: 'Wheat',
    variety: 'Hard Red Winter',
    status: 'Growing',
    health: 'Good',
    daysToHarvest: 60,
    image: 'https://media.istockphoto.com/id/1176331920/photo/wheat-field-at-sunset-spikes-close-up-view.jpg?s=612x612&w=0&k=20&c=ckGKw9TkMIg4A0RmYYGBnIR6A7cDA_BMgGUqiohJD8s=',
    progress: 70,
    details: {
      soilType: 'Loam',
      waterNeeds: 'Low to Medium',
      sunExposure: 'Full sun',
      plantingDate: '2023-01-15',
      expectedYield: '3-5 tons/hectare',
      description: 'Wheat is a grass widely cultivated for its seed, a cereal grain that is a worldwide staple food. It\'s one of the most important crops globally.'
    }
  },
  {
    id: '6',
    name: 'Rice',
    variety: 'Jasmine',
    status: 'Growing',
    health: 'Excellent',
    daysToHarvest: 120,
    image: 'https://media.istockphoto.com/id/1255331533/photo/beautiful-landscape-view-of-rice-fields-unshelled-rice-or-paddy-in-autumn-in-rural-areas-of.jpg?s=612x612&w=0&k=20&c=AqbWptl-2q7L4pFYYN9yaR-OvZi01LweZaVQZyBELn4=',
    progress: 60,
    details: {
      soilType: 'Clay',
      waterNeeds: 'High',
      sunExposure: 'Full sun',
      plantingDate: '2023-03-01',
      expectedYield: '4-6 tons/hectare',
      description: 'Rice is the staple food for over half of the world\'s population. It is highly water-intensive but can be grown in a wide range of environments.'
    }
  },
  {
    id: '7',
    name: 'Sunflower',
    variety: 'Black Oil',
    status: 'Growing',
    health: 'Good',
    daysToHarvest: 80,
    image: 'https://media.istockphoto.com/id/1257951336/photo/summer-landscape-sunflower-field-at-sunset.jpg?s=612x612&w=0&k=20&c=YIxnT1yhPbpZNeJ4eL6p_G0iyibZh3cLAGcnCfT7WaA=',
    progress: 55,
    details: {
      soilType: 'Well-drained',
      waterNeeds: 'Low to Medium',
      sunExposure: 'Full sun',
      plantingDate: '2023-04-10',
      expectedYield: '1-2 tons/hectare',
      description: 'Sunflowers are not only beautiful but also valuable for their seeds and oil. They are relatively drought-tolerant and can thrive in various climates.'
    }
  },
  {
    id: '8',
    name: 'Cotton',
    variety: 'Upland',
    status: 'Growing',
    health: 'Good',
    daysToHarvest: 150,
    image: 'https://media.istockphoto.com/id/525208277/photo/cotton-field.jpg?s=612x612&w=0&k=20&c=9U7rALM0deY_HAAOUmVH-mVfNB2cVRbP1oOQtcJLXlc=',
    progress: 30,
    details: {
      soilType: 'Loam to clay',
      waterNeeds: 'Medium',
      sunExposure: 'Full sun',
      plantingDate: '2023-04-15',
      expectedYield: '2-3 bales/acre',
      description: 'Cotton is one of the world\'s most important fiber crops. It\'s also a significant oilseed crop, with cottonseed oil being extracted from the seeds.'
    }
  },
  {
    id: '9',
    name: 'Sugarcane',
    variety: 'CP 96-1252',
    status: 'Growing',
    health: 'Excellent',
    daysToHarvest: 300,
    image: 'https://media.istockphoto.com/id/1423776516/photo/sugarcane-field-with-blue-sky-sugarcane-plantation-in-the-countryside-sugarcane-is-a-raw.jpg?s=612x612&w=0&k=20&c=0kOwXpTwWe4MSJvZRV-nbzfDHVNtmxP7WqUg88_Zpdk=',
    progress: 25,
    details: {
      soilType: 'Well-drained fertile soil',
      waterNeeds: 'High',
      sunExposure: 'Full sun',
      plantingDate: '2023-02-01',
      expectedYield: '60-100 tons/hectare',
      description: 'Sugarcane is a tropical, perennial grass that forms lateral shoots at the base to produce multiple stems. It is the world\'s largest crop by production quantity and is the main source of sugar.'
    }
  },
  {
    id: '10',
    name: 'Cassava',
    variety: 'TME 419',
    status: 'Growing',
    health: 'Good',
    daysToHarvest: 365,
    image: 'https://media.istockphoto.com/id/842160112/photo/cassava-field-at-thailand.jpg?s=612x612&w=0&k=20&c=HMDohc92m1A5qxcm3zYDpexP0lI4S-NfxdXc0FRdVCI=',
    progress: 20,
    details: {
      soilType: 'Sandy loam',
      waterNeeds: 'Low',
      sunExposure: 'Full sun',
      plantingDate: '2023-01-20',
      expectedYield: '20-30 tons/hectare',
      description: 'Cassava is a drought-tolerant crop that provides a basic diet for around 800 million people worldwide. It\'s valued for its starchy roots and can grow in poor soil conditions.'
    }
  }
];

// Update weather data type
const weatherData: Weather = {
  temperature: 24,
  humidity: 65,
  windSpeed: 10,
  precipitation: 20,
  forecast: [
    { day: 'Today', temp: 24, icon: 'sun' },
    { day: 'Thu', temp: 26, icon: 'sun' },
    { day: 'Fri', temp: 23, icon: 'cloud' },
    { day: 'Sat', temp: 22, icon: 'cloud-rain' },
    { day: 'Sun', temp: 25, icon: 'sun' },
  ],
};

// Update alerts type
const alerts: Alert[] = [
  {
    id: '1',
    title: 'Water tomatoes',
    message: 'Soil moisture is low in tomato bed',
    time: '2 hours ago',
    type: 'water',
  },
  {
    id: '2',
    title: 'Pest detected',
    message: 'Aphids detected on bean plants',
    time: '5 hours ago',
    type: 'pest',
  },
];

// Add a proper interface for the CropDetailView props
interface CropDetailViewProps {
  crop: (typeof crops)[0]; // Using the existing crops array type
  onClose: () => void;
  isDark: boolean;
}

// Update the CropDetailView component to use translations properly
const CropDetailView: React.FC<CropDetailViewProps> = ({ crop, onClose, isDark }) => {
  const { translations: t } = useLanguageStore();
  
  return (
    <View style={[styles.cropDetailContainer, {
      backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
    }]}>
      <Image source={{ uri: crop.image }} style={styles.cropDetailImage} />
      
      <ScrollView style={styles.cropDetailScrollView}>
        <View style={styles.cropDetailHeader}>
          <Text style={[styles.cropDetailName, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            {crop.name}
          </Text>
          <Text style={[styles.cropDetailVariety, { color: isDark ? '#BBBBBB' : '#666666' }]}>
            {crop.variety}
          </Text>
        </View>
        
        <View style={styles.cropDetailSection}>
          <Text style={[styles.cropDetailSectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            {t.status || "Status"}
          </Text>
          <View style={styles.cropDetailInfo}>
            <View style={styles.cropDetailInfoItem}>
              <Text style={[styles.cropDetailInfoLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                {t.status}:
              </Text>
              <Text style={[styles.cropDetailInfoValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                {crop.status}
              </Text>
            </View>
            <View style={styles.cropDetailInfoItem}>
              <Text style={[styles.cropDetailInfoLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                {t.health}:
              </Text>
              <Text style={[styles.cropDetailInfoValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                {crop.health}
              </Text>
            </View>
            <View style={styles.cropDetailInfoItem}>
              <Text style={[styles.cropDetailInfoLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                {t.daysToHarvest}:
              </Text>
              <Text style={[styles.cropDetailInfoValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                {crop.daysToHarvest} {t.toHarvest}
              </Text>
            </View>
            <View style={styles.cropDetailInfoItem}>
              <Text style={[styles.cropDetailInfoLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                {t.progress}:
              </Text>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { 
                      width: `${crop.progress}%`,
                      backgroundColor: '#38B000' 
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.progressText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                {crop.progress}%
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.cropDetailSection}>
          <Text style={[styles.cropDetailSectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            {t.growingConditions || "Growing Conditions"}
          </Text>
          <View style={styles.cropDetailInfo}>
            <View style={styles.cropDetailInfoItem}>
              <Text style={[styles.cropDetailInfoLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                {t.soilType}:
              </Text>
              <Text style={[styles.cropDetailInfoValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                {crop.details.soilType}
              </Text>
            </View>
            <View style={styles.cropDetailInfoItem}>
              <Text style={[styles.cropDetailInfoLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                {t.waterNeeds || "Water Needs"}:
              </Text>
              <Text style={[styles.cropDetailInfoValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                {crop.details.waterNeeds}
              </Text>
            </View>
            <View style={styles.cropDetailInfoItem}>
              <Text style={[styles.cropDetailInfoLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                {t.sunExposure || "Sun Exposure"}:
              </Text>
              <Text style={[styles.cropDetailInfoValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                {crop.details.sunExposure}
              </Text>
            </View>
            <View style={styles.cropDetailInfoItem}>
              <Text style={[styles.cropDetailInfoLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                {t.plantingDate || "Planting Date"}:
              </Text>
              <Text style={[styles.cropDetailInfoValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                {crop.details.plantingDate}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.cropDetailSection}>
          <Text style={[styles.cropDetailSectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            {t.description || "Description"}
          </Text>
          <Text style={[styles.cropDetailDescription, { color: isDark ? '#DDDDDD' : '#444444' }]}>
            {crop.details.description}
          </Text>
        </View>
        
        <View style={styles.cropDetailSection}>
          <Text style={[styles.cropDetailSectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            {t.expectedYield || "Expected Yield"}
          </Text>
          <Text style={[styles.cropDetailYield, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            {crop.details.expectedYield}
          </Text>
        </View>
      </ScrollView>
      
      <TouchableOpacity 
        style={[styles.cropDetailCloseButton, { backgroundColor: '#38B000' }]}
        onPress={onClose}
      >
        <Text style={styles.cropDetailCloseButtonText}>{t.close || "Close"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function FarmScreen() {
  const { isDark, primaryColor } = useThemeStore();
  const { translations: t, language, initializeLanguage } = useLanguageStore();
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showCropDetails, setShowCropDetails] = useState(false);

  // Initialize language when component mounts if needed
  useEffect(() => {
    const ensureLanguageInitialized = async () => {
      if (!language) {
        await initializeLanguage();
      }
    };
    
    ensureLanguageInitialized();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleCropPress = (crop: Crop) => {
    setSelectedCrop(crop);
    setShowCropDetails(true);
  };

  const handleCloseCropDetails = () => {
    setShowCropDetails(false);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F7FA' }]}
      edges={['right', 'left']}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
          {t.farmDetails || "My Farm"}
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Weather Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <LinearGradient
            colors={isDark ? ['#0F3440', '#01161E'] : ['#E0F7FA', '#B2EBF2']}
            style={styles.weatherCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.weatherHeader}>
              <Text style={styles.weatherTitle}>{t.weather || "Weather"}</Text>
              <Text style={styles.weatherCondition}>{t.sunny || "Sunny"}</Text>
              <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
                <RefreshCw
                  size={18}
                  color="#FFFFFF"
                  style={{ opacity: refreshing ? 0.5 : 1 }}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.weatherMain}>
              <View style={styles.weatherTempContainer}>
                <Text style={styles.weatherTemp}>{weatherData.temperature}°C</Text>
              </View>

              <View style={styles.weatherDetailsContainer}>
                <View style={styles.weatherDetail}>
                  <Droplets size={18} color="#FFFFFF" />
                  <Text style={styles.weatherDetailText}>
                    {weatherData.humidity}%
                  </Text>
                </View>
                <View style={styles.weatherDetail}>
                  <Wind size={18} color="#FFFFFF" />
                  <Text style={styles.weatherDetailText}>
                    {weatherData.windSpeed} km/h
                  </Text>
                </View>
                <View style={styles.weatherDetail}>
                  <Cloud size={18} color="#FFFFFF" />
                  <Text style={styles.weatherDetailText}>
                    {weatherData.precipitation}%
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.forecast}>
              {weatherData.forecast.map((day, index) => (
                <View key={index} style={styles.forecastDay}>
                  <Text style={styles.forecastDayText}>{day.day}</Text>
                  <Sun size={20} color="#FFFFFF" />
                  <Text style={styles.forecastTemp}>{day.temp}°</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? '#FFFFFF' : '#333333' },
            ]}
          >
            {t.crops || "My Crops"}
          </Text>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text
              style={[
                styles.seeAllText,
                { color: isDark ? '#38B000' : '#38B000' },
              ]}
            >
              {t.seeAll || "See All"}
            </Text>
            <ChevronRight
              size={16}
              color={isDark ? '#38B000' : '#38B000'}
            />
          </TouchableOpacity>
        </View>

        {/* Crops List */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cropsContainer}
        >
          {crops.map((crop, index) => (
            <Animated.View
              key={crop.id}
              entering={FadeInRight.delay(100 * index).duration(400)}
            >
              <TouchableOpacity
                style={[
                  styles.cropCard,
                  {
                    backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
                  },
                ]}
                onPress={() => handleCropPress(crop)}
              >
                <Image source={{ uri: crop.image }} style={styles.cropImage} />
                <View style={styles.cropInfo}>
                  <Text
                    style={[
                      styles.cropName,
                      { color: isDark ? '#FFFFFF' : '#333333' },
                    ]}
                  >
                    {crop.name}
                  </Text>
                  <Text
                    style={[
                      styles.cropVariety,
                      { color: isDark ? '#BBBBBB' : '#666666' },
                    ]}
                  >
                    {crop.variety}
                  </Text>

                  <View style={styles.cropMetrics}>
                    <View style={styles.cropMetric}>
                      <Thermometer size={14} color="#38B000" />
                      <Text
                        style={[
                          styles.cropMetricText,
                          { color: isDark ? '#DDDDDD' : '#555555' },
                        ]}
                      >
                        {crop.health}
                      </Text>
                    </View>
                    <View style={styles.cropMetric}>
                      <Calendar size={14} color="#38B000" />
                      <Text
                        style={[
                          styles.cropMetricText,
                          { color: isDark ? '#DDDDDD' : '#555555' },
                        ]}
                      >
                        {crop.daysToHarvest} days
                      </Text>
                    </View>
                  </View>

                  <View style={styles.progressContainer}>
                    <View
                      style={[
                        styles.progressBackground,
                        { backgroundColor: isDark ? '#333333' : '#EEEEEE' },
                      ]}
                    >
                      <View
                        style={[
                          styles.progressBar,
                          { width: `${crop.progress}%` },
                        ]}
                      />
                    </View>
                    <Text
                      style={[
                        styles.progressText,
                        { color: isDark ? '#BBBBBB' : '#888888' },
                      ]}
                    >
                      {crop.progress}% to harvest
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Alerts Section */}
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? '#FFFFFF' : '#333333' },
            ]}
          >
            {t.recentNotifications || "Recent Alerts"}
          </Text>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text
              style={[
                styles.seeAllText,
                { color: isDark ? '#38B000' : '#38B000' },
              ]}
            >
              {t.seeAll || "See All"}
            </Text>
            <ChevronRight
              size={16}
              color={isDark ? '#38B000' : '#38B000'}
            />
          </TouchableOpacity>
        </View>

        {alerts.map((alert, index) => (
          <Animated.View 
            key={alert.id}
            entering={FadeInDown.delay(100 * index).duration(400)}
          >
            <TouchableOpacity
              style={[
                styles.alertCard,
                { backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF' },
              ]}
            >
              <View 
                style={[
                  styles.alertIconContainer,
                  { 
                    backgroundColor: alert.type === 'water' 
                      ? 'rgba(67, 97, 238, 0.1)' 
                      : 'rgba(255, 107, 107, 0.1)'
                  }
                ]}
              >
                {alert.type === 'water' ? (
                  <Droplets 
                    size={20} 
                    color="#4361EE" 
                  />
                ) : (
                  <AlertTriangle 
                    size={20} 
                    color="#FF6B6B" 
                  />
                )}
              </View>
              <View style={styles.alertContent}>
                <Text
                  style={[
                    styles.alertTitle,
                    { color: isDark ? '#FFFFFF' : '#333333' },
                  ]}
                >
                  {alert.title}
                </Text>
                <Text
                  style={[
                    styles.alertMessage,
                    { color: isDark ? '#BBBBBB' : '#666666' },
                  ]}
                >
                  {alert.message}
                </Text>
                <Text
                  style={[
                    styles.alertTime,
                    { color: isDark ? '#888888' : '#999999' },
                  ]}
                >
                  {alert.time}
                </Text>
              </View>
              <TouchableOpacity style={styles.alertAction}>
                <ChevronRight
                  size={20}
                  color={isDark ? '#666666' : '#BBBBBB'}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* Farm Statistics */}
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? '#FFFFFF' : '#333333' },
            ]}
          >
            {t.farmStatistics || "Farm Statistics"}
          </Text>
        </View>

        <Animated.View 
          entering={FadeInDown.delay(300).duration(500)}
          style={styles.statsGrid}
        >
          <View 
            style={[
              styles.statCard, 
              { backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF' }
            ]}
          >
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(56, 176, 0, 0.1)' }]}>
              <Leaf size={20} color="#38B000" />
            </View>
            <Text style={[styles.statValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>3</Text>
            <Text style={[styles.statLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>{t.crops || "Crops"}</Text>
          </View>
          
          <View 
            style={[
              styles.statCard, 
              { backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF' }
            ]}
          >
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(67, 97, 238, 0.1)' }]}>
              <Droplets size={20} color="#4361EE" />
            </View>
            <Text style={[styles.statValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>120L</Text>
            <Text style={[styles.statLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>{t.waterUsed || "Water Used"}</Text>
          </View>
          
          <View 
            style={[
              styles.statCard, 
              { backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF' }
            ]}
          >
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(247, 37, 133, 0.1)' }]}>
              <Sprout size={20} color="#F72585" />
            </View>
            <Text style={[styles.statValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>2kg</Text>
            <Text style={[styles.statLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>{t.seeds || "Seeds"}</Text>
          </View>
          
          <View 
            style={[
              styles.statCard, 
              { backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF' }
            ]}
          >
            <View style={[styles.statIconContainer, { backgroundColor: 'rgba(255, 156, 0, 0.1)' }]}>
              <Sun size={20} color="#FF9C00" />
            </View>
            <Text style={[styles.statValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>24°C</Text>
            <Text style={[styles.statLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>{t.avgTemp || "Avg Temp"}</Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Crop Detail View */}
      {showCropDetails && selectedCrop && (
        <CropDetailView
          crop={selectedCrop}
          onClose={handleCloseCropDetails}
          isDark={isDark}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  weatherCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherTempContainer: {
    flexDirection: 'column',
  },
  weatherTemp: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  weatherCondition: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  weatherDetailsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  weatherDetailText: {
    marginLeft: 8,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  forecast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
  },
  forecastDay: {
    alignItems: 'center',
  },
  forecastDayText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    marginRight: 4,
  },
  cropsContainer: {
    paddingRight: 16,
  },
  cropCard: {
    width: width * 0.7,
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cropImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  cropInfo: {
    padding: 12,
  },
  cropName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cropVariety: {
    fontSize: 14,
    marginBottom: 8,
  },
  cropMetrics: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  cropMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  cropMetricText: {
    fontSize: 12,
    marginLeft: 4,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBackground: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#38B000',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
  },
  alertCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
  },
  alertAction: {
    alignSelf: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  cropDetailContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
  },
  cropDetailImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cropDetailScrollView: {
    flex: 1,
    padding: 20,
  },
  cropDetailHeader: {
    marginBottom: 20,
  },
  cropDetailName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cropDetailVariety: {
    fontSize: 16,
    marginBottom: 16,
  },
  cropDetailSection: {
    marginBottom: 24,
  },
  cropDetailSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  cropDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cropDetailItem: {
    width: '48%',
  },
  cropDetailIcon: {
    marginBottom: 4,
  },
  cropDetailLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  cropDetailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  cropDetailDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  cropDetailYield: {
    fontSize: 16,
    fontWeight: '500',
  },
  cropDetailCloseButton: {
    padding: 16,
    alignItems: 'center',
  },
  cropDetailCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    padding: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cropDetailInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cropDetailInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cropDetailInfoLabel: {
    fontSize: 14,
    marginRight: 4,
  },
  cropDetailInfoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  progressBarContainer: {
    width: 100,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EEEEEE',
    overflow: 'hidden',
  },
}); 