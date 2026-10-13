import { createAppQueryClient } from '@/lib/query/client';
import { focusManager, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { AppState, Platform, type AppStateStatus } from 'react-native';

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

/** 挂 AppState → TanStack focus，便于前后台回来自动 refetch stale 查询 */
function useReactQueryAppFocus() {
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const sub = AppState.addEventListener('change', onAppStateChange);
    return () => sub.remove();
  }, []);
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(createAppQueryClient);
  useReactQueryAppFocus();

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
