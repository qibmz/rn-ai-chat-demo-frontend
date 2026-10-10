import { isNativeApp } from '@/lib/device/platform';
import { Linking, Platform } from 'react-native';

export type NotificationPermissionStatus = 'granted' | 'denied' | 'undetermined';

async function getNotificationsModule() {
  return import('expo-notifications');
}

export async function getNotificationPermissionStatus(): Promise<NotificationPermissionStatus> {
  if (!isNativeApp) return 'denied';
  try {
    const Notifications = await getNotificationsModule();
    const { status } = await Notifications.getPermissionsAsync();
    if (status === 'granted') return 'granted';
    if (status === 'denied') return 'denied';
    return 'undetermined';
  } catch {
    return 'denied';
  }
}

/** 请求通知权限；返回最终是否已授权 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNativeApp) return false;
  try {
    const Notifications = await getNotificationsModule();
    const current = await Notifications.getPermissionsAsync();
    if (current.status === 'granted') return true;

    const requested = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
    return requested.status === 'granted';
  } catch {
    return false;
  }
}

/** 打开系统设置，便于用户关闭通知（App 内无法直接撤销系统权限） */
export async function openAppNotificationSettings(): Promise<void> {
  if (!isNativeApp) return;
  try {
    if (Platform.OS === 'ios') {
      await Linking.openURL('app-settings:');
      return;
    }
    await Linking.openSettings();
  } catch {
    await Linking.openSettings();
  }
}
