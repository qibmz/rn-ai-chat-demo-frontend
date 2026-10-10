import React from 'react';
import { Path, Rect } from 'react-native-svg';

type AppLogoChromeProps = {
  color: string;
  eyeColor: string;
};

/**
 * 牛马合体标静态层：圆角脸 + 外侧短角（牛）+ 内侧竖耳（马）+ 浅笑。
 * 眼睛由 AppLogoMark / AppLogoLive 叠在上层以便动画。
 */
export function AppLogoChrome({ color, eyeColor }: AppLogoChromeProps) {
  return (
    <>
      {/* 牛角：外侧短弯角 */}
      <Path d="M34 44C22 38 12 26 16 10C28 14 38 26 46 40C42 42 38 44 34 44Z" fill={color} />
      <Path d="M94 44C106 38 116 26 112 10C100 14 90 26 82 40C86 42 90 44 94 44Z" fill={color} />
      {/* 马耳：内侧竖起尖耳 */}
      <Path d="M50 42C48 28 46 16 52 6C58 16 60 28 58 42C56 43 53 43 50 42Z" fill={color} />
      <Path d="M78 42C80 28 82 16 76 6C70 16 68 28 70 42C72 43 75 43 78 42Z" fill={color} />
      {/* 脸 */}
      <Rect x="18" y="34" width="92" height="78" rx="28" fill={color} />
      {/* 浅笑 */}
      <Path
        d="M48 90C58 100 70 100 80 90"
        stroke={eyeColor}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
    </>
  );
}
