import { BlobOrbit } from '@/components/auth/BlobOrbit';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AuthShellProps = {
  children: React.ReactNode;
  compactLogo?: boolean;
};

/** Auth 页共用壳：安全区 + 键盘避让 + Blob 装饰 */
export function AuthShell({ children, compactLogo = false }: AuthShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <Box
      className="bg-background flex-1"
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
              <BlobOrbit compact={compactLogo} />
            </VStack>
            {children}
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </Box>
  );
}
