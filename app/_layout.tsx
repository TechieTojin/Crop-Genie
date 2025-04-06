import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabase';
import { useLanguageStore } from '../store/languageStore';
import { useThemeStore } from '../store/themeStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, ActivityIndicator, StyleSheet, Text, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Session } from '@supabase/supabase-js';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import * as SplashScreen from 'expo-splash-screen';
import { LanguageProvider } from '../components/LanguageProvider';
import ErrorBoundary from '../components/ErrorBoundary';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { language, initializeLanguage } = useLanguageStore();
  const { isDark, primaryColor, updateWithColorScheme } = useThemeStore();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  // Update theme based on color scheme
  useEffect(() => {
    try {
      updateWithColorScheme(colorScheme);
    } catch (err) {
      console.error('Error updating color scheme:', err);
    }
  }, [colorScheme]);

  // Initialize app settings and hide splash screen
  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize language settings
        await initializeLanguage();
        
        // Wait a bit before hiding splash screen
        setTimeout(() => {
          SplashScreen.hideAsync().catch(err => {
            console.warn('Error hiding splash screen:', err);
          });
        }, 500);
      } catch (err) {
        console.error('Error initializing app:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize app'));
      } finally {
        setLoading(false);
      }
    };
    
    initApp();
  }, []);

  // Setup auth listener
  useEffect(() => {
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
      
      return () => {
        subscription.unsubscribe();
      };
    } catch (err) {
      console.error('Error setting up auth listener:', err);
      setError(err instanceof Error ? err : new Error('Authentication error'));
    }
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
        <Text style={styles.errorAction} onPress={() => setError(null)}>
          Tap to try again
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <LinearGradient
        colors={isDark ? ['#121212', '#1E1E1E'] : ['#F8F9FA', '#FFFFFF']}
        style={styles.loadingContainer}
      >
        <View style={styles.loaderContent}>
          <ActivityIndicator size="large" color={primaryColor} />
          <Text style={[styles.loadingText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            Loading CropGenies and Co...
          </Text>
          <Text style={[styles.developerText, { color: primaryColor }]}>
            TOJIN VARKEY SIMSON
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={{ 
            flex: 1, 
            backgroundColor: isDark ? Colors.DARK.BACKGROUND : Colors.NEUTRAL.BACKGROUND,
          }}>
            <Stack 
              screenOptions={{
                headerShown: false,
                contentStyle: { 
                  backgroundColor: isDark ? Colors.DARK.BACKGROUND : Colors.NEUTRAL.BACKGROUND
                },
              }}
            >
              {!session ? (
                <Stack.Screen 
                  name="auth" 
                  options={{ 
                    headerShown: false,
                    title: 'CropGenies and Co by TOJIN VARKEY SIMSON'
                  }} 
                />
              ) : (
                <Stack.Screen 
                  name="(tabs)" 
                  options={{ 
                    headerShown: false,
                    title: 'CropGenies and Co by TOJIN VARKEY SIMSON'
                  }} 
                />
              )}
              <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
              <Stack.Screen name="auth/index" options={{ headerShown: false }} />
              <Stack.Screen name="google-auth" options={{ headerShown: false }} />
            </Stack>
            
            <StatusBar 
              style={isDark ? 'light' : 'dark'} 
              backgroundColor="transparent" 
              translucent 
            />
            
            <View style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: insets.bottom || 0,
              backgroundColor: isDark ? Colors.DARK.BACKGROUND : Colors.NEUTRAL.BACKGROUND
            }} />
          </View>
        </GestureHandlerRootView>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContent: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 10,
  },
  developerText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#e74c3c',
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  errorAction: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '500',
    marginTop: 10,
    textDecorationLine: 'underline',
  }
});