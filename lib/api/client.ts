import { API_BASE_URL } from '@/lib/config';
import type { ApiErrorBody, ApiSuccess, TokenPair } from '@/lib/api/types';

export class ApiError extends Error {
  code: number;
  errors: string[] | null;
  path: string | null;

  constructor(
    message: string,
    code = 400,
    errors: string[] | null = null,
    path: string | null = null
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.errors = errors;
    this.path = path;
  }

  get isUnauthorized() {
    return this.code === 401;
  }
}

type AuthHandlers = {
  getAccessToken: () => string | null | Promise<string | null>;
  getRefreshToken: () => string | null | Promise<string | null>;
  setTokens: (tokens: TokenPair) => void | Promise<void>;
  clearSession: () => void | Promise<void>;
};

let authHandlers: AuthHandlers | null = null;
let refreshInFlight: Promise<boolean> | null = null;

/** AuthProvider 启动时注册；供 401 刷新与自动带 Authorization。 */
export function configureApiAuth(handlers: AuthHandlers | null) {
  authHandlers = handlers;
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  /** 不带 access token，也不做 401 刷新（login / register / refresh 等） */
  skipAuth?: boolean;
  /** 内部：已做过一次 401 刷新重试，避免死循环 */
  _retried?: boolean;
};

function isApiSuccess<T>(payload: unknown): payload is ApiSuccess<T> {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    (payload as ApiSuccess<T>).code === 200 &&
    'data' in payload
  );
}

function toApiError(payload: unknown, fallbackStatus: number): ApiError {
  if (typeof payload === 'object' && payload !== null && 'code' in payload) {
    const err = payload as Partial<ApiErrorBody>;
    return new ApiError(
      err.message || `请求失败（${err.code ?? fallbackStatus}）`,
      typeof err.code === 'number' ? err.code : fallbackStatus,
      err.errors ?? null,
      err.path ?? null
    );
  }
  return new ApiError(`请求失败（${fallbackStatus}）`, fallbackStatus);
}

async function tryRefreshSession(): Promise<boolean> {
  if (!authHandlers) return false;
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = await authHandlers!.getRefreshToken();
    if (!refreshToken) {
      await authHandlers!.clearSession();
      return false;
    }

    try {
      const next = await apiRequest<TokenPair>('/auth/refresh', {
        method: 'POST',
        body: { refreshToken },
        skipAuth: true,
      });
      await authHandlers!.setTokens(next);
      return true;
    } catch {
      await authHandlers!.clearSession();
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, skipAuth = false, _retried = false, headers, ...rest } = options;
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  let accessToken: string | null = null;
  if (!skipAuth && authHandlers) {
    accessToken = await authHandlers.getAccessToken();
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...rest,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('无法连接服务器，请检查网络或后端是否已启动', 0);
  }

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    throw new ApiError(
      response.ok ? '响应解析失败' : `请求失败（${response.status}）`,
      response.status
    );
  }

  if (isApiSuccess<T>(payload)) {
    return payload.data;
  }

  const error = toApiError(payload, response.status);

  // 对齐后端 JwtAuthGuard：401 = 未登录 / 过期；尝试 refresh 后重试一次
  if (error.isUnauthorized && !skipAuth && !_retried && authHandlers) {
    const refreshed = await tryRefreshSession();
    if (refreshed) {
      return apiRequest<T>(path, { ...options, _retried: true });
    }
  }

  throw error;
}
