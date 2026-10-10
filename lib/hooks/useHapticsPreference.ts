import { loadHapticsEnabled, saveHapticsEnabled, triggerImpactHaptic } from '@/lib/device/haptics';
import { isNativeApp } from '@/lib/device/platform';
import { useCallback, useEffect, useState } from 'react';

export function useHapticsPreference() {
  const [enabled, setEnabled] = useState(isNativeApp);
  const [ready, setReady] = useState(!isNativeApp);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isNativeApp) return;
    let cancelled = false;
    void loadHapticsEnabled().then((value) => {
      if (!cancelled) {
        setEnabled(value);
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const setHapticsEnabled = useCallback(
    async (next: boolean) => {
      if (!isNativeApp || busy) return;
      setBusy(true);
      try {
        await saveHapticsEnabled(next);
        setEnabled(next);
        if (next) {
          try {
            const Haptics = await import('expo-haptics');
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } catch {
            // ignore
          }
        }
      } finally {
        setBusy(false);
      }
    },
    [busy]
  );

  return {
    enabled,
    ready,
    busy,
    setHapticsEnabled,
    playImpact: triggerImpactHaptic,
  };
}
