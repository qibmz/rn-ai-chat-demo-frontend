/** API base URL — set EXPO_PUBLIC_API_URL in .env */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3000';

/**
 * AI SDK 聊天流式端点（后端准备用 AI SDK 对齐）。
 * 可用 EXPO_PUBLIC_CHAT_API_URL 覆盖完整 URL。
 */
export const CHAT_API_URL =
  process.env.EXPO_PUBLIC_CHAT_API_URL?.trim() || `${API_BASE_URL}/api/chat`;

/**
 * 是否使用本地 mock 流式回复。
 * 默认开启；后端就绪后设 EXPO_PUBLIC_CHAT_MOCK=0。
 */
export const isChatMockEnabled = process.env.EXPO_PUBLIC_CHAT_MOCK !== '0';

/** Product display name — align with backend APP_NAME */
export const APP_NAME = process.env.EXPO_PUBLIC_APP_NAME?.trim() || '牛马';

export const APP_TAGLINE = '全天候的 Bot 团队，替你把事情做完';
