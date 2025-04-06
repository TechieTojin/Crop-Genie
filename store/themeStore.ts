import { create } from 'zustand';
import { ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  useSystemTheme: boolean;
  primaryColor: string;
  toggleTheme: () => void;
  setSystemTheme: (useSystem: boolean) => void;
  setPrimaryColor: (color: string) => void;
  updateWithColorScheme: (colorScheme: ColorSchemeName) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: false,
      useSystemTheme: true,
      primaryColor: '#38B000',

      toggleTheme: () => {
        if (get().useSystemTheme) {
          // First disable system theme when manually toggling
          set({ useSystemTheme: false });
        }
        set((state) => ({ isDark: !state.isDark }));
      },

      setSystemTheme: (useSystem: boolean) => {
        set({ useSystemTheme: useSystem });
      },

      setPrimaryColor: (color: string) => {
        set({ primaryColor: color });
      },

      updateWithColorScheme: (colorScheme: ColorSchemeName) => {
        // Only update if using system theme
        if (get().useSystemTheme) {
          set({ isDark: colorScheme === 'dark' });
        }
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 