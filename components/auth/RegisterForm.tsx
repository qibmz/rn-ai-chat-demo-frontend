import { AuthField } from '@/components/auth/AuthField';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAppToast } from '@/lib/hooks/useAppToast';
import { goBackOr } from '@/lib/navigation/goBack';
import { useThemePreference } from '@/lib/theme/ThemeProvider';
import { getPrimarySpinnerColor } from '@/lib/theme/spinnerColor';
import { isValidEmail, isValidPassword } from '@/lib/utils/validation';
import { router } from 'expo-router';
import React, { useState } from 'react';

/** 注册表单字段 + 底部 CTA（标题 / Tab 由 login 页常驻托管） */
export function RegisterForm() {
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
    } catch {
      // 接口错误已由 apiRequest 默认 toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <VStack className="gap-5">
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

      <VStack className="gap-3 pt-1">
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
