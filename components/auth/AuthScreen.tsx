import { BlobOrbit } from '@/components/auth/BlobOrbit';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { APP_NAME, APP_TAGLINE } from '@/lib/config';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AuthView = 'welcome' | 'login' | 'register' | 'forgot';

export function AuthScreen() {
  const insets = useSafeAreaInsets();
  const [view, setView] = useState<AuthView>('welcome');
  const [forgotEmail, setForgotEmail] = useState('');

  const showForm = view !== 'welcome';

  return (
    <Box
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}>
          <VStack className="flex-1 px-6 pt-6 pb-4">
            <VStack className="items-center pt-2">
              <BlobOrbit compact={showForm} />
            </VStack>

            {view === 'login' ? (
              <LoginForm
                onSwitchToRegister={() => setView('register')}
                onForgotPassword={(email) => {
                  setForgotEmail(email);
                  setView('forgot');
                }}
                onBack={() => setView('welcome')}
              />
            ) : view === 'register' ? (
              <RegisterForm
                onSwitchToLogin={() => setView('login')}
                onBack={() => setView('welcome')}
              />
            ) : view === 'forgot' ? (
              <ForgotPasswordForm
                initialEmail={forgotEmail}
                onBackToLogin={() => setView('login')}
              />
            ) : (
              <VStack className="flex-1 justify-between">
                <VStack className="flex-1 items-center justify-center gap-3 px-4">
                  <Text className="text-center text-4xl font-bold tracking-tight text-neutral-950">
                    {APP_NAME}
                  </Text>
                  <Text className="max-w-70 text-center text-base leading-6 text-neutral-500">
                    {APP_TAGLINE}
                  </Text>
                </VStack>

                <VStack className="w-full max-w-100 gap-3 self-center pt-6">
                  <Button
                    size="lg"
                    className="h-14 rounded-full bg-neutral-950 data-[active=true]:bg-neutral-800 data-[hover=true]:bg-neutral-800"
                    onPress={() => setView('login')}>
                    <ButtonText className="text-base font-semibold text-white">
                      登录或注册
                    </ButtonText>
                  </Button>
                  <Text className="px-2 text-center text-xs leading-5 text-neutral-400">
                    使用 {APP_NAME} 即表示你另外同意这些条款。
                  </Text>
                </VStack>
              </VStack>
            )}
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </Box>
  );
}
