import { FrostedHeader, useFrostedHeaderContentInset } from '@/components/layout/FrostedHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { LogoutConfirmDialog } from '@/components/profile/LogoutConfirmDialog';
import { NativeDeviceSettings } from '@/components/profile/NativeDeviceSettings';
import { ProfileFooter } from '@/components/profile/ProfileFooter';
import { ProfileMenuRow } from '@/components/profile/ProfileMenuRow';
import { UserAvatar } from '@/components/profile/UserAvatar';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { GlobeIcon, HelpCircleIcon, LockIcon, MoonIcon, RepeatIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAuth } from '@/lib/auth/AuthProvider';
import { isNativeApp } from '@/lib/device/platform';
import { useAppToast } from '@/lib/hooks/useAppToast';
import { useThemePreference } from '@/lib/theme/ThemeProvider';
import { THEME_PREFERENCE_OPTIONS } from '@/lib/theme/types';
import { useChatQuota } from '@/lib/chat/quota';
import { getDisplayNameFromEmail } from '@/lib/utils/userDisplay';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerInset = useFrostedHeaderContentInset();
  const { user, logout } = useAuth();
  const { show } = useAppToast();
  const { preference } = useThemePreference();
  const { usedPercentLabel } = useChatQuota();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const displayName = getDisplayNameFromEmail(user?.email);
  const appearanceHint =
    THEME_PREFERENCE_OPTIONS.find((item) => item.value === preference)?.label ?? '跟随系统';

  const soon = (title: string) => {
    show({ title, description: '功能即将开放', action: 'info' });
  };

  const confirmLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      setLogoutOpen(false);
      router.replace('/welcome');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <Box className="bg-background flex-1">
      <Box className="bg-muted/40 absolute inset-x-0 top-0 h-72" />

      <ScrollView
        className="z-0 flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: headerInset + 8,
          paddingBottom: Math.max(insets.bottom, 28),
        }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}>
        <ScreenContainer variant="settings" className="flex-1 px-5">
          <VStack className="w-full flex-1" space="md">
            <VStack className="items-center pt-2 pb-6" space="lg">
              <UserAvatar
                email={user?.email}
                className="h-24 w-24"
                textClassName="text-3xl"
                ringed
              />
              <VStack className="items-center" space="sm">
                <Heading size="2xl" className="text-foreground text-center">
                  {displayName}
                </Heading>
                <Text size="sm" className="text-muted-foreground text-center">
                  {user?.email}
                </Text>
                <Badge variant="outline" className="mt-1 rounded-full px-3">
                  <BadgeText className="tracking-normal normal-case">
                    {user?.emailVerified ? '邮箱已验证' : '邮箱未验证'}
                  </BadgeText>
                </Badge>
              </VStack>
            </VStack>

            <Text size="xs" className="text-muted-foreground px-1">
              账号
            </Text>
            <VStack className="border-border/80 bg-card overflow-hidden rounded-3xl border">
              <ProfileMenuRow
                label="用量"
                hint={usedPercentLabel}
                icon={RepeatIcon}
                onPress={() => router.push('/usage')}
                showDivider={false}
              />
            </VStack>

            <Text size="xs" className="text-muted-foreground px-1">
              偏好设置
            </Text>
            <VStack className="border-border/80 bg-card overflow-hidden rounded-3xl border">
              <ProfileMenuRow
                label="外观"
                hint={appearanceHint}
                icon={MoonIcon}
                onPress={() => router.push('/appearance')}
              />
              {isNativeApp ? <NativeDeviceSettings /> : null}
              <ProfileMenuRow
                label="语言"
                hint="简体中文"
                icon={GlobeIcon}
                onPress={() => soon('语言')}
              />
              <ProfileMenuRow
                label="数据与隐私"
                hint="账号与本地数据"
                icon={LockIcon}
                onPress={() => soon('数据与隐私')}
              />
              <ProfileMenuRow
                label="帮助与反馈"
                hint="使用问题与建议"
                icon={HelpCircleIcon}
                onPress={() => soon('帮助与反馈')}
                showDivider={false}
              />
            </VStack>

            <Button
              variant="ghost"
              size="lg"
              className="self-stretch rounded-full"
              onPress={() => setLogoutOpen(true)}>
              <ButtonText className="text-destructive">退出登录</ButtonText>
            </Button>

            <Box className="mt-auto">
              <ProfileFooter />
            </Box>
          </VStack>
        </ScreenContainer>
      </ScrollView>

      <FrostedHeader fallbackHref="/home" backVariant="close" />

      <LogoutConfirmDialog
        isOpen={logoutOpen}
        isLoggingOut={loggingOut}
        onClose={() => {
          if (!loggingOut) setLogoutOpen(false);
        }}
        onConfirm={() => {
          void confirmLogout();
        }}
      />
    </Box>
  );
}
