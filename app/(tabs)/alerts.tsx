import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, FlatList, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { TriangleAlert as AlertTriangle, Bug, Droplets, Zap, Bell, BellOff } from 'lucide-react-native';
import { useLanguageStore } from '../../store/languageStore';
import { getAlerts, markAlertAsRead, Alert } from '../../lib/supabase';

export default function AlertsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { translations: t } = useLanguageStore();
  
  const [settings, setSettings] = useState({
    pestAlerts: true,
    weatherAlerts: true,
    irrigationAlerts: true,
    fertilizerAlerts: true,
  });
  
  const [notifications, setNotifications] = useState<Alert[]>([
    {
      id: '1',
      farmer_id: 'user123',
      type: 'weather',
      title: 'Heavy Rainfall Alert',
      message: 'Heavy rainfall expected in your area in the next 48 hours. Consider harvesting mature crops and ensuring proper drainage.',
      read: false,
      icon: 'cloud-rain',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      farmer_id: 'user123',
      type: 'pest',
      title: 'Pest Detection Alert',
      message: 'Recent scans indicate potential aphid infestation in your rice crops. Early intervention is recommended.',
      read: true,
      icon: 'bug',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      farmer_id: 'user123',
      type: 'irrigation',
      title: 'Irrigation Reminder',
      message: 'Your wheat field is due for irrigation today based on soil moisture levels and weather forecast.',
      read: false,
      icon: 'droplet',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      farmer_id: 'user123',
      type: 'fertilizer',
      title: 'Fertilizer Application Due',
      message: 'Optimal time to apply second dose of nitrogen fertilizer to your maize crop based on growth stage.',
      read: false,
      icon: 'zap',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  // In a real app, we would fetch alerts from the database
  useEffect(() => {
    // This would be replaced with a real API call
    // const fetchAlerts = async () => {
    //   const user = await supabase.auth.getUser();
    //   if (user && user.data.user) {
    //     const farmerProfile = await getFarmerProfile(user.data.user.id);
    //     if (farmerProfile) {
    //       const alerts = await getAlerts(farmerProfile.id);
    //       setNotifications(alerts);
    //     }
    //   }
    // };
    // fetchAlerts();
  }, []);

  const toggleSetting = (setting: keyof typeof settings) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting],
    });
  };

  const handleNotificationPress = async (notification: Alert) => {
    // Mark as read
    if (!notification.read) {
      // In a real app, we would update the database
      // await markAlertAsRead(notification.id);
      
      // Update local state
      setNotifications(notifications.map(item => 
        item.id === notification.id ? { ...item, read: true } : item
      ));
    }
    
    // Handle notification action based on type
    // This would navigate to relevant screens or show more details
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'weather':
        return <AlertTriangle size={24} color="#FF9800" />;
      case 'pest':
        return <Bug size={24} color="#F44336" />;
      case 'irrigation':
        return <Droplets size={24} color="#2196F3" />;
      case 'fertilizer':
        return <Zap size={24} color="#4CAF50" />;
      default:
        return <Bell size={24} color="#9C27B0" />;
    }
  };

  const getNotificationBorderColor = (type: string) => {
    switch (type) {
      case 'weather':
        return '#FF9800';
      case 'pest':
        return '#F44336';
      case 'irrigation':
        return '#2196F3';
      case 'fertilizer':
        return '#4CAF50';
      default:
        return '#9C27B0';
    }
  };

  const renderNotification = ({ item }: { item: Alert }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        { 
          backgroundColor: isDark ? '#333333' : '#F5F5F5',
          borderLeftColor: getNotificationBorderColor(item.type),
          opacity: item.read ? 0.7 : 1,
        }
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationIcon}>
        {getNotificationIcon(item.type)}
      </View>
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
          {item.title}
        </Text>
        <Text style={[styles.notificationMessage, { color: isDark ? '#BBBBBB' : '#666666' }]}>
          {item.message}
        </Text>
        <Text style={[styles.notificationDate, { color: isDark ? '#999999' : '#999999' }]}>
          {formatDate(item.created_at)}
        </Text>
      </View>
      {!item.read && (
        <View style={[styles.unreadIndicator, { backgroundColor: getNotificationBorderColor(item.type) }]} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
        <View style={[styles.section, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>{t.notificationSettings}</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bug size={20} color={isDark ? '#7CFC00' : '#006400'} />
              <Text style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#000000' }]}>{t.pestAlerts}</Text>
            </View>
            <Switch
              value={settings.pestAlerts}
              onValueChange={() => toggleSetting('pestAlerts')}
              trackColor={{ false: '#767577', true: isDark ? '#4CAF50' : '#4CAF50' }}
              thumbColor={settings.pestAlerts ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <AlertTriangle size={20} color={isDark ? '#7CFC00' : '#006400'} />
              <Text style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#000000' }]}>{t.weatherAlerts}</Text>
            </View>
            <Switch
              value={settings.weatherAlerts}
              onValueChange={() => toggleSetting('weatherAlerts')}
              trackColor={{ false: '#767577', true: isDark ? '#4CAF50' : '#4CAF50' }}
              thumbColor={settings.weatherAlerts ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Droplets size={20} color={isDark ? '#7CFC00' : '#006400'} />
              <Text style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#000000' }]}>{t.irrigationAlerts}</Text>
            </View>
            <Switch
              value={settings.irrigationAlerts}
              onValueChange={() => toggleSetting('irrigationAlerts')}
              trackColor={{ false: '#767577', true: isDark ? '#4CAF50' : '#4CAF50' }}
              thumbColor={settings.irrigationAlerts ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Zap size={20} color={isDark ? '#7CFC00' : '#006400'} />
              <Text style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#000000' }]}>{t.fertilizerAlerts}</Text>
            </View>
            <Switch
              value={settings.fertilizerAlerts}
              onValueChange={() => toggleSetting('fertilizerAlerts')}
              trackColor={{ false: '#767577', true: isDark ? '#4CAF50' : '#4CAF50' }}
              thumbColor={settings.fertilizerAlerts ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>{t.recentNotifications}</Text>
          
          {notifications.length > 0 ? (
            <FlatList
              data={notifications}
              renderItem={renderNotification}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              nestedScrollEnabled={true}
            />
          ) : (
            <Text style={[styles.emptyText, { color: isDark ? '#BBBBBB' : '#666666' }]}>{t.noNotifications}</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 15,
  },
  section: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    marginLeft: 10,
    fontSize: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  notificationIcon: {
    marginRight: 15,
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
    marginTop: 5,
  },
  notificationDate: {
    fontSize: 12,
    marginTop: 5,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 10,
    alignSelf: 'center',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
  },
});