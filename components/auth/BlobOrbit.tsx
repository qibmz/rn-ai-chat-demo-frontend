import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type BlobSpec = {
  color: string;
  angle: number;
  radius: number;
  size: number;
  shape: 'circle' | 'squircle' | 'hex' | 'cloud';
  eyes: 'dots' | 'slash';
};

const BLOBS: BlobSpec[] = [
  { color: '#22C55E', angle: -90, radius: 1, size: 54, shape: 'circle', eyes: 'dots' },
  { color: '#EC4899', angle: -50, radius: 1.05, size: 48, shape: 'squircle', eyes: 'slash' },
  { color: '#92400E', angle: -10, radius: 1.1, size: 44, shape: 'circle', eyes: 'dots' },
  { color: '#DC2626', angle: 30, radius: 1.02, size: 50, shape: 'cloud', eyes: 'slash' },
  { color: '#14B8A6', angle: 70, radius: 1.08, size: 46, shape: 'circle', eyes: 'dots' },
  { color: '#F97316', angle: 110, radius: 1.0, size: 52, shape: 'squircle', eyes: 'slash' },
  { color: '#2563EB', angle: 150, radius: 1.06, size: 48, shape: 'hex', eyes: 'dots' },
  { color: '#A78BFA', angle: 190, radius: 1.12, size: 42, shape: 'circle', eyes: 'slash' },
  { color: '#F59E0B', angle: 230, radius: 1.04, size: 50, shape: 'cloud', eyes: 'dots' },
];

function BlobFace({ color, size, shape, eyes }: BlobSpec) {
  const radius =
    shape === 'circle'
      ? size / 2
      : shape === 'squircle'
        ? size * 0.32
        : shape === 'hex'
          ? size * 0.22
          : size * 0.4;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: color,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: size * 0.12,
      }}>
      {eyes === 'dots' ? (
        <>
          <View
            style={{
              width: size * 0.14,
              height: size * 0.14,
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.95)',
            }}
          />
          <View
            style={{
              width: size * 0.14,
              height: size * 0.14,
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.95)',
            }}
          />
        </>
      ) : (
        <>
          <View
            style={{
              width: size * 0.08,
              height: size * 0.22,
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.95)',
              transform: [{ rotate: '-18deg' }],
            }}
          />
          <View
            style={{
              width: size * 0.08,
              height: size * 0.22,
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.95)',
              transform: [{ rotate: '18deg' }],
            }}
          />
        </>
      )}
    </View>
  );
}

type BlobOrbitProps = {
  compact?: boolean;
};

/**
 * 登录装饰：矢量小球定位 + 整组一路轻浮（避免原先 9 路 Reanimated 掉帧）。
 */
export function BlobOrbit({ compact = false }: BlobOrbitProps) {
  const orbit = compact ? 118 : 148;
  const box = orbit * 2 + 64;
  const floatY = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        withTiming(5, { duration: 2200, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [floatY]);

  const groupStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <Animated.View
      style={[
        { width: box, height: box, alignItems: 'center', justifyContent: 'center' },
        groupStyle,
      ]}>
      {BLOBS.map((blob) => {
        const rad = ((blob.angle - 90) * Math.PI) / 180;
        const r = orbit * blob.radius * (compact ? 0.82 : 1);
        const x = Math.cos(rad) * r;
        const y = Math.sin(rad) * r;
        const size = blob.size * (compact ? 0.78 : 1);
        return (
          <View
            key={`${blob.color}-${blob.angle}`}
            style={{
              position: 'absolute',
              left: box / 2 + x - size / 2,
              top: box / 2 + y - size / 2,
            }}>
            <BlobFace {...blob} size={size} />
          </View>
        );
      })}
    </Animated.View>
  );
}
