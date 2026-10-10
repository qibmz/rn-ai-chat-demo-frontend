import type { ThemePreference } from '@/lib/theme/types';
import { Appearance } from 'react-native';

/** primary 按钮上的 spinner：浅色主题用白，深色主题用深色（primary 反色） */
export function getPrimarySpinnerColor(
  preference: ThemePreference,
  resolved?: 'light' | 'dark'
): string {
  const scheme =
    resolved ??
    (preference === 'system'
      ? Appearance.getColorScheme() === 'dark'
        ? 'dark'
        : 'light'
      : preference);
  return scheme === 'dark' ? '#171717' : '#ffffff';
}
