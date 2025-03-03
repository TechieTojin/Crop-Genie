import { Tabs } from 'expo-router';
import { Chrome as Home, Leaf, Cloud, User, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#7CFC00' : '#006400',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#888888' : '#666666',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
        },
        headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'KisanAI',
        }}
      />
      <Tabs.Screen
        name="crop-health"
        options={{
          title: 'Crop Health',
          tabBarIcon: ({ color, size }) => <Leaf size={size} color={color} />,
          headerTitle: 'Crop Health Monitoring',
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: 'Weather',
          tabBarIcon: ({ color, size }) => <Cloud size={size} color={color} />,
          headerTitle: 'Weather Insights',
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => <AlertTriangle size={size} color={color} />,
          headerTitle: 'Alerts & Notifications',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle: 'Farmer Profile',
        }}
      />
    </Tabs>
  );
}