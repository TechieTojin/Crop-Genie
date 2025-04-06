import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  useColorScheme, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react-native';
import { useLanguageStore } from '../../store/languageStore';
import { signIn } from '../../lib/auth';
import { Stack, Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase, checkSupabaseConnection } from '../../lib/supabase';
import { FontAwesome5 } from '@expo/vector-icons';
import { useThemeStore } from '../../store/themeStore';
import { useRouter as useExpoRouter } from 'expo-router';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email: string;
  password: string;
}

export default function AuthScreen() {
  const router = useExpoRouter();
  const { isDark } = useThemeStore();
  const colorScheme = useColorScheme();
  const { translations: t } = useLanguageStore();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: '',
    password: '',
  });

  // Add demo mode functionality to bypass Supabase authentication
  const [demoMode, setDemoMode] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error when user types
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    } else {
      newErrors.email = '';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    } else {
      newErrors.password = '';
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Create the farmer_profiles table if it doesn't exist
  const createProfilesTableIfNeeded = async (userId: string, userEmail: string | undefined) => {
    try {
      // Check if table exists by trying to query it
      const { error: tableCheckError } = await supabase
        .from('farmer_profiles')
        .select('count')
        .limit(1);
      
      // If table doesn't exist, create it
      if (tableCheckError && tableCheckError.message.includes("relation \"farmer_profiles\" does not exist")) {
        const { error: createTableError } = await supabase.rpc('create_farmer_profiles_table');
        
        if (createTableError) {
          console.error('Error creating table:', createTableError);
          return false;
        }
      }
      
      // Try to get the user's profile
      const { data: existingProfile, error: getProfileError } = await supabase
        .from('farmer_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (getProfileError) {
        if (getProfileError.code === 'PGRST116') {
          // No profile found, create one
          const { error: insertError } = await supabase
            .from('farmer_profiles')
            .insert([{
              user_id: userId,
              name: userEmail ? userEmail.split('@')[0] : 'User',
              email: userEmail || '',
              phone: '+91 9876543210',
              location: 'Pune, Maharashtra',
              farm_size: '5 acres',
              crops: ['Rice', 'Wheat', 'Sugarcane'],
              soil_type: 'Black soil (Regur)',
              water_source: 'Canal irrigation',
              preferred_language: 'English',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }]);
          
          if (insertError) {
            console.error('Error creating profile:', insertError);
            return false;
          }
        } else {
          console.error('Error checking profile:', getProfileError);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error managing profiles table:', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Checking Supabase connection...');
      const connectionOk = await checkSupabaseConnection();
      
      if (!connectionOk) {
        Alert.alert(
          'Connection Error',
          'Unable to connect to the server. Please check your internet connection and try again.',
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }
      
      console.log('Attempting to sign in with:', formData.email);
      
      // Add a small delay to prevent UI blocking
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data, error } = await signIn(formData.email, formData.password);
      
      console.log('Sign in response:', { data: data ? 'Data received' : 'No data', error: error || 'No error' });
      
      if (error) {
        console.error('Login error details:', error);
        
        if (error.message.includes('Invalid login credentials')) {
          Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
        } else {
          Alert.alert('Login Failed', error.message);
        }
      } else if (data?.user) {
        console.log('User authenticated successfully, creating/checking profile');
        
        // Create or update user profile in the database
        const profileCreated = await createProfilesTableIfNeeded(
          data.user.id, 
          data.user.email
        );
        
        console.log('Profile setup result:', profileCreated ? 'Success' : 'Failed');
        
        // Navigate to the main app even if profile creation failed
        // The profile screen will handle creating a profile if needed
        console.log('Navigating to home');
        router.replace("/");
      } else {
        console.log('No error but no user data returned');
        Alert.alert('Login Failed', 'Could not authenticate. Please try again.');
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update the handleDemoLogin function to bypass normal authentication
  const handleDemoLogin = async () => {
    setFormData({
      email: 'demo@kisanai.com',
      password: 'password123'
    });
    
    setDemoMode(true);
    setLoading(true);
    
    try {
      // Show loading state briefly for UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('Bypassing authentication in demo mode');
      
      // Create a mock user and session
      const mockUser = {
        id: 'demo-user-id',
        email: 'demo@kisanai.com',
        role: 'authenticated',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString()
      };
      
      // Directly navigate to the main app
      console.log('Navigating to home in demo mode');
      router.replace("/");
    } catch (error) {
      console.error('Demo login error:', error);
      Alert.alert('Error', 'Could not enter demo mode. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add a direct login bypass button
  const handleBypassAuth = () => {
    Alert.alert(
      'Bypass Authentication',
      'This will skip authentication and go directly to the app. Use for testing only.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Continue',
          onPress: () => {
            console.log('Bypassing auth completely');
            router.replace("/");
          }
        }
      ]
    );
  };

  // Handle guest navigation properly
  const navigateAsGuest = () => {
    try {
      router.replace("/(tabs)/home" as any);
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback
      router.replace("/");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      <Stack.Screen options={{ title: 'Login', headerShown: false }} />
      
      <View style={styles.header}>
        <FontAwesome5 name="seedling" size={48} color="#38B000" />
        <Text style={[styles.title, { color: isDark ? '#ffffff' : '#333333' }]}>CropGenies</Text>
        <Text style={[styles.subtitle, { color: isDark ? '#cccccc' : '#666666' }]}>
          AI Solutions for Smallholder Farmers
        </Text>
      </View>
      
      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => router.push("/google-auth")}
        >
          <FontAwesome5 name="google" size={20} color="#ffffff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.loginButton, { backgroundColor: '#4267B2' }]}
          onPress={() => router.push("/")}
        >
          <FontAwesome5 name="phone" size={20} color="#ffffff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Continue with Phone</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.loginButton, { backgroundColor: '#333333' }]}
          onPress={navigateAsGuest}
        >
          <FontAwesome5 name="user-secret" size={20} color="#ffffff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: isDark ? '#aaaaaa' : '#888888' }]}>
          By continuing, you agree to our{' '}
          <Text style={styles.link}>Terms of Service</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  loginButton: {
    backgroundColor: '#4285F4',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 40,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
  },
  link: {
    color: '#38B000',
    fontWeight: 'bold',
  },
});