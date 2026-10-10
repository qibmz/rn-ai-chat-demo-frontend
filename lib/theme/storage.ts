import type { ThemePreference } from '@/lib/theme/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'settings.themePreference';

function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

export async function loadThemePreference(): Promise<ThemePreference> {
  const value = await AsyncStorage.getItem(THEME_KEY);
  return isThemePreference(value) ? value : 'system';
}

export async function saveThemePreference(preference: ThemePreference): Promise<void> {
  await AsyncStorage.setItem(THEME_KEY, preference);
}
