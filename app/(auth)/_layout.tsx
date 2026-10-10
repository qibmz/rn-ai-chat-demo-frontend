import { Box } from '@/components/ui/box';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/lib/auth/AuthProvider';
import { Redirect, Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <Box className="bg-background flex-1 items-center justify-center">
        <Spinner size="large" />
      </Box>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
