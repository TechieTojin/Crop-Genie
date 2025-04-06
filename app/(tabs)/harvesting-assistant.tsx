import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../../store/themeStore';
import { 
  Scissors, 
  CalendarClock, 
  CloudSun, 
  Thermometer, 
  Droplets, 
  MapPin,
  Check,
  X,
  AlertCircle,
  Clock,
  ArrowRight,
  Camera,
  Upload,
  CloudRain,
  CloudLightning
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Sample crop data
const crops = [
  {
    id: 1,
    name: 'Rice',
    variety: 'Basmati',
    status: 'readySoon',
    estimatedHarvest: '12-15 days',
    plantedDate: 'February 10, 2023',
    currentAge: '95 days',
    maturityWindow: '110-120 days',
    optimalConditions: {
      moisture: '20-25%',
      weather: 'Sunny, low humidity',
      temperature: '25-30°C'
    },
    fieldLocation: 'North Field',
    image: 'https://images.unsplash.com/photo-1594661605629-1f47e3efd636?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 2,
    name: 'Tomato',
    variety: 'Roma',
    status: 'ready',
    estimatedHarvest: 'Ready now',
    plantedDate: 'March 5, 2023',
    currentAge: '75 days',
    maturityWindow: '70-80 days',
    optimalConditions: {
      moisture: '60-70%',
      weather: 'Mild, no rain',
      temperature: '20-25°C'
    },
    fieldLocation: 'East Field',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 3,
    name: 'Wheat',
    variety: 'Durum',
    status: 'notReady',
    estimatedHarvest: '25-30 days',
    plantedDate: 'January 15, 2023',
    currentAge: '110 days',
    maturityWindow: '135-145 days',
    optimalConditions: {
      moisture: '12-14%',
      weather: 'Dry, low humidity',
      temperature: '22-28°C'
    },
    fieldLocation: 'West Field',
    image: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  }
];

// Sample weather forecast
const forecast = [
  { day: 'Today', temp: 28, condition: 'Sunny', icon: 'CloudSun' },
  { day: 'Tomorrow', temp: 29, condition: 'Partly Cloudy', icon: 'CloudSun' },
  { day: 'Wed', temp: 30, condition: 'Sunny', icon: 'CloudSun' },
  { day: 'Thu', temp: 26, condition: 'Rain', icon: 'CloudRain' },
  { day: 'Fri', temp: 25, condition: 'Thunderstorm', icon: 'CloudLightning' }
];

export default function HarvestingAssistantScreen() {
  const { isDark } = useThemeStore();
  const [selectedCrop, setSelectedCrop] = useState<number | null>(null);
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ready':
        return '#38B000';
      case 'readySoon':
        return '#FFBB38';
      case 'notReady':
        return '#FF7B67';
      default:
        return '#AAAAAA';
    }
  };
  
  const getStatusText = (status: string) => {
    switch(status) {
      case 'ready':
        return 'Ready to Harvest';
      case 'readySoon':
        return 'Ready Soon';
      case 'notReady':
        return 'Not Ready Yet';
      default:
        return 'Status Unknown';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'ready':
        return <Check size={14} color="#FFFFFF" />;
      case 'readySoon':
        return <AlertCircle size={14} color="#FFFFFF" />;
      case 'notReady':
        return <X size={14} color="#FFFFFF" />;
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}
      edges={['right', 'left']}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
              Harvest Assistant
            </Text>
            <Text style={[styles.headerSubtitle, { color: isDark ? '#AAAAAA' : '#666666' }]}>
              AI-powered optimal timing
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.cameraButton, 
              { backgroundColor: '#38B000' }
            ]}
          >
            <Camera size={20} color="#FFFFFF" />
            <Text style={styles.cameraButtonText}>Scan Crop</Text>
          </TouchableOpacity>
        </View>
        
        <LinearGradient
          colors={isDark ? ['#1A2421', '#0F3123'] : ['#E9F5E1', '#F8FFEF']}
          style={styles.forecastCard}
        >
          <View style={styles.forecastHeader}>
            <CloudSun size={24} color="#FFFFFF" />
            <Text style={styles.forecastTitle}>5-Day Weather Forecast</Text>
          </View>
          
          <View style={styles.forecastContent}>
            {forecast.map((day, index) => (
              <View key={index} style={styles.forecastDay}>
                <Text style={styles.forecastDayName}>{day.day}</Text>
                {day.icon === 'CloudSun' && <CloudSun size={24} color="#FFFFFF" />}
                {day.icon === 'CloudRain' && <CloudRain size={24} color="#FFFFFF" />}
                {day.icon === 'CloudLightning' && <CloudLightning size={24} color="#FFFFFF" />}
                <Text style={styles.forecastTemp}>{day.temp}°C</Text>
                <Text style={styles.forecastCondition}>{day.condition}</Text>
              </View>
            ))}
          </View>
          
          <Text style={styles.forecastImplication}>
            Ideal harvesting weather expected for the next 3 days. Take advantage of clear conditions.
          </Text>
        </LinearGradient>
        
        <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
          Your Crops
        </Text>
        
        <View style={styles.cropsContainer}>
          {crops.map((crop) => (
            <TouchableOpacity
              key={crop.id}
              style={[
                styles.cropCard,
                { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' },
                selectedCrop === crop.id && { borderColor: '#38B000', borderWidth: 2 }
              ]}
              onPress={() => setSelectedCrop(crop.id === selectedCrop ? null : crop.id)}
            >
              <View style={styles.cropImageContainer}>
                <Image
                  source={{ uri: crop.image }}
                  style={styles.cropImage}
                />
                <View 
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(crop.status) }
                  ]}
                >
                  {getStatusIcon(crop.status)}
                </View>
              </View>
              
              <View style={styles.cropInfo}>
                <Text style={[styles.cropName, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                  {crop.name}
                </Text>
                <Text style={[styles.cropVariety, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                  {crop.variety}
                </Text>
                
                <View style={styles.cropHarvestInfo}>
                  <CalendarClock size={14} color={getStatusColor(crop.status)} />
                  <Text 
                    style={[
                      styles.harvestTimeText, 
                      { color: getStatusColor(crop.status) }
                    ]}
                  >
                    {crop.estimatedHarvest}
                  </Text>
                </View>
                
                <View style={styles.cropLocation}>
                  <MapPin size={14} color={isDark ? '#AAAAAA' : '#666666'} />
                  <Text style={[styles.locationText, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                    {crop.fieldLocation}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {selectedCrop !== null && (
          <View 
            style={[
              styles.cropDetailsCard, 
              { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
            ]}
          >
            <View style={styles.cropDetailsHeader}>
              <Text style={[styles.cropDetailsTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                Harvest Analysis
              </Text>
              
              <View 
                style={[
                  styles.cropDetailsStatus,
                  { backgroundColor: getStatusColor(crops[selectedCrop - 1].status) }
                ]}
              >
                <Text style={styles.cropDetailsStatusText}>
                  {getStatusText(crops[selectedCrop - 1].status)}
                </Text>
              </View>
            </View>
            
            <View style={styles.cropDetailsRow}>
              <View style={styles.cropDetailItem}>
                <Text style={[styles.detailLabel, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                  Planted Date
                </Text>
                <Text style={[styles.detailValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                  {crops[selectedCrop - 1].plantedDate}
                </Text>
              </View>
              
              <View style={styles.cropDetailItem}>
                <Text style={[styles.detailLabel, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                  Current Age
                </Text>
                <Text style={[styles.detailValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                  {crops[selectedCrop - 1].currentAge}
                </Text>
              </View>
            </View>
            
            <View style={styles.cropDetailsRow}>
              <View style={styles.cropDetailItem}>
                <Text style={[styles.detailLabel, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                  Maturity Window
                </Text>
                <Text style={[styles.detailValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                  {crops[selectedCrop - 1].maturityWindow}
                </Text>
              </View>
              
              <View style={styles.cropDetailItem}>
                <Text style={[styles.detailLabel, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                  Best Harvest Time
                </Text>
                <Text style={[styles.detailValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                  Morning (6-9 AM)
                </Text>
              </View>
            </View>
            
            <Text style={[styles.optimalConditionsTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
              Optimal Harvest Conditions
            </Text>
            
            <View style={styles.conditionsContainer}>
              <View 
                style={[
                  styles.conditionItem, 
                  { backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0' }
                ]}
              >
                <Thermometer size={20} color="#FF7B67" />
                <Text style={[styles.conditionLabel, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                  Temperature
                </Text>
                <Text style={[styles.conditionValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                  {crops[selectedCrop - 1].optimalConditions.temperature}
                </Text>
              </View>
              
              <View 
                style={[
                  styles.conditionItem, 
                  { backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0' }
                ]}
              >
                <Droplets size={20} color="#00B4D8" />
                <Text style={[styles.conditionLabel, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                  Moisture
                </Text>
                <Text style={[styles.conditionValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                  {crops[selectedCrop - 1].optimalConditions.moisture}
                </Text>
              </View>
              
              <View 
                style={[
                  styles.conditionItem, 
                  { backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0' }
                ]}
              >
                <CloudSun size={20} color="#FFBB38" />
                <Text style={[styles.conditionLabel, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                  Weather
                </Text>
                <Text style={[styles.conditionValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                  {crops[selectedCrop - 1].optimalConditions.weather}
                </Text>
              </View>
            </View>
            
            <View style={styles.aiRecommendation}>
              <Text style={[styles.recommendationTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                AI Recommendation
              </Text>
              
              {crops[selectedCrop - 1].status === 'ready' ? (
                <Text style={[styles.recommendationText, { color: isDark ? '#CCCCCC' : '#555555' }]}>
                  Your {crops[selectedCrop - 1].name} ({crops[selectedCrop - 1].variety}) is at optimal harvest stage. 
                  Forecasted weather is ideal for the next 3 days. Recommend harvesting within the next 48 hours 
                  for best quality and yield. Morning harvest (6-9 AM) will ensure best moisture content and freshness.
                </Text>
              ) : crops[selectedCrop - 1].status === 'readySoon' ? (
                <Text style={[styles.recommendationText, { color: isDark ? '#CCCCCC' : '#555555' }]}>
                  Your {crops[selectedCrop - 1].name} ({crops[selectedCrop - 1].variety}) is approaching maturity but 
                  needs approximately {crops[selectedCrop - 1].estimatedHarvest} more. Continue monitoring for color changes 
                  and moisture levels. Plan your harvesting equipment and storage facilities now.
                </Text>
              ) : (
                <Text style={[styles.recommendationText, { color: isDark ? '#CCCCCC' : '#555555' }]}>
                  Your {crops[selectedCrop - 1].name} ({crops[selectedCrop - 1].variety}) requires approximately 
                  {crops[selectedCrop - 1].estimatedHarvest} more to reach optimal maturity. Ensure adequate irrigation 
                  and nutrient levels during this critical growth phase. Continue monitoring for pests and diseases.
                </Text>
              )}
            </View>
            
            <View style={styles.actionButtons}>
              {crops[selectedCrop - 1].status === 'ready' && (
                <TouchableOpacity 
                  style={[
                    styles.actionButton, 
                    { backgroundColor: '#38B000' }
                  ]}
                >
                  <Scissors size={18} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>
                    Schedule Harvest
                  </Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  { 
                    backgroundColor: 
                      crops[selectedCrop - 1].status === 'ready' 
                        ? (isDark ? '#2A2A2A' : '#F0F0F0')
                        : '#38B000'
                  }
                ]}
              >
                <Upload size={18} color={
                  crops[selectedCrop - 1].status === 'ready' 
                    ? (isDark ? '#FFFFFF' : '#333333')
                    : '#FFFFFF'
                } />
                <Text 
                  style={[
                    styles.actionButtonText, 
                    crops[selectedCrop - 1].status === 'ready' && 
                      { color: isDark ? '#FFFFFF' : '#333333' }
                  ]}
                >
                  Upload New Images
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        <TouchableOpacity
          style={[
            styles.addCropButton,
            { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
          ]}
        >
          <Text style={[styles.addCropText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            Add Another Crop
          </Text>
          <ArrowRight size={16} color={isDark ? '#FFFFFF' : '#333333'} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cameraButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  forecastCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    padding: 16,
  },
  forecastHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  forecastTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  forecastContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  forecastDay: {
    alignItems: 'center',
  },
  forecastDayName: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  forecastCondition: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  forecastImplication: {
    fontSize: 14,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  cropsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  cropCard: {
    width: (width - 48) / 2,
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cropImageContainer: {
    position: 'relative',
    width: '100%',
    height: 100,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  cropImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropInfo: {
    padding: 12,
  },
  cropName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cropVariety: {
    fontSize: 12,
    marginBottom: 8,
  },
  cropHarvestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  harvestTimeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  cropLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    marginLeft: 4,
  },
  cropDetailsCard: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cropDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cropDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cropDetailsStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  cropDetailsStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cropDetailsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  cropDetailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  optimalConditionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 12,
  },
  conditionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  conditionItem: {
    width: '31%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  conditionLabel: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 2,
  },
  conditionValue: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  aiRecommendation: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(56, 176, 0, 0.1)',
    marginBottom: 16,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  addCropButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 1,
  },
  addCropText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  }
}); 