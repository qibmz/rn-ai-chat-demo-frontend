import { configureApiErrorToast } from '@/lib/api/toastBridge';
import { useAppToast } from '@/lib/hooks/useAppToast';
import { useEffect } from 'react';

/** 把 useAppToast 挂到 api client，失败默认由请求层 toast。 */
export function ApiToastBridge() {
  const toast = useAppToast();

  useEffect(() => {
    configureApiErrorToast((message) => {
      toast.show({ title: message, action: 'error' });
    });
    return () => configureApiErrorToast(null);
  }, [toast]);

  return null;
}
