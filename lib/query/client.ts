import { QueryClient } from '@tanstack/react-query';

export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 额度 / 列表类：短暂视为新鲜，减少切页重复请求
        staleTime: 30_000,
        // 原生切后台回来由 focusManager 触发；避免 web 窗口 focus 过激
        refetchOnWindowFocus: true,
        retry: 1,
      },
    },
  });
}
