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
