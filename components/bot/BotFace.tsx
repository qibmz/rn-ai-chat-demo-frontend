import type { BotFaceShape } from '@/lib/bot/types';
import React from 'react';
import Svg, { Circle, Ellipse, Rect } from 'react-native-svg';

type BotFaceProps = {
  size?: number;
  color?: string;
  eyeColor?: string;
  shape?: BotFaceShape;
};

/** Grok 风格：色块脸 + 两条竖眼缝 */
export function BotFace({
  size = 48,
  color = '#0A0A0A',
  eyeColor = '#FFFFFF',
  shape = 'circle',
}: BotFaceProps) {
  const eyeW = size * 0.08;
  const eyeH = size * 0.22;
  const eyeY = size * 0.34;
  const leftX = size * 0.34;
  const rightX = size * 0.58;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {shape === 'circle' ? <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={color} /> : null}
      {shape === 'oval' ? (
        <Ellipse cx={size / 2} cy={size / 2} rx={size * 0.48} ry={size * 0.38} fill={color} />
      ) : null}
      {shape === 'squircle' ? (
        <Rect x={0} y={0} width={size} height={size} rx={size * 0.28} fill={color} />
      ) : null}
      <Rect x={leftX} y={eyeY} width={eyeW} height={eyeH} rx={eyeW / 2} fill={eyeColor} />
      <Rect x={rightX} y={eyeY} width={eyeW} height={eyeH} rx={eyeW / 2} fill={eyeColor} />
    </Svg>
  );
}
