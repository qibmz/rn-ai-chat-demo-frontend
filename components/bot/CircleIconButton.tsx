import { Box } from '@/components/ui/box';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import React from 'react';
import type { ComponentProps, ElementType } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

type CircleIconButtonProps = {
  /** gluestack createIcon 或 lucide-react-native 图标 */
  icon: ElementType;
  accessibilityLabel: string;
  /** 圆钮直径（含图标按比例放大） */
  size?: number;
  /** 图标色，默认 text-foreground */
  iconClassName?: string;
} & Omit<ComponentProps<typeof Pressable>, 'children' | 'accessibilityLabel'>;

/** Grok 式浮层圆钮：浅底 + 轻阴影；可透传 Menu trigger 的 props */
export function CircleIconButton({
  icon,
  accessibilityLabel,
  size = 44,
  iconClassName = 'text-foreground',
  className,
  style,
  ...pressableProps
}: CircleIconButtonProps) {
  /** 图标约占圆钮一半，避免只放大外壳、字标仍是 18–20px */
  const glyphSize = Math.max(22, Math.round(size * 0.5));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      className={`bg-card items-center justify-center rounded-full data-[active=true]:opacity-85 data-[hover=true]:opacity-90 ${className ?? ''}`}
      style={(state: { pressed?: boolean }) => {
        const resolved: StyleProp<ViewStyle> =
          typeof style === 'function' ? style(state as never) : (style as StyleProp<ViewStyle>);
        // size 放最后，避免 Menu trigger 传入的 style 把宽高盖小
        return [styles.shadow, resolved, { width: size, height: size }];
      }}
      {...pressableProps}>
      <Box className="items-center justify-center">
        <Icon as={icon} size={glyphSize} className={iconClassName} />
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
