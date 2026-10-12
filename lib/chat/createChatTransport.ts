import { loadTokens } from '@/lib/auth/storage';
import { createMockChatTransport } from '@/lib/chat/mockChatTransport';
import { CHAT_API_URL, isChatMockEnabled } from '@/lib/config';
import { DefaultChatTransport, type ChatTransport } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';

type CreateChatTransportOptions = {
  botId: string;
};

/**
 * 聊天传输：默认本地 mock（流式演示）；
 * 设 EXPO_PUBLIC_CHAT_MOCK=0 后走后端 AI SDK 端点 `${API}/api/chat`。
 */
export function createChatTransport({ botId }: CreateChatTransportOptions): ChatTransport {
  if (isChatMockEnabled) {
    return createMockChatTransport();
  }

  return new DefaultChatTransport({
    api: CHAT_API_URL,
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    headers: async () => {
      const tokens = await loadTokens();
      if (!tokens?.accessToken) return {};
      return { Authorization: `Bearer ${tokens.accessToken}` };
    },
    body: {
      botId,
    },
  });
}
