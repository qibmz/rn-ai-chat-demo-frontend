import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import React from 'react';

export type AuthMode = 'login' | 'register';

type AuthModeSwitchProps = {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
};

export function AuthModeSwitch({ mode, onChange }: AuthModeSwitchProps) {
  return (
    <Box className="flex-row rounded-full bg-neutral-100 p-1">
      {(['login', 'register'] as const).map((item) => {
        const active = mode === item;
        return (
          <Pressable
            key={item}
            onPress={() => onChange(item)}
            className={`flex-1 items-center rounded-full py-2.5 ${
              active ? 'bg-white' : 'bg-transparent'
            }`}>
            <Text
              className={`text-sm font-medium ${active ? 'text-neutral-950' : 'text-neutral-500'}`}>
              {item === 'login' ? '登录' : '注册'}
            </Text>
          </Pressable>
        );
      })}
    </Box>
  );
}
