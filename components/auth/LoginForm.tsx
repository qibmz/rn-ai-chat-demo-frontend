import { AuthModeSwitch } from '@/components/auth/AuthModeSwitch';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { ApiError } from '@/lib/api/client';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAppToast } from '@/lib/hooks/useAppToast';
import { isValidEmail, isValidPassword } from '@/lib/utils/validation';
import React, { useState } from 'react';

type LoginFormProps = {
  onSwitchToRegister: () => void;
  onForgotPassword: (email: string) => void;
  onBack: () => void;
};

export function LoginForm({ onSwitchToRegister, onForgotPassword, onBack }: LoginFormProps) {
  const { login } = useAuth();
  const toast = useAppToast();
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
            <Text className="text-2xl font-bold text-neutral-950">欢迎回来</Text>
            <Text className="text-sm text-neutral-500">使用邮箱登录继续</Text>
          </VStack>

          <AuthModeSwitch
            mode="login"
            onChange={(mode) => {
              if (mode === 'register') onSwitchToRegister();
            }}
          />

          <VStack className="gap-3">
            <Input className="h-12 rounded-2xl border-neutral-200 bg-neutral-50 px-4">
              <InputField
                value={email}
                onChangeText={setEmail}
                placeholder="邮箱"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                className="text-base text-neutral-900"
              />
            </Input>
            <Input className="h-12 rounded-2xl border-neutral-200 bg-neutral-50 px-4">
              <InputField
                value={password}
                onChangeText={setPassword}
                placeholder="密码（至少 8 位）"
                secureTextEntry
                textContentType="password"
                className="text-base text-neutral-900"
              />
            </Input>
            <Pressable onPress={() => onForgotPassword(email.trim())} className="self-end py-1">
              <Text className="text-sm text-neutral-500">忘记密码？</Text>
            </Pressable>
          </VStack>
        </VStack>
      </VStack>

      <VStack className="w-full max-w-100 gap-3 self-center pt-6">
        <Button
          size="lg"
          disabled={submitting}
          className="h-14 rounded-full bg-neutral-950 data-[active=true]:bg-neutral-800 data-[disabled=true]:opacity-60 data-[hover=true]:bg-neutral-800"
          onPress={onSubmit}>
          {submitting ? <ButtonSpinner color="#fff" /> : null}
          <ButtonText className="text-base font-semibold text-white">登录</ButtonText>
        </Button>
        <Pressable onPress={onBack} className="items-center py-2">
          <Text className="text-sm text-neutral-500">返回</Text>
        </Pressable>
        <Text className="px-2 text-center text-xs leading-5 text-neutral-400">
          演示账号可使用后端 seed：admin@example.com / password123
        </Text>
      </VStack>
    </VStack>
  );
}
