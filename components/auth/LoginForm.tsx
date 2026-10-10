import { AuthModeSwitch, type AuthMode } from '@/components/auth/AuthModeSwitch';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { ApiError } from '@/lib/api/client';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAppToast } from '@/lib/hooks/useAppToast';
import { useThemePreference } from '@/lib/theme/ThemeProvider';
import { getPrimarySpinnerColor } from '@/lib/theme/spinnerColor';
import { isValidEmail, isValidPassword } from '@/lib/utils/validation';
import { router } from 'expo-router';
import React, { useState } from 'react';

type LoginFormProps = {
  onModeChange: (mode: AuthMode) => void;
};

export function LoginForm({ onModeChange }: LoginFormProps) {
  const { login } = useAuth();
  const toast = useAppToast();
  const { preference, resolved } = useThemePreference();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    const normalizedEmail = email.trim();
    if (!isValidEmail(normalizedEmail)) {
      toast.show({ title: '请输入有效邮箱', action: 'error' });
      return;
    }
    if (!isValidPassword(password)) {
      toast.show({ title: '密码需为 8–72 位', action: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      await login(normalizedEmail, password);
      toast.show({ title: '登录成功', action: 'success' });
      router.replace('/home');
    } catch (error) {
      const message = error instanceof ApiError ? error.message : '操作失败，请稍后重试';
      toast.show({ title: '登录失败', description: message, action: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <VStack className="w-full flex-1 justify-between">
      <VStack className="flex-1 items-center justify-center gap-5">
        <VStack className="w-full max-w-100 gap-5">
          <VStack className="items-center gap-1">
            <Text className="text-foreground text-2xl font-bold">欢迎回来</Text>
            <Text className="text-muted-foreground text-sm">使用邮箱登录继续</Text>
          </VStack>

          <AuthModeSwitch mode="login" onChange={onModeChange} />

          <VStack className="gap-3">
            <Input className="border-border bg-muted h-12 rounded-2xl px-4">
              <InputField
                value={email}
                onChangeText={setEmail}
                placeholder="邮箱"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                className="text-foreground text-base"
              />
            </Input>
            <Input className="border-border bg-muted h-12 rounded-2xl px-4">
              <InputField
                value={password}
                onChangeText={setPassword}
                placeholder="密码（至少 8 位）"
                secureTextEntry
                textContentType="password"
                className="text-foreground text-base"
              />
            </Input>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/forgot-password',
                  params: { email: email.trim() },
                })
              }
              className="self-end py-1">
              <Text className="text-muted-foreground text-sm">忘记密码？</Text>
            </Pressable>
          </VStack>
        </VStack>
      </VStack>

      <VStack className="w-full max-w-100 gap-3 self-center pt-6">
        <Button
          size="lg"
          disabled={submitting}
          className="bg-primary h-14 rounded-full data-[active=true]:opacity-90 data-[disabled=true]:opacity-60 data-[hover=true]:opacity-90"
          onPress={onSubmit}>
          {submitting ? (
            <ButtonSpinner color={getPrimarySpinnerColor(preference, resolved)} />
          ) : null}
          <ButtonText className="text-primary-foreground text-base font-semibold">登录</ButtonText>
        </Button>
        <Pressable onPress={() => router.back()} className="items-center py-2">
          <Text className="text-muted-foreground text-sm">返回</Text>
        </Pressable>
        <Text className="text-muted-foreground px-2 text-center text-xs leading-5">
          演示账号可使用后端 seed：admin@example.com / password123
        </Text>
      </VStack>
    </VStack>
  );
}
