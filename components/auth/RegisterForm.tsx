import { AuthField } from '@/components/auth/AuthField';
import { AuthModeSwitch, type AuthMode } from '@/components/auth/AuthModeSwitch';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { ApiError } from '@/lib/api/client';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAppToast } from '@/lib/hooks/useAppToast';
import { useThemePreference } from '@/lib/theme/ThemeProvider';
import { getPrimarySpinnerColor } from '@/lib/theme/spinnerColor';
import { isValidEmail, isValidPassword } from '@/lib/utils/validation';
import { goBackOr } from '@/lib/navigation/goBack';
import { router } from 'expo-router';
import React, { useState } from 'react';

type RegisterFormProps = {
  onModeChange: (mode: AuthMode) => void;
};

export function RegisterForm({ onModeChange }: RegisterFormProps) {
  const { register } = useAuth();
  const toast = useAppToast();
  const { preference, resolved } = useThemePreference();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    if (password !== confirmPassword) {
      toast.show({ title: '两次输入的密码不一致', action: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      await register(normalizedEmail, password);
      toast.show({
        title: '注册成功',
        description: '如需验证邮箱，请查收确认邮件',
        action: 'success',
      });
      router.replace('/home');
    } catch (error) {
      const message = error instanceof ApiError ? error.message : '操作失败，请稍后重试';
      toast.show({ title: '注册失败', description: message, action: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <VStack className="w-full flex-1 justify-between">
      <VStack className="flex-1 items-center justify-center gap-5">
        <VStack className="w-full max-w-100 gap-5">
          <VStack className="items-center gap-1">
            <Text className="text-foreground text-2xl font-bold">创建账号</Text>
            <Text className="text-muted-foreground text-sm">使用邮箱注册，开启对话</Text>
          </VStack>

          <AuthModeSwitch mode="register" onChange={onModeChange} />

          <VStack className="gap-3">
            <AuthField
              value={email}
              onChangeText={setEmail}
              placeholder="邮箱"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
            />
            <AuthField
              value={password}
              onChangeText={setPassword}
              placeholder="密码（至少 8 位）"
              secureTextEntry
              textContentType="newPassword"
            />
            <AuthField
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="确认密码"
              secureTextEntry
              textContentType="newPassword"
            />
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
          <ButtonText className="text-primary-foreground text-base font-semibold">注册</ButtonText>
        </Button>
        <Pressable onPress={() => goBackOr('/welcome')} className="items-center py-2">
          <Text className="text-muted-foreground text-sm">返回</Text>
        </Pressable>
        <Text className="text-muted-foreground px-2 text-center text-xs leading-5">
          注册后会发送邮箱确认邮件；未开启强制验证时也可先登录使用。
        </Text>
      </VStack>
    </VStack>
  );
}
