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

/** 登录表单字段 + 底部 CTA（标题 / Tab 由 login 页常驻托管） */
export function LoginForm() {
  const { login } = useAuth();
  const toast = useAppToast();
  const { preference, resolved } = useThemePreference();
  // 默认回填后端 seed，方便本地 / 演示联调
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
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
          textContentType="password"
        />
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

      <VStack className="gap-3 pt-1">
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
        <Pressable onPress={() => goBackOr('/welcome')} className="items-center py-2">
          <Text className="text-muted-foreground text-sm">返回</Text>
        </Pressable>
        <Text className="text-muted-foreground px-2 text-center text-xs leading-5">
          演示账号可使用后端 seed：admin@example.com / password123
        </Text>
      </VStack>
    </VStack>
  );
}
