import { AppLogoLive } from '@/components/brand/AppLogoLive';
import { Box } from '@/components/ui/box';
import { Icon, StarIcon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { APP_NAME } from '@/lib/config';
import { useThemePreference } from '@/lib/theme/ThemeProvider';
import React from 'react';

type BotHomeHeroProps = {
  onPress?: () => void;
};

/** 主页中心品牌：牛马动态标 + 星标 + 名称 */
export function BotHomeHero({ onPress }: BotHomeHeroProps) {
  const { resolved } = useThemePreference();
  const markColor = resolved === 'dark' ? '#FAFAFA' : '#0A0A0A';
  const eyeColor = resolved === 'dark' ? '#0A0A0A' : '#FFFFFF';

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={onPress ? '打开主 Bot 聊天' : undefined}
      className="items-center data-[active=true]:opacity-90">
      <VStack className="items-center" space="md">
        <Box className="relative">
          <AppLogoLive size={88} color={markColor} eyeColor={eyeColor} />
          <Box
            className="absolute -right-0.5 -bottom-0.5 h-7 w-7 items-center justify-center rounded-full"
            style={{ backgroundColor: '#F97316' }}>
            <Icon as={StarIcon} size="sm" className="text-primary-foreground" />
          </Box>
        </Box>
        <Text size="md" className="text-muted-foreground">
          {APP_NAME}
        </Text>
      </VStack>
    </Pressable>
  );
}
