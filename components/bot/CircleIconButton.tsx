import { Box } from '@/components/ui/box';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import React from 'react';
import type { ComponentProps } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

type IconComponent = ComponentProps<typeof Icon>['as'];

type CircleIconButtonProps = {
  icon: IconComponent;
  accessibilityLabel: string;
  size?: number;
  /** 图标色，默认 text-foreground */
  iconClassName?: string;
} & Omit<ComponentProps<typeof Pressable>, 'children' | 'accessibilityLabel'>;

/** Grok 式浮层圆钮：浅底 + 轻阴影；可透传 Menu trigger 的 props */
export function CircleIconButton({
  icon,
  accessibilityLabel,
  size = 40,
  iconClassName = 'text-foreground',
  className,
  style,
  ...pressableProps
}: CircleIconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      className={`bg-card items-center justify-center rounded-full data-[active=true]:opacity-85 data-[hover=true]:opacity-90 ${className ?? ''}`}
      style={(state: { pressed?: boolean }) => {
        const resolved: StyleProp<ViewStyle> =
          typeof style === 'function' ? style(state as never) : (style as StyleProp<ViewStyle>);
        return [styles.shadow, { width: size, height: size }, resolved];
      }}
      {...pressableProps}>
      <Box className="items-center justify-center">
        <Icon as={icon} size="md" className={iconClassName} />
      </Box>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});
