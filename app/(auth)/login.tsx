import { AuthModeSwitch, type AuthMode } from '@/components/auth/AuthModeSwitch';
import { AuthShell } from '@/components/auth/AuthShell';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React, { useState } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';

/** 登录 / 注册同一路由；Tab 常驻避免重挂导致滑块闪断 */
export default function LoginScreen() {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <AuthShell compactLogo>
      <VStack className="w-full flex-1 justify-between">
        <VStack className="flex-1 items-center justify-center gap-5">
          <VStack className="w-full max-w-100 gap-5">
            <Animated.View key={`title-${mode}`} entering={FadeIn.duration(200)}>
              {mode === 'login' ? (
                <VStack className="items-center gap-1">
                  <Text className="text-foreground text-2xl font-bold">欢迎回来</Text>
                  <Text className="text-muted-foreground text-sm">使用邮箱登录继续</Text>
                </VStack>
              ) : (
                <VStack className="items-center gap-1">
                  <Text className="text-foreground text-2xl font-bold">创建账号</Text>
                  <Text className="text-muted-foreground text-sm">使用邮箱注册，开启对话</Text>
                </VStack>
              )}
            </Animated.View>

            <AuthModeSwitch mode={mode} onChange={setMode} />

            <Animated.View key={mode} entering={FadeIn.duration(200)}>
              {mode === 'login' ? <LoginForm /> : <RegisterForm />}
            </Animated.View>
          </VStack>
        </VStack>
      </VStack>
    </AuthShell>
  );
}
