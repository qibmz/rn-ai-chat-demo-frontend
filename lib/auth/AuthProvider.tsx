import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '@/lib/api/auth';
import { ApiError, configureApiAuth } from '@/lib/api/client';
import type { TokenPair, UserProfile } from '@/lib/api/types';
import { clearTokens, loadTokens, saveTokens } from '@/lib/auth/storage';

type AuthContextValue = {
  user: UserProfile | null;
  tokens: TokenPair | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function bootstrapSession(): Promise<{ tokens: TokenPair; user: UserProfile } | null> {
  const stored = await loadTokens();
  if (!stored) return null;

  // 先挂上 token，让 /auth/me 能自动带 Authorization，并在 401 时走 refresh
  configureApiAuth({
    getAccessToken: async () => (await loadTokens())?.accessToken ?? null,
    getRefreshToken: async () => (await loadTokens())?.refreshToken ?? null,
    setTokens: saveTokens,
    clearSession: clearTokens,
  });

  try {
    const user = await authApi.fetchMe();
    const tokens = (await loadTokens()) ?? stored;
    return { tokens, user };
  } catch (error) {
    // 仅 401（未登录 / 刷新失败后的失效）清本地 token；网络错误、5xx 等保留以便重试
    if (error instanceof ApiError && error.isUnauthorized) {
      await clearTokens();
    }
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tokens, setTokens] = useState<TokenPair | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(async () => {
    await clearTokens();
    setTokens(null);
    setUser(null);
  }, []);

  const persistTokens = useCallback(async (next: TokenPair) => {
    await saveTokens(next);
    setTokens(next);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const session = await bootstrapSession();
        if (cancelled) return;
        if (session) {
          setTokens(session.tokens);
          setUser(session.user);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 会话变化时同步给 api client（401 刷新 / 自动 Authorization）
  useEffect(() => {
    configureApiAuth({
      getAccessToken: async () => tokens?.accessToken ?? (await loadTokens())?.accessToken ?? null,
      getRefreshToken: async () =>
        tokens?.refreshToken ?? (await loadTokens())?.refreshToken ?? null,
      setTokens: persistTokens,
      clearSession,
    });
  }, [tokens, persistTokens, clearSession]);

  useEffect(() => {
    return () => configureApiAuth(null);
  }, []);

  const applyTokens = useCallback(
    async (next: TokenPair) => {
      await persistTokens(next);
      const profile = await authApi.fetchMe();
      setUser(profile);
    },
    [persistTokens]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const next = await authApi.login(email.trim(), password);
      await applyTokens(next);
    },
    [applyTokens]
  );

  const register = useCallback(
    async (email: string, password: string) => {
      const next = await authApi.register(email.trim(), password);
      await applyTokens(next);
    },
    [applyTokens]
  );

  const logout = useCallback(async () => {
    const refreshToken = tokens?.refreshToken;
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch {
      // still clear local session
    } finally {
      await clearSession();
    }
  }, [tokens?.refreshToken, clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      tokens,
      isLoading,
      isAuthenticated: Boolean(user && tokens),
      login,
      register,
      logout,
    }),
    [user, tokens, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth 必须在 AuthProvider 内使用');
  }
  return ctx;
}
