import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, Theme } from '../theme/colors';

interface ThemeState {
  isDarkMode: boolean;
  theme: Theme;
  toggleTheme: () => void;
  setDarkMode: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      theme: lightTheme,
      
      toggleTheme: () =>
        set((state) => ({
          isDarkMode: !state.isDarkMode,
          theme: !state.isDarkMode ? darkTheme : lightTheme,
        })),
      
      setDarkMode: (isDark) =>
        set({
          isDarkMode: isDark,
          theme: isDark ? darkTheme : lightTheme,
        }),
    }),
    {
      name: 'laundry-theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
