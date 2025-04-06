import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  Image,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../../store/themeStore';
import { 
  Droplets, 
  Clock, 
  BarChart3, 
  Calendar, 
  Cloud, 
  CloudRain, 
  Thermometer, 
  Timer, 
  Wifi, 
  WifiOff,
  LifeBuoy
} from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withRepeat,
  interpolate,
  Easing 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const { width } = Dimensions.get('window');

export default function IrrigationControlScreen() {
  const { isDark } = useThemeStore();
  const [isAutomated, setIsAutomated] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [activeZones, setActiveZones] = useState<number[]>([2]);
  const [moisture, setMoisture] = useState({
    zone1: 62,
    zone2: 38,
    zone3: 75,
    zone4: 82
  });
  const [nextSchedule, setNextSchedule] = useState({
    zone1: '22:00 Today',
    zone2: 'Active Now',
    zone3: '06:30 Tomorrow',
    zone4: 'Off'
  });
  
  // Animation values
  const waterFlowAnimation = useSharedValue(0);
  const connectionStatus = useSharedValue(isConnected ? 1 : 0);
  
  // Water flow animation
  useEffect(() => {
    if (activeZones.length > 0) {
      waterFlowAnimation.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      waterFlowAnimation.value = 0;
    }
  }, [activeZones]);
  
  // Connection status animation
  useEffect(() => {
    connectionStatus.value = withTiming(isConnected ? 1 : 0, { duration: 500 });
  }, [isConnected]);
  
  const waterFlowStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: interpolate(waterFlowAnimation.value, [0, 1], [0, 20]) }],
      opacity: interpolate(waterFlowAnimation.value, [0, 0.5, 1], [0.4, 1, 0.4])
    };
  });
  
  const connectionStatusStyle = useAnimatedStyle(() => {
    return {
      opacity: connectionStatus.value,
      transform: [{ scale: interpolate(connectionStatus.value, [0, 1], [0.9, 1]) }]
    };
  });
  
  const disconnectedStatusStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - connectionStatus.value,
      transform: [{ scale: interpolate(connectionStatus.value, [0, 1], [1, 0.9]) }]
    };
  });
  
  const toggleZone = (zoneNumber: number) => {
    if (activeZones.includes(zoneNumber)) {
      setActiveZones(activeZones.filter(zone => zone !== zoneNumber));
      if (zoneNumber === 2) {
        setNextSchedule(prev => ({ ...prev, zone2: '22:00 Today' }));
      }
    } else {
      setActiveZones([...activeZones, zoneNumber]);
      if (zoneNumber === 2) {
        setNextSchedule(prev => ({ ...prev, zone2: 'Active Now' }));
      }
    }
  };
  
  const getMoistureColor = (level: number) => {
    if (level < 40) return '#FF7B67'; // Low moisture - Coral
    if (level < 70) return '#38B000'; // Good moisture - Green
    return '#00B4D8'; // High moisture - Teal
  };
  
  const toggleConnection = () => {
    setIsConnected(!isConnected);
  };
  
  const formatMoistureStatus = (level: number) => {
    if (level < 40) return 'Low';
    if (level < 70) return 'Good';
    return 'High';
  };
  
  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F3F8F5' }]}
      edges={['right', 'left']}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
              Irrigation Control
            </Text>
            <Text style={[styles.headerSubtitle, { color: isDark ? '#AAAAAA' : '#666666' }]}>
              Smart water management system
            </Text>
          </View>
          
          <View style={styles.connectionStatus}>
            <TouchableOpacity 
              style={[
                styles.connectionButton, 
                { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
              ]}
              onPress={toggleConnection}
            >
              <Animated.View style={connectionStatusStyle}>
                <Wifi size={20} color="#38B000" />
              </Animated.View>
              <Animated.View style={[disconnectedStatusStyle, styles.disconnectedIcon]}>
                <WifiOff size={20} color="#FF7B67" />
              </Animated.View>
            </TouchableOpacity>
            <Text style={[styles.connectionText, { color: isDark ? '#AAAAAA' : '#666666' }]}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
        </View>
        
        <View style={styles.controlModeContainer}>
          <View style={styles.controlModeTextContainer}>
            <Text style={[styles.controlModeTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
              Automated Control
            </Text>
            <Text style={[styles.controlModeDescription, { color: isDark ? '#AAAAAA' : '#666666' }]}>
              {isAutomated 
                ? 'System automatically waters based on soil moisture and weather forecasts' 
                : 'Manual control of irrigation zones and schedules'}
            </Text>
          </View>
          <Switch
            trackColor={{ false: isDark ? '#555555' : '#DDDDDD', true: '#38B000' }}
            thumbColor={isAutomated ? '#FFFFFF' : '#FFFFFF'}
            onValueChange={() => setIsAutomated(!isAutomated)}
            value={isAutomated}
          />
        </View>
        
        <LinearGradient
          colors={isDark ? ['#1A2421', '#0F3123'] : ['#E9F5E1', '#F8FFEF']}
          style={styles.systemStatusCard}
        >
          <View style={styles.systemStatusHeader}>
            <Droplets size={24} color="#FFFFFF" />
            <Text style={styles.systemStatusTitle}>System Status</Text>
          </View>
          
          <View style={styles.systemStatusContent}>
            <View style={styles.statusItem}>
              <Timer size={20} color={isDark ? '#00B4D8' : '#00B4D8'} />
              <Text style={[styles.statusLabel, { color: isDark ? '#AAAAAA' : '#FFFFFF' }]}>
                Active Time
              </Text>
              <Text style={[styles.statusValue, { color: isDark ? '#FFFFFF' : '#FFFFFF' }]}>
                {activeZones.length > 0 ? '12 min' : 'Inactive'}
              </Text>
            </View>
            
            <View style={styles.statusItem}>
              <CloudRain size={20} color={isDark ? '#FFBB38' : '#FFBB38'} />
              <Text style={[styles.statusLabel, { color: isDark ? '#AAAAAA' : '#FFFFFF' }]}>
                Water Used
              </Text>
              <Text style={[styles.statusValue, { color: isDark ? '#FFFFFF' : '#FFFFFF' }]}>
                {activeZones.length > 0 ? '12.8 L' : '0 L'}
              </Text>
            </View>
            
            <View style={styles.statusItem}>
              <Thermometer size={20} color={isDark ? '#FF7B67' : '#FF7B67'} />
              <Text style={[styles.statusLabel, { color: isDark ? '#AAAAAA' : '#FFFFFF' }]}>
                Temperature
              </Text>
              <Text style={[styles.statusValue, { color: isDark ? '#FFFFFF' : '#FFFFFF' }]}>
                28 °C
              </Text>
            </View>
            
            <View style={styles.statusItem}>
              <Cloud size={20} color={isDark ? '#9747FF' : '#9747FF'} />
              <Text style={[styles.statusLabel, { color: isDark ? '#AAAAAA' : '#FFFFFF' }]}>
                Humidity
              </Text>
              <Text style={[styles.statusValue, { color: isDark ? '#FFFFFF' : '#FFFFFF' }]}>
                65%
              </Text>
            </View>
          </View>
          
          {isConnected && activeZones.length > 0 && (
            <Animated.View style={[styles.waterFlowAnimation, waterFlowStyle]}>
              <Droplets size={24} color="#00B4D8" />
              <Droplets size={18} color="#00B4D8" style={{ marginLeft: -5, marginTop: 10 }} />
              <Droplets size={20} color="#00B4D8" style={{ marginLeft: 5, marginTop: 5 }} />
            </Animated.View>
          )}
        </LinearGradient>
        
        <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
          Irrigation Zones
        </Text>
        
        <View style={styles.zonesContainer}>
          {[1, 2, 3, 4].map((zone) => (
            <TouchableOpacity
              key={zone}
              style={[
                styles.zoneCard,
                { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' },
                activeZones.includes(zone) && { borderColor: '#38B000', borderWidth: 2 }
              ]}
              onPress={() => toggleZone(zone)}
              disabled={!isConnected}
            >
              <View style={styles.zoneHeader}>
                <Text style={[styles.zoneTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                  Zone {zone}
                </Text>
                <View 
                  style={[
                    styles.zoneStatusIndicator,
                    { 
                      backgroundColor: activeZones.includes(zone) 
                        ? '#38B000' 
                        : isDark ? '#555555' : '#DDDDDD'
                    }
                  ]}
                />
              </View>
              
              <Text style={[styles.zoneType, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                {zone === 1 ? 'Vegetable Garden' : 
                 zone === 2 ? 'Fruit Trees' : 
                 zone === 3 ? 'Flower Beds' : 
                 'Rice Paddy'}
              </Text>
              
              <View style={styles.zoneMoistureContainer}>
                <View style={styles.moistureBarContainer}>
                  <View 
                    style={[
                      styles.moistureBar,
                      { 
                        width: `${moisture[`zone${zone}` as keyof typeof moisture]}%`,
                        backgroundColor: getMoistureColor(moisture[`zone${zone}` as keyof typeof moisture])
                      }
                    ]}
                  />
                </View>
                <Text style={[styles.moistureText, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                  {moisture[`zone${zone}` as keyof typeof moisture]}% • {
                    formatMoistureStatus(moisture[`zone${zone}` as keyof typeof moisture])
                  }
                </Text>
              </View>
              
              <View style={styles.zoneSchedule}>
                <Clock size={16} color={isDark ? '#AAAAAA' : '#666666'} />
                <Text style={[styles.scheduleText, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                  {nextSchedule[`zone${zone}` as keyof typeof nextSchedule]}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.actionButton,
              { backgroundColor: '#38B000' }
            ]}
            disabled={!isConnected}
          >
            <Text style={styles.buttonText}>Start All Zones</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.actionButton,
              { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
            ]}
            disabled={!isConnected}
          >
            <Text style={[styles.buttonText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
              Schedule Manager
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            Water Usage Statistics
          </Text>
          
          <View style={[styles.statsCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <View style={styles.statsHeader}>
              <BarChart3 size={20} color={isDark ? '#00B4D8' : '#00B4D8'} />
              <Text style={[styles.statsTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                Weekly Usage
              </Text>
            </View>
            
            <View style={styles.barChartContainer}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <View key={day} style={styles.barChartItem}>
                  <View style={styles.barContainer}>
                    <View 
                      style={[
                        styles.bar, 
                        { 
                          height: `${[40, 60, 85, 50, 35, 65, 45][index]}%`,
                          backgroundColor: isDark ? '#00B4D8' : '#00B4D8'
                        }
                      ]}
                    />
                  </View>
                  <Text style={[styles.barLabel, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                    {day}
                  </Text>
                </View>
              ))}
            </View>
            
            <View style={styles.statsFooter}>
              <View>
                <Text style={[styles.statsFooterLabel, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                  Total Week Usage
                </Text>
                <Text style={[styles.statsFooterValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                  425 Liters
                </Text>
              </View>
              
              <View>
                <Text style={[styles.statsFooterLabel, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                  Water Saved
                </Text>
                <Text style={[styles.statsFooterValue, { color: '#38B000' }]}>
                  32% vs. Last Week
                </Text>
              </View>
            </View>
          </View>
        </View>
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
  connectionStatus: {
    alignItems: 'center',
  },
  connectionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  disconnectedIcon: {
    position: 'absolute',
  },
  connectionText: {
    fontSize: 12,
    marginTop: 4,
  },
  controlModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(56, 176, 0, 0.1)',
  },
  controlModeTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  controlModeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  controlModeDescription: {
    fontSize: 12,
    marginTop: 4,
  },
  systemStatusCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  systemStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  systemStatusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  systemStatusContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  statusItem: {
    width: '50%',
    paddingVertical: 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  statusLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  waterFlowAnimation: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    flexDirection: 'row',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  zonesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  zoneCard: {
    width: (width - 48) / 2,
    margin: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  zoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zoneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  zoneStatusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  zoneType: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  zoneMoistureContainer: {
    marginBottom: 12,
  },
  moistureBarContainer: {
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  moistureBar: {
    height: 6,
    borderRadius: 3,
  },
  moistureText: {
    fontSize: 12,
    marginTop: 4,
  },
  zoneSchedule: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleText: {
    fontSize: 12,
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 150,
    marginBottom: 16,
  },
  barChartItem: {
    flex: 1,
    alignItems: 'center',
  },
  barContainer: {
    height: 120,
    width: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: 8,
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  statsFooterLabel: {
    fontSize: 12,
  },
  statsFooterValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
}); 