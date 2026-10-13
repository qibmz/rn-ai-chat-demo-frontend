import { fetchChatQuota } from '@/lib/api/chat';
import type { ChatQuota } from '@/lib/api/types';
import { useAuth } from '@/lib/auth/AuthProvider';
import {
  daysUntilQuotaReset,
  formatQuotaResetHint,
  quotaProgressValue,
  quotaUsedPercentLabel,
} from '@/lib/chat/quota/format';
import { queryKeys } from '@/lib/query/keys';
import { queryOptions, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect } from 'react';

export type ChatQuotaView = {
  /** 展示用已用百分比文案，如 `68%`（可 >100%） */
  usedPercentLabel: string;
  /** 进度条用 0–100 */
  progressValue: number;
  /** 距重置整天数（至少 0） */
  daysUntilReset: number;
  /** 重置提示，如 `3 天后重置` */
  resetHint: string;
  quota: ChatQuota | null;
  loading: boolean;
  error: boolean;
  refresh: () => Promise<void>;
};

/** `GET /chat/quota` 的 query 定义，便于 prefetch / invalidate 复用 */
export function chatQuotaQueryOptions(enabled: boolean) {
  return queryOptions({
    queryKey: queryKeys.chat.quota(),
    queryFn: () => fetchChatQuota({ hideToast: true }),
    enabled,
    staleTime: 30_000,
  });
}

/** 发消息后 / 收到 429 后调用，强制刷新额度缓存 */
export function invalidateChatQuota(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: queryKeys.chat.quota() });
}

/** 拉取并缓存本周额度；进页 / 回前台时按 stale 策略刷新。 */
export function useChatQuota(): ChatQuotaView {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data, isPending, isFetching, isError, isStale, refetch } = useQuery(
    chatQuotaQueryOptions(isAuthenticated)
  );

  useEffect(() => {
    if (!isAuthenticated) {
      queryClient.removeQueries({ queryKey: queryKeys.chat.quota() });
    }
  }, [isAuthenticated, queryClient]);

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated || !isStale) return;
      void refetch();
    }, [isAuthenticated, isStale, refetch])
  );

  const quota = data ?? null;

  return {
    usedPercentLabel: quota ? quotaUsedPercentLabel(quota.usedPercent) : '—',
    progressValue: quota ? quotaProgressValue(quota.usedPercent) : 0,
    daysUntilReset: quota ? daysUntilQuotaReset(quota.resetsInSeconds) : 0,
    resetHint: formatQuotaResetHint(quota),
    quota,
    loading: isPending || (isFetching && !quota),
    error: isError,
    refresh: async () => {
      await refetch();
    },
  };
}
