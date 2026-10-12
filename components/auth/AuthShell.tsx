import { BlobOrbit } from '@/components/auth/BlobOrbit';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AuthShellProps = {
  children: React.ReactNode;
  compactLogo?: boolean;
};

/** Auth 页共用壳：安全区 + 键盘感知滚动（KeyboardController，双端可用） */
export function AuthShell({ children, compactLogo = false }: AuthShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <Box
      className="bg-background flex-1"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bottomOffset={24}
        extraKeyboardSpace={12}
        mode="layout">
        <VStack className="flex-1 px-6 pt-6 pb-4">
          <VStack className="items-center pt-2">
            <BlobOrbit compact={compactLogo} />
          </VStack>
          {children}
        </VStack>
      </KeyboardAwareScrollView>
    </Box>
  );
}
