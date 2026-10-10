import { isNativeApp } from '@/lib/device/platform';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HAPTICS_KEY = 'settings.hapticsEnabled';

export async function loadHapticsEnabled(): Promise<boolean> {
  if (!isNativeApp) return false;
  const value = await AsyncStorage.getItem(HAPTICS_KEY);
  // 默认开启触感
  return value !== '0';
}

export async function saveHapticsEnabled(enabled: boolean): Promise<void> {
  if (!isNativeApp) return;
  await AsyncStorage.setItem(HAPTICS_KEY, enabled ? '1' : '0');
}

/** 在用户操作时触发轻触感（尊重偏好；Web 无操作） */
export async function triggerSelectionHaptic(): Promise<void> {
  if (!isNativeApp) return;
  const enabled = await loadHapticsEnabled();
  if (!enabled) return;
  try {
    const Haptics = await import('expo-haptics');
    await Haptics.selectionAsync();
  } catch {
    // Expo Go / 模拟器偶发不可用时忽略
  }
}

export async function triggerImpactHaptic(): Promise<void> {
  if (!isNativeApp) return;
  const enabled = await loadHapticsEnabled();
  if (!enabled) return;
  try {
    const Haptics = await import('expo-haptics');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {
    // ignore
  }
}
