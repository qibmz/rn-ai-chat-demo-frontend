import { AppLogoLive } from '@/components/brand/AppLogoLive';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { getAppVersionLabel } from '@/lib/appVersion';
import { APP_NAME } from '@/lib/config';
import { useThemePreference } from '@/lib/theme/ThemeProvider';
import React from 'react';

type ProfileFooterProps = {
  logoSize?: number;
};

/** 个人中心底部：动态 logo + 应用名 + 版本号 */
export function ProfileFooter({ logoSize = 40 }: ProfileFooterProps) {
  const { resolved } = useThemePreference();
  const markColor = resolved === 'dark' ? '#FAFAFA' : '#0A0A0A';
  const eyeColor = resolved === 'dark' ? '#0A0A0A' : '#FFFFFF';

  return (
    <VStack className="items-center py-10" space="sm">
      <AppLogoLive size={logoSize} color={markColor} eyeColor={eyeColor} />
      <VStack className="items-center" space="xs">
        <Text size="sm" bold className="text-foreground">
          {APP_NAME}
        </Text>
        <Text size="xs" className="text-muted-foreground">
          {getAppVersionLabel()}
        </Text>
      </VStack>
    </VStack>
  );
}
