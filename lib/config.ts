/** API base URL — set EXPO_PUBLIC_API_URL in .env */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3000';

/** Product display name — align with backend APP_NAME */
export const APP_NAME = process.env.EXPO_PUBLIC_APP_NAME?.trim() || '牛马';

export const APP_TAGLINE = '全天候的 Bot 团队，替你把事情做完';
