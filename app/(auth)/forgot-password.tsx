import { AuthShell } from '@/components/auth/AuthShell';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function ForgotPasswordScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();

  return (
    <AuthShell compactLogo>
      <ForgotPasswordForm
        initialEmail={typeof email === 'string' ? email : ''}
        onBackToLogin={() => router.back()}
      />
    </AuthShell>
  );
}
