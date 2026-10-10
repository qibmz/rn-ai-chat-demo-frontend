import { AuthShell } from '@/components/auth/AuthShell';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import type { AuthMode } from '@/components/auth/AuthModeSwitch';
import React, { useState } from 'react';

/** 登录 / 注册同一路由，按 mode 切换完整表单组件 */
export default function LoginScreen() {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <AuthShell compactLogo>
      {mode === 'login' ? (
        <LoginForm onModeChange={setMode} />
      ) : (
        <RegisterForm onModeChange={setMode} />
      )}
    </AuthShell>
  );
}
