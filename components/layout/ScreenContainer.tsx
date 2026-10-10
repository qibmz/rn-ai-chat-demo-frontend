import { Box } from '@/components/ui/box';
import React from 'react';
import type { ViewProps } from 'react-native';

type ScreenContainerProps = {
  children: React.ReactNode;
  className?: string;
  style?: ViewProps['style'];
  /**
   * 内容最大宽度（一律水平居中，不做宽屏改布局）：
   * - form / settings：窄栏（登录、个人中心、设置）
   * - wide：略宽（首页主内容）
   */
  variant?: 'form' | 'settings' | 'wide';
};

const VARIANT_CLASS: Record<NonNullable<ScreenContainerProps['variant']>, string> = {
  form: 'w-full max-w-100 self-center',
  settings: 'w-full max-w-100 self-center',
  wide: 'w-full max-w-120 self-center',
};

/** 页面主内容宽度容器：限宽 + 居中，PC 与手机同一套纵向布局 */
export function ScreenContainer({
  children,
  className = '',
  style,
  variant = 'form',
}: ScreenContainerProps) {
  return (
    <Box className={`${VARIANT_CLASS[variant]} ${className}`} style={style}>
      {children}
    </Box>
  );
}
