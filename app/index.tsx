import { Box } from '@/components/ui/box';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/lib/auth/AuthProvider';
import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <Box className="bg-background flex-1 items-center justify-center">
        <Spinner size="large" />
      </Box>
    );
  }

  return <Redirect href={isAuthenticated ? '/home' : '/welcome'} />;
}
