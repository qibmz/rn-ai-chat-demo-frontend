import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import React from 'react';

export type AuthMode = 'login' | 'register';

type AuthModeSwitchProps = {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
};

/**
 * 登录 / 注册等分胶囊。
 *
 * 选中态直接打在 Pressable 上（bg-card），兼容 App / H5。
 * 不用：Reanimated、onLayout 量宽、绝对定位滑块、gluestack Tabs。
 * （H5 的 Box 是 div 不能 onLayout；Reanimated / 绝对滑块在 Web 上多次翻车）
 */
export function AuthModeSwitch({ mode, onChange }: AuthModeSwitchProps) {
  return (
    <Box className="bg-muted w-full flex-row rounded-full p-1">
      {(['login', 'register'] as const).map((item) => {
        const active = mode === item;
        return (
          <Pressable
            key={item}
            onPress={() => onChange(item)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            className={`flex-1 items-center rounded-full py-2.5 ${
              active ? 'bg-card' : 'bg-transparent'
            }`}>
            <Text
              className={`text-sm font-medium ${
                active ? 'text-foreground' : 'text-muted-foreground'
              }`}>
              {item === 'login' ? '登录' : '注册'}
            </Text>
          </Pressable>
        );
      })}
    </Box>
  );
}
