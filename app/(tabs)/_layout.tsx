import { Drawer } from 'expo-router/drawer';
import { Platform, View, Text, StyleSheet, Pressable } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ErrorBoundary from '../../components/ErrorBoundary';

export default function DrawerLayout() {
  const { isDark, primaryColor } = useThemeStore();
  const insets = useSafeAreaInsets();

  // Custom error fallback for drawer
  const DrawerErrorFallback = () => (
    <View style={[
      styles.errorContainer, 
      { backgroundColor: isDark ? '#121212' : '#FFFFFF' }
    ]}>
      <Ionicons name="alert-circle" size={48} color={primaryColor} />
      <Text style={[
        styles.errorTitle, 
        { color: isDark ? '#FFFFFF' : '#333333' }
      ]}>
        Navigation Error
      </Text>
      <Text style={[
        styles.errorMessage, 
        { color: isDark ? '#CCCCCC' : '#666666' }
      ]}>
        There was an error loading the navigation. Please restart the app.
      </Text>
    </View>
  );

  return (
    <ErrorBoundary fallback={<DrawerErrorFallback />}>
      <Drawer
        screenOptions={({ route }) => ({
          headerShown: false,
          drawerActiveTintColor: primaryColor,
          drawerInactiveTintColor: isDark ? '#888888' : '#666666',
          drawerStyle: {
            backgroundColor: isDark ? '#121212' : '#FFFFFF',
            width: 280,
          },
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: '500',
            marginLeft: -20,
          },
          drawerItemStyle: {
            borderRadius: 12,
            marginHorizontal: 12,
            height: 56,
            marginVertical: 4,
          },
          drawerActiveBackgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        })}
      >
        <Drawer.Screen
          name="home"
          options={{
            title: 'Dashboard',
            drawerLabel: 'Dashboard',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="farm"
          options={{
            title: 'My Farm',
            drawerLabel: 'My Farm',
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="grass" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="ai-assistant"
          options={{
            title: 'AI Assistant',
            drawerLabel: 'AI Assistant',
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="robot" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="irrigation-control"
          options={{
            title: 'Irrigation Control',
            drawerLabel: 'Irrigation Control',
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="water" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="crop-market"
          options={{
            title: 'Crop Market',
            drawerLabel: 'Crop Market',
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="store" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="farm-reports"
          options={{
            title: 'Farm Reports',
            drawerLabel: 'Farm Reports',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="document-text" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="fertilizer-pesticide"
          options={{
            title: 'Fertilizer & Pesticide',
            drawerLabel: 'Fertilizer & Pesticide',
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="bottle-tonic" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="harvesting-assistant"
          options={{
            title: 'Harvesting Assistant',
            drawerLabel: 'Harvesting Assistant',
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="scissors-cutting" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="learning"
          options={{
            title: 'Learning Center',
            drawerLabel: 'Learning Center',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="book" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="about"
          options={{
            title: 'About',
            drawerLabel: 'About',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="information-circle" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            title: 'Settings',
            drawerLabel: 'Settings',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="settings" size={24} color={color} />
            ),
          }}
        />
      </Drawer>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    width: 44,
    height: 32,
  },
  tabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  }
});