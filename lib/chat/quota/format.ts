import type { ChatQuota } from '@/lib/api/types';

/** 进度条取值：软限制 >100 时视觉封顶 100 */
export function quotaProgressValue(usedPercent: number): number {
  return Math.min(100, Math.max(0, Math.round(usedPercent)));
}

/** 文案用已用百分比（可 >100） */
export function quotaUsedPercentLabel(usedPercent: number): string {
  return `${Math.round(usedPercent)}%`;
}

/** 由 `resetsInSeconds` 得到距重置天数（向上取整） */
export function daysUntilQuotaReset(resetsInSeconds: number): number {
  return Math.max(0, Math.ceil(resetsInSeconds / 86400));
}

export function formatQuotaResetHint(
  quota: ChatQuota | null,
  fallback = '每周一上海时区重置'
): string {
  if (!quota) return fallback;
  const days = daysUntilQuotaReset(quota.resetsInSeconds);
  if (days <= 0) return '即将重置';
  return `${days} 天后重置`;
}
