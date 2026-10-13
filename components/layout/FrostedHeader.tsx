import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Box } from '@/components/ui/box';
import { ArrowLeftIcon, CloseIcon, Icon } from '@/components/ui/icon';
import { GlassView } from '@/components/ui/liquid-glass';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { goBackOr } from '@/lib/navigation/goBack';
import { useThemePreference } from '@/lib/theme/ThemeProvider';
import type { Href } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** 顶栏内容区高度（不含安全区） */
export const FROSTED_HEADER_BAR_HEIGHT = 56;

type FrostedHeaderProps = {
  /** 自定义返回；默认 goBackOr(fallbackHref) */
  onBack?: () => void;
  /** 无历史栈时的去向 */
  fallbackHref?: Href;
  /** close：圆形 X（设置页）；back：返回箭头 */
  backVariant?: 'close' | 'back';
  title?: string;
  accessibilityLabel?: string;
  /** 返回钮右侧主内容（如搜索框）；有则不再渲染 title */
  center?: React.ReactNode;
  /** 右侧操作区 */
  trailing?: React.ReactNode;
};

/**
 * Grok 式毛玻璃顶栏：半透明 + blur，内容从下方滚过时形成遮罩。
 * Web：backdrop-blur；原生：expo-glass-effect。
 */
export function FrostedHeader({
  onBack,
  fallbackHref = '/home',
  backVariant = 'close',
  title,
  accessibilityLabel,
  center,
  trailing,
}: FrostedHeaderProps) {
  const insets = useSafeAreaInsets();
  const { resolved } = useThemePreference();
  const label = accessibilityLabel ?? (backVariant === 'close' ? '关闭' : '返回');

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    goBackOr(fallbackHref);
  };

  return (
    <Box
      pointerEvents="box-none"
      className="absolute inset-x-0 top-0 z-20"
      style={{ paddingTop: insets.top }}>
      <GlassView
        className="bg-background/80 web:backdrop-blur-xl w-full overflow-hidden"
        glassEffectStyle="regular"
        colorScheme={resolved}>
        <Box className="bg-background/40 h-14 w-full justify-center px-2">
          <ScreenContainer variant="settings" className="flex-row items-center gap-2 px-1">
            <Pressable
              onPress={handleBack}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={label}
              className="bg-card h-10 w-10 items-center justify-center rounded-full data-[active=true]:opacity-90 data-[hover=true]:opacity-90"
              style={styles.closeButton}>
              <Icon
                as={backVariant === 'close' ? CloseIcon : ArrowLeftIcon}
                size="md"
                className="text-foreground"
              />
            </Pressable>
            {center ? (
              <Box className="min-w-0 flex-1">{center}</Box>
            ) : title ? (
              <Text size="lg" bold numberOfLines={1} className="text-foreground ml-2 shrink-0">
                {title}
              </Text>
            ) : (
              <Box className="flex-1" />
            )}
            {trailing ? <Box className="shrink-0">{trailing}</Box> : null}
          </ScreenContainer>
        </Box>
      </GlassView>
    </Box>
  );
}

/** ScrollView / 内容顶部留白，避免首屏被顶栏挡住；滚动后内容会穿过毛玻璃 */
export function useFrostedHeaderContentInset() {
  const insets = useSafeAreaInsets();
  return insets.top + FROSTED_HEADER_BAR_HEIGHT;
}

const styles = StyleSheet.create({
  closeButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
});
