import { AuthField } from '@/components/auth/AuthField';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import * as authApi from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { useAppToast } from '@/lib/hooks/useAppToast';
import { useThemePreference } from '@/lib/theme/ThemeProvider';
import { getPrimarySpinnerColor } from '@/lib/theme/spinnerColor';
import { isValidEmail, isValidPassword, isValidResetCode } from '@/lib/utils/validation';
import React, { useState } from 'react';

type ForgotPasswordFormProps = {
  onBackToLogin: () => void;
  initialEmail?: string;
};

export function ForgotPasswordForm({ onBackToLogin, initialEmail = '' }: ForgotPasswordFormProps) {
  const toast = useAppToast();
  const { preference, resolved } = useThemePreference();
  const spinnerColor = getPrimarySpinnerColor(preference, resolved);
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const sendCode = async () => {
    const normalizedEmail = email.trim();
    if (!isValidEmail(normalizedEmail)) {
      toast.show({ title: '请输入有效邮箱', action: 'error' });
      return;
    }

    setSending(true);
    try {
      await authApi.forgotPassword(normalizedEmail);
      setEmail(normalizedEmail);
      setStep('reset');
      toast.show({
        title: '验证码已发送',
        description: '若邮箱已注册，请查收 8 位验证码邮件',
        action: 'success',
      });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : '操作失败，请稍后重试';
      toast.show({ title: '发送失败', description: message, action: 'error' });
    } finally {
      setSending(false);
    }
  };

  const onReset = async () => {
    const normalizedEmail = email.trim();
    const normalizedCode = code.trim();
    if (!isValidEmail(normalizedEmail)) {
      toast.show({ title: '请输入有效邮箱', action: 'error' });
      return;
    }
    if (!isValidResetCode(normalizedCode)) {
      toast.show({ title: '请输入 8 位数字验证码', action: 'error' });
      return;
    }
    if (!isValidPassword(newPassword)) {
      toast.show({ title: '新密码需为 8–72 位', action: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.show({ title: '两次输入的密码不一致', action: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      await authApi.resetPassword(normalizedEmail, normalizedCode, newPassword);
      toast.show({ title: '密码已重置', description: '请使用新密码登录', action: 'success' });
      onBackToLogin();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : '操作失败，请稍后重试';
      toast.show({ title: '重置失败', description: message, action: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <VStack className="w-full flex-1 justify-between">
      <VStack className="flex-1 items-center justify-center gap-5">
        <VStack className="w-full max-w-100 gap-5">
          <VStack className="items-center gap-1">
            <Text className="text-foreground text-2xl font-bold">忘记密码</Text>
            <Text className="text-muted-foreground text-center text-sm">
              {step === 'request' ? '输入注册邮箱，获取 8 位验证码' : '输入验证码并设置新密码'}
            </Text>
          </VStack>

          <VStack className="gap-3">
            <AuthField
              rootProps={{ isDisabled: step === 'reset' }}
              value={email}
              onChangeText={setEmail}
              placeholder="邮箱"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              editable={step === 'request'}
            />

            {step === 'reset' ? (
              <>
                <AuthField
                  value={code}
                  onChangeText={setCode}
                  placeholder="8 位验证码"
                  keyboardType="number-pad"
                  maxLength={8}
                  textContentType="oneTimeCode"
                />
                <AuthField
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="新密码（至少 8 位）"
                  secureTextEntry
                  textContentType="newPassword"
                />
                <AuthField
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="确认新密码"
                  secureTextEntry
                  textContentType="newPassword"
                />
              </>
            ) : null}
          </VStack>
        </VStack>
      </VStack>

      <VStack className="w-full max-w-100 gap-3 self-center pt-6">
        {step === 'request' ? (
          <Button
            size="lg"
            disabled={sending}
            className="bg-primary h-14 rounded-full data-[active=true]:opacity-90 data-[disabled=true]:opacity-60 data-[hover=true]:opacity-90"
            onPress={sendCode}>
            {sending ? <ButtonSpinner color={spinnerColor} /> : null}
            <ButtonText className="text-primary-foreground text-base font-semibold">
              发送验证码
            </ButtonText>
          </Button>
        ) : (
          <>
            <Button
              size="lg"
              disabled={submitting}
              className="bg-primary h-14 rounded-full data-[active=true]:opacity-90 data-[disabled=true]:opacity-60 data-[hover=true]:opacity-90"
              onPress={onReset}>
              {submitting ? <ButtonSpinner color={spinnerColor} /> : null}
              <ButtonText className="text-primary-foreground text-base font-semibold">
                重置密码
              </ButtonText>
            </Button>
            <Pressable
              disabled={sending}
              onPress={sendCode}
              className="items-center py-1 data-[disabled=true]:opacity-50">
              <Text className="text-muted-foreground text-sm">
                {sending ? '发送中…' : '重新发送验证码'}
              </Text>
            </Pressable>
            <Pressable onPress={() => setStep('request')} className="items-center py-1">
              <Text className="text-muted-foreground text-sm">修改邮箱</Text>
            </Pressable>
          </>
        )}

        <Pressable onPress={onBackToLogin} className="items-center py-2">
          <Text className="text-muted-foreground text-sm">返回登录</Text>
        </Pressable>
        <Text className="text-muted-foreground px-2 text-center text-xs leading-5">
          为防枚举，无论邮箱是否存在都会提示已受理；请以实际收件为准。
        </Text>
      </VStack>
    </VStack>
  );
}
