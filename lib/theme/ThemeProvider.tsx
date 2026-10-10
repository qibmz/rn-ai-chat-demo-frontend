import { loadThemePreference, saveThemePreference } from '@/lib/theme/storage';
import type { ThemePreference } from '@/lib/theme/types';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

type ThemeContextValue = {
  preference: ThemePreference;
  /** 实际生效的明暗（跟随系统时解析为 light / dark） */
  resolved: 'light' | 'dark';
  setPreference: (preference: ThemePreference) => void;
  isReady: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemePreferenceProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void loadThemePreference().then((stored) => {
      if (!cancelled) {
        setPreferenceState(stored);
        setIsReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    void saveThemePreference(next);
    void import('@/lib/device/haptics').then(({ triggerSelectionHaptic }) =>
      triggerSelectionHaptic()
    );
  }, []);

  const resolved: 'light' | 'dark' =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const value = useMemo(
    () => ({
      preference,
      resolved,
      setPreference,
      isReady,
    }),
    [preference, resolved, setPreference, isReady]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemePreference() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemePreference 必须在 ThemePreferenceProvider 内使用');
  }
  return ctx;
}
