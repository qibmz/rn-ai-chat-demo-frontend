import { AppLogoMark, type AppLogoMarkProps } from '@/components/brand/AppLogoMark';
import React from 'react';

type AppLogoProps = Omit<AppLogoMarkProps, 'eyeScaleY' | 'eyeOffsetX'>;

/** 静态品牌标：用于需要静止展示的场景（导出/打印等） */
export function AppLogo(props: AppLogoProps) {
  return <AppLogoMark {...props} />;
}
