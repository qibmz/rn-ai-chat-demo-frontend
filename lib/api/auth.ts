import { apiRequest } from '@/lib/api/client';
import type { TokenPair, UserProfile } from '@/lib/api/types';

/** Public auth endpoints — 不带 Authorization，401 也不走 refresh。 */

export function login(email: string, password: string) {
  return apiRequest<TokenPair>('/auth/login', {
    method: 'POST',
    body: { email, password },
    skipAuth: true,
  });
}

export function register(email: string, password: string) {
  return apiRequest<TokenPair>('/auth/register', {
    method: 'POST',
    body: { email, password },
    skipAuth: true,
  });
}

export function refreshTokens(refreshToken: string) {
  return apiRequest<TokenPair>('/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
    skipAuth: true,
    hideToast: true,
  });
}

export function logout(refreshToken: string) {
  return apiRequest<{ success: boolean }>('/auth/logout', {
    method: 'POST',
    body: { refreshToken },
    skipAuth: true,
    hideToast: true,
  });
}

export function forgotPassword(email: string) {
  return apiRequest<{ success: boolean }>('/auth/forgot-password', {
    method: 'POST',
    body: { email },
    skipAuth: true,
  });
}

export function resetPassword(email: string, code: string, newPassword: string) {
  return apiRequest<{ success: boolean }>('/auth/reset-password', {
    method: 'POST',
    body: { email, code, newPassword },
    skipAuth: true,
  });
}

/** Protected — 自动带 access token；401 时 refresh 后重试。 */

export function fetchMe(options?: { hideToast?: boolean }) {
  return apiRequest<UserProfile>('/auth/me', {
    hideToast: options?.hideToast,
  });
}
