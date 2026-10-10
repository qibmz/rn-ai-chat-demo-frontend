import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAuth } from '@/lib/auth/AuthProvider';
import { APP_NAME } from '@/lib/config';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  return (
    <Box
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <VStack className="flex-1 justify-between px-6 py-8">
        <VStack className="gap-3 pt-10">
          <Text className="text-sm font-medium text-neutral-400">{APP_NAME}</Text>
          <Text className="text-3xl font-bold text-neutral-950">已登录</Text>
          <Text className="text-base text-neutral-600">{user?.email}</Text>
          <Text className="text-sm text-neutral-400">
            邮箱状态：{user?.emailVerified ? '已验证' : '未验证'}
          </Text>
        </VStack>

        <Button
          size="lg"
          variant="outline"
          className="h-14 rounded-full border-neutral-200"
          onPress={() => {
            void logout();
          }}>
          <ButtonText className="text-base font-semibold text-neutral-900">退出登录</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
