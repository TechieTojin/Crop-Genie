import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabase';
import { useLanguageStore } from '../store/languageStore';
import AuthScreen from '../components/AuthScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export default function RootLayout() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setLanguage } = useLanguageStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.frameworkReady?.();
    }

    // Set up auth state listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // For demo purposes, we'll skip the auth flow
  const handleLogin = () => {
    // In a real app, this would be handled by the auth flow
    setSession({} as any);
  };

  if (loading) {
    return null; // Or a loading screen
  }

  // For demo purposes, we'll skip the auth check
  const isAuthenticated = true; // session !== null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {!isAuthenticated ? (
        <AuthScreen onLogin={handleLogin} />
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
        </Stack>
      )}
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}