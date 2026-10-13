import { loadTokens } from '@/lib/auth/storage';
import { createMockChatTransport } from '@/lib/chat/mockChatTransport';
import { CHAT_API_URL, isChatMockEnabled } from '@/lib/config';
import { DefaultChatTransport, type ChatTransport, type UIMessage } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';

type CreateChatTransportOptions = {
  botId: string;
};

/**
 * 聊天传输：默认本地 mock（流式演示）；
 * 设 EXPO_PUBLIC_CHAT_MOCK=0 后走后端 AI SDK 端点 `${API}/api/chat`。
 */
export function createChatTransport({
  botId,
}: CreateChatTransportOptions): ChatTransport<UIMessage> {
  if (isChatMockEnabled) {
    return createMockChatTransport();
  }

  return new DefaultChatTransport<UIMessage>({
    api: CHAT_API_URL,
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    headers: async (): Promise<Record<string, string>> => {
      const tokens = await loadTokens();
      if (!tokens?.accessToken) return {};
      return { Authorization: `Bearer ${tokens.accessToken}` };
    },
    body: {
      botId,
    },
  });
}
