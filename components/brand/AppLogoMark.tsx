import { AppLogoChrome } from '@/components/brand/AppLogoChrome';
import React from 'react';
import Svg, { Circle } from 'react-native-svg';

export type AppLogoMarkProps = {
  size?: number;
  /** 眼睛垂直缩放，用于眨眼（1 = 睁眼） */
  eyeScaleY?: number;
  /** 眼睛水平微移 */
  eyeOffsetX?: number;
  color?: string;
  eyeColor?: string;
};

/** 牛马静态几何标：牛角 + 马耳 + 圆眼 + 浅笑 */
export function AppLogoMark({
  size = 48,
  eyeScaleY = 1,
  eyeOffsetX = 0,
  color = '#0A0A0A',
  eyeColor = '#FFFFFF',
}: AppLogoMarkProps) {
  const ry = 9 * Math.max(0.08, eyeScaleY);

  return (
    <Svg width={size} height={size} viewBox="0 0 128 128" fill="none">
      <AppLogoChrome color={color} eyeColor={eyeColor} />
      <Circle cx={48 + eyeOffsetX} cy="64" r={ry} fill={eyeColor} />
      <Circle cx={80 + eyeOffsetX} cy="64" r={ry} fill={eyeColor} />
    </Svg>
  );
}
