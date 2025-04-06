import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, useColorScheme, TextInput, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clipboard, Calendar, PlusCircle, X, ChevronRight, Sun, Cloud, Droplet, Wind, Thermometer } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Define types for our components and functions
type WeatherCondition = string;
type TaskId = number;

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onPress: () => void;
  disabled: boolean;
}

export default function PlannerScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [activeTab, setActiveTab] = useState('schedule');
  const [cropName, setCropName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [enableNotifications, setEnableNotifications] = useState(true);
  
  const tasks = [
    { id: 1, title: 'Prepare soil for rice planting', date: 'May 15, 2023', isCompleted: true },
    { id: 2, title: 'Apply organic fertilizer to wheat field', date: 'May 20, 2023', isCompleted: false },
    { id: 3, title: 'Irrigate soybean crops', date: 'May 21, 2023', isCompleted: false },
    { id: 4, title: 'Harvest mature corn crops', date: 'May 25, 2023', isCompleted: false },
    { id: 5, title: 'Pest control for vegetable garden', date: 'May 28, 2023', isCompleted: false },
  ];
  
  const plantingSchedule = [
    { id: 1, crop: 'Rice', plantingDate: 'June 10, 2023', harvestDate: 'October 5, 2023', area: '2 acres', variety: 'Basmati' },
    { id: 2, crop: 'Wheat', plantingDate: 'November 15, 2023', harvestDate: 'March 25, 2024', area: '3 acres', variety: 'HD-2967' },
    { id: 3, crop: 'Cotton', plantingDate: 'April 20, 2023', harvestDate: 'September 15, 2023', area: '1.5 acres', variety: 'Bt Cotton' },
  ];
  
  const weatherForecast = [
    { day: 'Today', condition: 'Sunny', maxTemp: 32, minTemp: 24, humidity: 65, windSpeed: 12 },
    { day: 'Tomorrow', condition: 'Partly Cloudy', maxTemp: 30, minTemp: 23, humidity: 70, windSpeed: 10 },
    { day: 'Wednesday', condition: 'Cloudy', maxTemp: 29, minTemp: 22, humidity: 75, windSpeed: 8 },
    { day: 'Thursday', condition: 'Light Rain', maxTemp: 28, minTemp: 22, humidity: 80, windSpeed: 15 },
    { day: 'Friday', condition: 'Sunny', maxTemp: 31, minTemp: 23, humidity: 60, windSpeed: 14 },
  ];
  
  const renderWeatherIcon = (condition: WeatherCondition) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun size={24} color="#FFD700" />;
      case 'partly cloudy':
        return <Cloud size={24} color="#A9A9A9" />;
      case 'cloudy':
        return <Cloud size={24} color="#778899" />;
      case 'light rain':
        return <Droplet size={24} color="#4682B4" />;
      default:
        return <Sun size={24} color="#FFD700" />;
    }
  };
  
  const addTask = () => {
    // Implementation for adding a task
    alert('Task added successfully!');
  };
  
  const toggleTaskCompletion = (taskId: TaskId) => {
    // Implementation for toggling task completion
  };
  
  // Define ServiceCard component with proper types
  const ServiceCard = ({ icon, title, description, onPress, disabled }: ServiceCardProps) => (
    <TouchableOpacity 
      style={[styles.serviceCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={[styles.iconContainer, { backgroundColor: isDark ? '#2D2D2D' : '#F1F7ED' }]}>
        {icon}
      </View>
      <Text style={[styles.serviceTitle, { color: isDark ? '#FFFFFF' : '#222222' }]}>{title}</Text>
      <Text style={[styles.serviceDescription, { color: isDark ? '#AAAAAA' : '#666666' }]}>{description}</Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F9FA' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={isDark ? ['#1A2421', '#0F3123'] : ['#E9F5E1', '#F8FFEF']}
          style={styles.headerSection}
        >
          <Text style={styles.headerTitle}>Crop Planner</Text>
          <Text style={styles.headerSubtitle}>Organize your farming activities</Text>
        </LinearGradient>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'schedule' && styles.activeTab,
              { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
            ]}
            onPress={() => setActiveTab('schedule')}
          >
            <Calendar size={16} color={activeTab === 'schedule' ? '#FFFFFF' : isDark ? '#BBBBBB' : '#666666'} />
            <Text
              style={[
                styles.tabText,
                activeTab === 'schedule' && styles.activeTabText,
                { color: isDark ? '#FFFFFF' : '#333333' }
              ]}
            >
              Schedule
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'tasks' && styles.activeTab,
              { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
            ]}
            onPress={() => setActiveTab('tasks')}
          >
            <Clipboard size={16} color={activeTab === 'tasks' ? '#FFFFFF' : isDark ? '#BBBBBB' : '#666666'} />
            <Text
              style={[
                styles.tabText,
                activeTab === 'tasks' && styles.activeTabText,
                { color: isDark ? '#FFFFFF' : '#333333' }
              ]}
            >
              Tasks
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'weather' && styles.activeTab,
              { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
            ]}
            onPress={() => setActiveTab('weather')}
          >
            <Cloud size={16} color={activeTab === 'weather' ? '#FFFFFF' : isDark ? '#BBBBBB' : '#666666'} />
            <Text
              style={[
                styles.tabText,
                activeTab === 'weather' && styles.activeTabText,
                { color: isDark ? '#FFFFFF' : '#333333' }
              ]}
            >
              Weather
            </Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'schedule' && (
          <View style={styles.scheduleContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                Planting Schedule
              </Text>
              <TouchableOpacity style={styles.addButton}>
                <PlusCircle size={20} color="#38B000" />
              </TouchableOpacity>
            </View>
            
            {plantingSchedule.map((item) => (
              <View 
                key={item.id} 
                style={[
                  styles.scheduleCard, 
                  { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
                ]}
              >
                <View style={styles.scheduleHeader}>
                  <Text style={[styles.cropName, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                    {item.crop}
                  </Text>
                  <Text style={[styles.cropVariety, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                    {item.variety}
                  </Text>
                </View>
                
                <View style={styles.scheduleDetails}>
                  <View style={styles.scheduleDetail}>
                    <Text style={[styles.detailLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                      Area:
                    </Text>
                    <Text style={[styles.detailValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                      {item.area}
                    </Text>
                  </View>
                  
                  <View style={styles.scheduleDetail}>
                    <Text style={[styles.detailLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                      Planting:
                    </Text>
                    <Text style={[styles.detailValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                      {item.plantingDate}
                    </Text>
                  </View>
                  
                  <View style={styles.scheduleDetail}>
                    <Text style={[styles.detailLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                      Harvest:
                    </Text>
                    <Text style={[styles.detailValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                      {item.harvestDate}
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity style={styles.viewDetailsButton}>
                  <Text style={styles.viewDetailsText}>View Details</Text>
                  <ChevronRight size={16} color="#38B000" />
                </TouchableOpacity>
              </View>
            ))}
            
            <View style={[styles.addCropCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
              <Text style={[styles.addCropTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                Add New Crop
              </Text>
              
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                  Crop Name
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    { 
                      color: isDark ? '#FFFFFF' : '#333333',
                      borderColor: isDark ? '#444444' : '#E0E0E0',
                      backgroundColor: isDark ? '#2D2D2D' : '#F8F9FA'
                    }
                  ]}
                  placeholder="Enter crop name"
                  placeholderTextColor={isDark ? '#888888' : '#999999'}
                  value={cropName}
                  onChangeText={setCropName}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                  Quantity (Acres)
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    { 
                      color: isDark ? '#FFFFFF' : '#333333',
                      borderColor: isDark ? '#444444' : '#E0E0E0',
                      backgroundColor: isDark ? '#2D2D2D' : '#F8F9FA'
                    }
                  ]}
                  placeholder="Enter quantity"
                  placeholderTextColor={isDark ? '#888888' : '#999999'}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.notificationToggle}>
                <Text style={[styles.notificationText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                  Enable Reminders
                </Text>
                <Switch
                  value={enableNotifications}
                  onValueChange={setEnableNotifications}
                  trackColor={{ false: '#767577', true: '#38B000' }}
                  thumbColor="#FFFFFF"
                />
              </View>
              
              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Add Crop</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {activeTab === 'tasks' && (
          <View style={styles.tasksContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                Upcoming Tasks
              </Text>
              <TouchableOpacity style={styles.addButton} onPress={addTask}>
                <PlusCircle size={20} color="#38B000" />
              </TouchableOpacity>
            </View>
            
            {tasks.map((task) => (
              <TouchableOpacity 
                key={task.id} 
                style={[
                  styles.taskCard, 
                  { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
                ]}
                onPress={() => toggleTaskCompletion(task.id)}
              >
                <View style={[
                  styles.checkbox, 
                  task.isCompleted && styles.checkboxCompleted,
                  { borderColor: isDark ? '#444444' : '#E0E0E0' }
                ]}>
                  {task.isCompleted && <X size={12} color="#FFFFFF" />}
                </View>
                
                <View style={styles.taskContent}>
                  <Text 
                    style={[
                      styles.taskTitle, 
                      task.isCompleted && styles.taskCompleted,
                      { color: isDark ? '#FFFFFF' : '#333333' }
                    ]}
                  >
                    {task.title}
                  </Text>
                  <Text style={[styles.taskDate, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                    {task.date}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {activeTab === 'weather' && (
          <View style={styles.weatherContainer}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333', marginBottom: 15 }]}>
              5-Day Weather Forecast
            </Text>
            
            {weatherForecast.map((day, index) => (
              <View 
                key={index} 
                style={[
                  styles.weatherCard, 
                  { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
                ]}
              >
                <View style={styles.weatherHeader}>
                  <Text style={[styles.weatherDay, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                    {day.day}
                  </Text>
                  {renderWeatherIcon(day.condition)}
                  <Text style={[styles.weatherCondition, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                    {day.condition}
                  </Text>
                </View>
                
                <View style={styles.weatherDetails}>
                  <View style={styles.weatherDetail}>
                    <Thermometer size={16} color="#FF6B6B" />
                    <Text style={[styles.weatherText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                      {day.maxTemp}°C / {day.minTemp}°C
                    </Text>
                  </View>
                  
                  <View style={styles.weatherDetail}>
                    <Droplet size={16} color="#4682B4" />
                    <Text style={[styles.weatherText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                      {day.humidity}% Humidity
                    </Text>
                  </View>
                  
                  <View style={styles.weatherDetail}>
                    <Wind size={16} color="#A9A9A9" />
                    <Text style={[styles.weatherText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                      {day.windSpeed} km/h
                    </Text>
                  </View>
                </View>
                
                <View style={styles.farmerAdvice}>
                  <Text style={[styles.adviceLabel, { color: isDark ? '#38B000' : '#38B000' }]}>
                    Farming Advice:
                  </Text>
                  <Text style={[styles.adviceText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                    {day.condition === 'Light Rain' 
                      ? 'Skip irrigation today. Good conditions for transplanting.' 
                      : day.condition === 'Sunny' && day.maxTemp > 30 
                        ? 'Ensure adequate irrigation. Avoid pesticide application.' 
                        : 'Moderate conditions. Good for general field work.'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: isDark ? '#999999' : '#999999' }]}>
            CropGenies and Co v1.0.0
          </Text>
          <Text style={[styles.footerDeveloper, { color: isDark ? '#38B000' : '#38B000' }]}>
            Developed by TOJIN VARKEY SIMSON
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
  headerSection: {
    padding: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    backgroundColor: '#38B000',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 5,
  },
  scheduleContainer: {
    padding: 15,
  },
  scheduleCard: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cropName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cropVariety: {
    fontSize: 14,
  },
  scheduleDetails: {
    marginBottom: 15,
  },
  scheduleDetail: {
    flexDirection: 'row',
    marginVertical: 3,
  },
  detailLabel: {
    fontSize: 14,
    marginRight: 5,
    width: 70,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  viewDetailsText: {
    color: '#38B000',
    fontWeight: '500',
    marginRight: 5,
  },
  addCropCard: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addCropTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  formGroup: {
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  notificationToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  notificationText: {
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#38B000',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tasksContainer: {
    padding: 15,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  checkboxCompleted: {
    backgroundColor: '#38B000',
    borderColor: '#38B000',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  taskDate: {
    fontSize: 12,
  },
  weatherContainer: {
    padding: 15,
  },
  weatherCard: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  weatherDay: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 15,
    width: 100,
  },
  weatherCondition: {
    fontSize: 16,
    marginLeft: 10,
  },
  weatherDetails: {
    marginBottom: 15,
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  weatherText: {
    fontSize: 14,
    marginLeft: 10,
  },
  farmerAdvice: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 10,
  },
  adviceLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  adviceText: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 30,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 14,
    marginBottom: 5,
  },
  footerDeveloper: {
    fontSize: 14,
    fontWeight: '500',
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  serviceDescription: {
    fontSize: 14,
  },
}); 