import { Box } from '@/components/ui/box';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/lib/auth/AuthProvider';
import { Redirect, Stack } from 'expo-router';
import React from 'react';

export default function AppLayout() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <Box className="bg-background flex-1 items-center justify-center">
        <Spinner size="large" />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/welcome" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="search" />
      <Stack.Screen name="chat/[id]" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="appearance" />
      <Stack.Screen name="usage" />
      <Stack.Screen name="create-bot" />
    </Stack>
  );
}
