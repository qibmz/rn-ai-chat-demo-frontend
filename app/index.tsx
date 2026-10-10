import { AuthScreen } from '@/components/auth/AuthScreen';
import { HomeScreen } from '@/components/auth/HomeScreen';
import { Box } from '@/components/ui/box';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/lib/auth/AuthProvider';
import React from 'react';

export default function Index() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <Box className="flex-1 items-center justify-center bg-white">
        <Spinner size="large" />
      </Box>
    );
  }

  if (isAuthenticated) {
    return <HomeScreen />;
  }

  return <AuthScreen />;
}
