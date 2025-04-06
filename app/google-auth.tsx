import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Image } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import { useLanguageStore } from '../store/languageStore';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';

export default function GoogleAuthScreen() {
  const { isDark } = useThemeStore();
  const { translations: t } = useLanguageStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, you'd use react-native-google-signin on mobile
      // For web, this popup approach works
      const result = await signInWithPopup(auth, googleProvider);
      
      // Get Google credentials
      const { user } = result;
      
      // Save user info to Supabase or your backend
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) throw error;
      
      // Navigate to the home screen
      router.replace('/');
    } catch (err: any) {
      setError(err.message || 'Sign in failed. Please try again.');
      console.error('Google sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Skip login in development mode
  const handleSkipLogin = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F9FA' }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <LinearGradient
        colors={isDark ? ['#1A2421', '#0F3123'] : ['#E9F5E1', '#F8FFEF']}
        style={styles.gradientContainer}
      >
        <View style={styles.header}>
          <Text style={styles.title}>CropGenies and Co</Text>
          <Text style={styles.subtitle}>Sign in with Google</Text>
        </View>
        
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80' }}
            style={styles.logo}
          />
        </View>
        
        <View style={styles.content}>
          <Text style={[styles.description, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            Use your Google account to sign in to CropGenies and Co for a seamless farming experience
          </Text>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <TouchableOpacity
            style={[styles.googleButton, { opacity: loading ? 0.7 : 1 }]}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Image
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
                  style={styles.googleIcon}
                />
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.regularLoginButton}
            onPress={() => router.push('/auth')}
          >
            <Text style={styles.regularLoginText}>Sign in with Email and Password</Text>
          </TouchableOpacity>
          
          {__DEV__ && (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkipLogin}
            >
              <Text style={styles.skipButtonText}>Skip (Dev Mode)</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>By continuing, you agree to our Terms and Privacy Policy</Text>
          <Text style={styles.developerText}>TOJIN VARKEY SIMSON</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 20,
  },
  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 25,
    margin: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 25,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  errorText: {
    color: '#FF0000',
    textAlign: 'center',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  regularLoginButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 5,
  },
  regularLoginText: {
    color: '#FFFFFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  skipButton: {
    backgroundColor: 'rgba(56, 176, 0, 0.8)',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  developerText: {
    color: '#38B000',
    fontSize: 14,
    fontWeight: '500',
  }
}); 