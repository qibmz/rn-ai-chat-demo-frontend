import { Input, InputField } from '@/components/ui/input';
import React from 'react';
import type { ComponentProps } from 'react';

type InputFieldProps = ComponentProps<typeof InputField>;
type InputRootProps = ComponentProps<typeof Input>;

type AuthFieldProps = Omit<InputFieldProps, 'className'> & {
  /** 透传给 Input 根节点（如 isDisabled） */
  rootProps?: Omit<InputRootProps, 'className' | 'children'>;
};

/**
 * Auth 页输入：与圆角胶囊按钮 / AuthModeSwitch 同一套语言
 * （满圆角、同高、柔和底，弱化方框感）
 */
export function AuthField({ rootProps, ...fieldProps }: AuthFieldProps) {
  return (
    <Input
      {...rootProps}
      className="bg-muted data-[focus=true]:border-foreground/20 h-14 rounded-full border-transparent px-5 shadow-none">
      <InputField
        {...fieldProps}
        className="text-foreground placeholder:text-muted-foreground text-base"
      />
    </Input>
  );
}
