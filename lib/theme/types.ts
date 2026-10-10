export type ThemePreference = 'system' | 'light' | 'dark';

export const THEME_PREFERENCE_OPTIONS: {
  value: ThemePreference;
  label: string;
  description: string;
}[] = [
  { value: 'system', label: '跟随系统', description: '自动匹配设备外观' },
  { value: 'light', label: '浅色', description: '始终使用浅色模式' },
  { value: 'dark', label: '深色', description: '始终使用深色模式' },
];
