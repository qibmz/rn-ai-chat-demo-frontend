import {
  getNotificationPermissionStatus,
  openAppNotificationSettings,
  requestNotificationPermission,
} from '@/lib/device/notifications';
import { isNativeApp } from '@/lib/device/platform';
import { useAppToast } from '@/lib/hooks/useAppToast';
import { useCallback, useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

export function useNotificationPermission() {
  const { show } = useAppToast();
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    if (!isNativeApp) return;
    const status = await getNotificationPermissionStatus();
    setEnabled(status === 'granted');
  }, []);

  useEffect(() => {
    if (!isNativeApp) return;
    let cancelled = false;
    void getNotificationPermissionStatus().then((status) => {
      if (!cancelled) setEnabled(status === 'granted');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isNativeApp) return;
    const onChange = (state: AppStateStatus) => {
      if (state === 'active') void refresh();
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [refresh]);

  const setNotificationEnabled = useCallback(
    async (next: boolean) => {
      if (!isNativeApp || busy) return;
      setBusy(true);
      try {
        if (next) {
          const granted = await requestNotificationPermission();
          setEnabled(granted);
          if (!granted) {
            show({
              title: '未获得通知权限',
              description: '可在系统设置中手动开启通知',
              action: 'warning',
            });
            await openAppNotificationSettings();
          } else {
            show({ title: '已开启通知', action: 'success' });
          }
          return;
        }

        show({
          title: '关闭通知',
          description: '请在系统设置中关闭本应用的通知权限',
          action: 'info',
        });
        await openAppNotificationSettings();
        await refresh();
      } finally {
        setBusy(false);
      }
    },
    [busy, refresh, show]
  );

  return {
    enabled,
    busy,
    setNotificationEnabled,
    refresh,
  };
}
