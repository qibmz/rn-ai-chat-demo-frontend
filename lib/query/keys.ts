/** 统一 queryKey，后续 chat 会话 / 消息也挂这里 */
export const queryKeys = {
  chat: {
    all: ['chat'] as const,
    quota: () => [...queryKeys.chat.all, 'quota'] as const,
  },
};
