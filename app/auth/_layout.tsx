import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        title: 'CropGenies and Co by TOJIN VARKEY SIMSON',
        headerStyle: {
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
        },
        headerTintColor: isDark ? '#FFFFFF' : '#333333',
        contentStyle: {
          backgroundColor: isDark ? '#121212' : '#F8F9FA',
        }
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Login | CropGenies and Co by TOJIN VARKEY SIMSON' }} />
      <Stack.Screen name="signup" options={{ title: 'Sign Up | CropGenies and Co by TOJIN VARKEY SIMSON' }} />
      <Stack.Screen name="forgot-password" options={{ title: 'Reset Password | CropGenies and Co by TOJIN VARKEY SIMSON' }} />
    </Stack>
  );
}