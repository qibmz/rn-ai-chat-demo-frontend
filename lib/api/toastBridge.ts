/** 供 api client 在非 React 上下文弹出错误；由 ApiToastBridge 注册。 */

export type ApiErrorToastFn = (message: string) => void;

let handler: ApiErrorToastFn | null = null;

export function configureApiErrorToast(fn: ApiErrorToastFn | null) {
  handler = fn;
}

export function notifyApiError(message: string) {
  handler?.(message);
}
