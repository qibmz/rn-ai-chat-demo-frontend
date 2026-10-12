import type { ChatTransport, UIMessage, UIMessageChunk } from 'ai';

function getLastUserSummary(messages: UIMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  if (!lastUser) return '';
  const text = lastUser.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text)
    .join('');
  const fileCount = lastUser.parts.filter((part) => part.type === 'file').length;
  if (text.trim() && fileCount > 0) return `${text.trim()}（含 ${fileCount} 个附件）`;
  if (fileCount > 0) return `发来了 ${fileCount} 个附件`;
  return text;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 后端未就绪时的演示 Transport：本地流式回显，协议对齐 AI SDK UIMessageChunk */
export function createMockChatTransport(): ChatTransport {
  return {
    async sendMessages({ messages }) {
      const userText = getLastUserSummary(messages);
      const reply = userText.trim()
        ? `（演示回复）已收到：${userText.trim()}`
        : '（演示回复）你好，后端接入 AI SDK 后这里会变成真实流式回答。';
      const messageId = `assistant-${Date.now()}`;
      const textId = `text-${Date.now()}`;

      return new ReadableStream<UIMessageChunk>({
        async start(controller) {
          controller.enqueue({ type: 'start', messageId });
          controller.enqueue({ type: 'text-start', id: textId });

          for (const char of reply) {
            controller.enqueue({ type: 'text-delta', id: textId, delta: char });
            await delay(10);
          }

          controller.enqueue({ type: 'text-end', id: textId });
          controller.enqueue({ type: 'finish', finishReason: 'stop' });
          controller.close();
        },
      });
    },
    async reconnectToStream() {
      return null;
    },
  };
}
