import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Linking,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../../store/themeStore';
import {
  Moon,
  Sun,
  ChevronRight,
  Bell,
  HelpCircle,
  Shield,
  Globe,
  Share2,
  LogOut,
  Smartphone,
  UserCog,
  Info,
} from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

// Available theme colors
const themeColors = [
  { name: 'Green', color: '#38B000' },
  { name: 'Blue', color: '#3A86FF' },
  { name: 'Purple', color: '#8338EC' },
  { name: 'Red', color: '#FF006E' },
  { name: 'Orange', color: '#FB5607' },
];

export default function SettingsScreen() {
  const { isDark, useSystemTheme, primaryColor, toggleTheme, setSystemTheme, setPrimaryColor } = useThemeStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleSystemThemeToggle = (value: boolean) => {
    setSystemTheme(value);
  };

  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleLocationToggle = () => {
    setLocationEnabled(!locationEnabled);
  };

  const handleColorSelect = (color: string) => {
    setPrimaryColor(color);
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => console.log('Logged out') },
      ]
    );
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://www.example.com/privacy-policy');
  };

  const openHelp = () => {
    Linking.openURL('https://www.example.com/help');
  };

  const shareApp = () => {
    const message = 'Check out this awesome farming app with AI assistance!';
    const url = Platform.OS === 'ios' ? 'https://apps.apple.com/app/id123456789' : 'https://play.google.com/store/apps/details?id=com.example.app';
    
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(`${message} ${url}`);
      Alert.alert('Copied to clipboard');
    } else {
      Linking.openURL(`sms:&body=${message} ${url}`);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}
      edges={['right', 'left']}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? '#FFFFFF' : '#333333' },
          ]}
        >
          Appearance
        </Text>

        <Animated.View entering={FadeIn.duration(300)}>
          <View 
            style={[
              styles.settingCard, 
              { backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF' }
            ]}
          >
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleThemeToggle}
            >
              <View style={styles.settingLeft}>
                {isDark ? (
                  <Moon size={22} color="#F9C846" style={styles.settingIcon} />
                ) : (
                  <Sun size={22} color="#FB8C00" style={styles.settingIcon} />
                )}
                <Text
                  style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#333333' }]}
                >
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={handleThemeToggle}
                trackColor={{ false: '#767577', true: primaryColor + '50' }}
                thumbColor={isDark ? primaryColor : '#f4f3f4'}
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Smartphone size={22} color={isDark ? '#BBBBBB' : '#666666'} style={styles.settingIcon} />
                <Text
                  style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#333333' }]}
                >
                  Use System Theme
                </Text>
              </View>
              <Switch
                value={useSystemTheme}
                onValueChange={handleSystemThemeToggle}
                trackColor={{ false: '#767577', true: primaryColor + '50' }}
                thumbColor={useSystemTheme ? primaryColor : '#f4f3f4'}
              />
            </View>
          </View>
        </Animated.View>

        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? '#FFFFFF' : '#333333' },
            { marginTop: 24 },
          ]}
        >
          Theme Color
        </Text>

        <Animated.View entering={FadeIn.delay(100).duration(300)}>
          <View 
            style={[
              styles.settingCard, 
              { backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF' }
            ]}
          >
            <View style={styles.colorOptions}>
              {themeColors.map((theme) => (
                <TouchableOpacity
                  key={theme.color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: theme.color },
                    primaryColor === theme.color && styles.selectedColor,
                  ]}
                  onPress={() => handleColorSelect(theme.color)}
                />
              ))}
            </View>
          </View>
        </Animated.View>

        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? '#FFFFFF' : '#333333' },
            { marginTop: 24 },
          ]}
        >
          Permissions
        </Text>

        <Animated.View entering={FadeIn.delay(200).duration(300)}>
          <View 
            style={[
              styles.settingCard, 
              { backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF' }
            ]}
          >
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Bell size={22} color={isDark ? '#BBBBBB' : '#666666'} style={styles.settingIcon} />
                <Text
                  style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#333333' }]}
                >
                  Notifications
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationsToggle}
                trackColor={{ false: '#767577', true: primaryColor + '50' }}
                thumbColor={notificationsEnabled ? primaryColor : '#f4f3f4'}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Globe size={22} color={isDark ? '#BBBBBB' : '#666666'} style={styles.settingIcon} />
                <Text
                  style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#333333' }]}
                >
                  Location Services
                </Text>
              </View>
              <Switch
                value={locationEnabled}
                onValueChange={handleLocationToggle}
                trackColor={{ false: '#767577', true: primaryColor + '50' }}
                thumbColor={locationEnabled ? primaryColor : '#f4f3f4'}
              />
            </View>
          </View>
        </Animated.View>

        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? '#FFFFFF' : '#333333' },
            { marginTop: 24 },
          ]}
        >
          Account
        </Text>

        <Animated.View entering={FadeIn.delay(300).duration(300)}>
          <View 
            style={[
              styles.settingCard, 
              { backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF' }
            ]}
          >
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <UserCog size={22} color={isDark ? '#BBBBBB' : '#666666'} style={styles.settingIcon} />
                <Text
                  style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#333333' }]}
                >
                  Edit Profile
                </Text>
              </View>
              <ChevronRight size={20} color={isDark ? '#666666' : '#BBBBBB'} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
              <View style={styles.settingLeft}>
                <LogOut size={22} color="#FF6B6B" style={styles.settingIcon} />
                <Text
                  style={[styles.settingText, { color: '#FF6B6B' }]}
                >
                  Log Out
                </Text>
              </View>
              <ChevronRight size={20} color={isDark ? '#666666' : '#BBBBBB'} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? '#FFFFFF' : '#333333' },
            { marginTop: 24 },
          ]}
        >
          About Developer
        </Text>

        <Animated.View entering={FadeIn.delay(400).duration(300)}>
          <View 
            style={[
              styles.settingCard, 
              { backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF' }
            ]}
          >
            <View style={styles.developerSection}>
              <Image 
                source={require('../../assets/images/DP.jpg')} 
                style={styles.developerImage} 
              />
              
              <View style={styles.developerInfo}>
                <Text style={[styles.developerName, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                  TOJIN VARKEY SIMSON
                </Text>
                <Text style={[styles.developerRole, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                  Software Developer & AI Specialist
                </Text>
                <Text style={[styles.developerBio, { color: isDark ? '#AAAAAA' : '#777777' }]}>
                  Creating AI-powered solutions to help smallholder farmers increase productivity and sustainability.
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 4,
  },
  settingCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
  },
  versionText: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginLeft: 50,
  },
  colorOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  developerSection: {
    alignItems: 'center',
    padding: 16,
  },
  developerImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#38B000',
  },
  developerInfo: {
    alignItems: 'center',
  },
  developerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  developerRole: {
    fontSize: 14,
    marginBottom: 8,
  },
  developerBio: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
}); 