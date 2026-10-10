import { AuthShell } from '@/components/auth/AuthShell';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { APP_NAME, APP_TAGLINE } from '@/lib/config';
import { router } from 'expo-router';
import React from 'react';

export default function WelcomeScreen() {
  return (
    <AuthShell>
      <VStack className="flex-1 justify-between">
        <VStack className="flex-1 items-center justify-center gap-3 px-4">
          <Text className="text-foreground text-center text-4xl font-bold tracking-tight">
            {APP_NAME}
          </Text>
          <Text className="text-muted-foreground max-w-70 text-center text-base leading-6">
            {APP_TAGLINE}
          </Text>
        </VStack>

        <VStack className="w-full max-w-100 gap-3 self-center pt-6">
          <Button
            size="lg"
            className="bg-primary h-14 rounded-full data-[active=true]:opacity-90 data-[hover=true]:opacity-90"
            onPress={() => router.push('/login')}>
            <ButtonText className="text-primary-foreground text-base font-semibold">
              登录或注册
            </ButtonText>
          </Button>
          <Text className="text-muted-foreground px-2 text-center text-xs leading-5">
            使用 {APP_NAME} 即表示你另外同意这些条款。
          </Text>
        </VStack>
      </VStack>
    </AuthShell>
  );
}
