import { apiRequest } from '@/lib/api/client';
import type { ChatQuota } from '@/lib/api/types';

/** Protected — 自动带 JWT；401 时 refresh 后重试。 */
export function fetchChatQuota(options?: { hideToast?: boolean }) {
  return apiRequest<ChatQuota>('/chat/quota', {
    method: 'GET',
    hideToast: options?.hideToast,
  });
}
