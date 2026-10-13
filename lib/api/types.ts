/** Align with backend `ApiSuccessResponse` / `ApiErrorResponse`. */
export type ApiSuccess<T> = {
  code: 200;
  message: string;
  data: T;
  timestamp: string;
  path: string;
};

export type ApiErrorBody = {
  /** HTTP status / business code — 401 = 未登录或令牌失效 */
  code: number;
  message: string;
  errors: string[] | null;
  timestamp: string;
  path: string;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
};

export type UserProfile = {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
};

/** Align with backend `GET /chat/quota` → `data` */
export type ChatQuota = {
  /** 本周已用百分比（可 >100，软限制） */
  usedPercent: number;
  /** 剩余百分比（下限 0） */
  remainingPercent: number;
  /** 已用比例 0–1+ */
  usedRatio: number;
  /** 自然周标识（上海时区） */
  period: string;
  /** 下次重置 ISO 时间 */
  resetsAt: string;
  /** 距重置秒数 */
  resetsInSeconds: number;
};
