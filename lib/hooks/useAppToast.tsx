import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';
import React, { useCallback } from 'react';

export type AppToastAction = 'error' | 'success' | 'info' | 'warning' | 'muted';

type ShowAppToastOptions = {
  title: string;
  description?: string;
  action?: AppToastAction;
  duration?: number;
  placement?: 'top' | 'bottom' | 'top right' | 'top left' | 'bottom left' | 'bottom right';
};

/** 业务侧统一 toast：封装 gluestack `useToast` 的常用展示。 */
export function useAppToast() {
  const toast = useToast();

  const show = useCallback(
    ({
      title,
      description,
      action = 'info',
      duration = 3200,
      placement = 'top',
    }: ShowAppToastOptions) => {
      toast.show({
        placement,
        duration,
        render: ({ id }: { id: string }) => (
          <Toast
            nativeID={`toast-${id}`}
            action={action}
            variant="outline"
            className="mx-4 mt-2 max-w-100 min-w-70 self-center">
            <ToastTitle>{title}</ToastTitle>
            {description ? <ToastDescription>{description}</ToastDescription> : null}
          </Toast>
        ),
      });
    },
    [toast]
  );

  return { show };
}
