import { Box } from '@/components/ui/box';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { useThemePreference } from '@/lib/theme/ThemeProvider';
import React from 'react';
import type { ComponentProps, ElementType } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

type CircleIconButtonProps = {
  /** gluestack createIcon 或 lucide-react-native 图标 */
  icon: ElementType;
  accessibilityLabel: string;
  /** 圆钮直径 */
  size?: number;
  /** 图标色 className */
  iconClassName?: string;
} & Omit<ComponentProps<typeof Pressable>, 'children' | 'accessibilityLabel'>;

/**
 * 浮层圆钮。背景色必须走 StyleSheet：
 * Pressable 使用 style 函数时会盖掉 className 的 bg-*，只剩可点透明热区。
 * Icon 只用 xl/lg 字面 size，禁止传 number（真机宽高会变成 0）。
 */
export function CircleIconButton({
  icon,
  accessibilityLabel,
  size = 44,
  iconClassName = 'text-foreground',
  className,
  style,
  ...pressableProps
}: CircleIconButtonProps) {
  const { resolved } = useThemePreference();
  const inverse = Boolean(className?.includes('bg-foreground'));
  const fill = inverse
    ? resolved === 'dark'
      ? '#fafafa'
      : '#0a0a0a'
    : resolved === 'dark'
      ? '#262626'
      : '#f5f5f5';
  const iconSize = size >= 48 ? 'xl' : 'lg';

  const { style: triggerStyle, ...restTriggerProps } = pressableProps as {
    style?: StyleProp<ViewStyle> | ((state: { pressed?: boolean }) => StyleProp<ViewStyle>);
  } & Record<string, unknown>;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      className={`items-center justify-center rounded-full data-[active=true]:opacity-85 data-[hover=true]:opacity-90 ${className ?? ''}`}
      {...restTriggerProps}
      style={(state: { pressed?: boolean }) => {
        const fromTrigger = typeof triggerStyle === 'function' ? triggerStyle(state) : triggerStyle;
        const resolvedStyle: StyleProp<ViewStyle> =
          typeof style === 'function' ? style(state as never) : (style as StyleProp<ViewStyle>);
        return [
          styles.shadow,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: fill,
          },
          fromTrigger,
          resolvedStyle,
          // 再次钉死尺寸与底色，防止 Menu trigger style 盖掉
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: fill,
          },
        ];
      }}>
      <Box className="items-center justify-center">
        <Icon as={icon} size={iconSize} className={iconClassName} />
      </Box>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.14,
    shadowRadius: 3,
    elevation: 3,
  },
});
