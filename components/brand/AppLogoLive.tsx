import { AppLogoChrome } from '@/components/brand/AppLogoChrome';
import React, { useEffect } from 'react';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type AppLogoLiveProps = {
  size?: number;
  color?: string;
  eyeColor?: string;
};

/** 页面内动态品牌标：轻浮 + 眨眼 + 眼神微移 */
export function AppLogoLive({
  size = 48,
  color = '#0A0A0A',
  eyeColor = '#FFFFFF',
}: AppLogoLiveProps) {
  const floatY = useSharedValue(0);
  const eyeScaleY = useSharedValue(1);
  const eyeOffsetX = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(3, { duration: 1400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    eyeScaleY.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2400 }),
        withTiming(0.12, { duration: 90 }),
        withTiming(1, { duration: 120 }),
        withTiming(1, { duration: 1800 }),
        withTiming(0.12, { duration: 80 }),
        withTiming(1, { duration: 90 }),
        withTiming(0.12, { duration: 80 }),
        withTiming(1, { duration: 120 })
      ),
      -1,
      false
    );

    eyeOffsetX.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(2.5, { duration: 900, easing: Easing.inOut(Easing.quad) }),
          withTiming(-2, { duration: 1100, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 800, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 1600 })
        ),
        -1,
        false
      )
    );
  }, [eyeOffsetX, eyeScaleY, floatY]);

  const wrapStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const leftEyeProps = useAnimatedProps(() => ({
    r: 9 * Math.max(0.08, eyeScaleY.value),
    cx: 48 + eyeOffsetX.value,
  }));

  const rightEyeProps = useAnimatedProps(() => ({
    r: 9 * Math.max(0.08, eyeScaleY.value),
    cx: 80 + eyeOffsetX.value,
  }));

  return (
    <Animated.View style={[{ width: size, height: size }, wrapStyle]}>
      <Svg width={size} height={size} viewBox="0 0 128 128" fill="none">
        <AppLogoChrome color={color} eyeColor={eyeColor} />
        <AnimatedCircle animatedProps={leftEyeProps} cy="64" fill={eyeColor} />
        <AnimatedCircle animatedProps={rightEyeProps} cy="64" fill={eyeColor} />
      </Svg>
    </Animated.View>
  );
}
