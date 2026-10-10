import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import React from 'react';

type LogoutConfirmDialogProps = {
  isOpen: boolean;
  isLoggingOut?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function LogoutConfirmDialog({
  isOpen,
  isLoggingOut = false,
  onClose,
  onConfirm,
}: LogoutConfirmDialogProps) {
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} size="md">
      <AlertDialogBackdrop />
      <AlertDialogContent className="rounded-3xl">
        <AlertDialogHeader>
          <Heading size="lg" className="text-foreground">
            退出登录？
          </Heading>
        </AlertDialogHeader>
        <AlertDialogBody className="mt-2 mb-6">
          <Text size="sm" className="text-muted-foreground">
            退出后需要重新登录，才能继续使用账号相关功能。
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter className="gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 rounded-full"
            disabled={isLoggingOut}
            onPress={onClose}>
            <ButtonText>取消</ButtonText>
          </Button>
          <Button
            variant="destructive"
            size="lg"
            className="flex-1 rounded-full"
            disabled={isLoggingOut}
            onPress={onConfirm}>
            {isLoggingOut ? <ButtonSpinner color="#fff" /> : null}
            <ButtonText>退出</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
