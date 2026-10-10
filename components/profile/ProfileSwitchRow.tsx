import { Box } from '@/components/ui/box';
import { Divider } from '@/components/ui/divider';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import React from 'react';
import type { ComponentProps } from 'react';

type IconComponent = ComponentProps<typeof Icon>['as'];

type ProfileSwitchRowProps = {
  label: string;
  hint?: string;
  icon: IconComponent;
  value: boolean;
  disabled?: boolean;
  onValueChange: (value: boolean) => void;
  showDivider?: boolean;
};

export function ProfileSwitchRow({
  label,
  hint,
  icon,
  value,
  disabled = false,
  onValueChange,
  showDivider = true,
}: ProfileSwitchRowProps) {
  return (
    <>
      <Box className="px-4 py-3.5">
        <HStack className="items-center justify-between" space="md">
          <HStack className="min-w-0 flex-1 items-center" space="md">
            <Box className="bg-muted h-10 w-10 items-center justify-center rounded-2xl">
              <Icon as={icon} size="md" className="text-foreground" />
            </Box>
            <Box className="min-w-0 flex-1">
              <Text size="md" bold className="text-foreground">
                {label}
              </Text>
              {hint ? (
                <Text size="xs" className="text-muted-foreground mt-0.5">
                  {hint}
                </Text>
              ) : null}
            </Box>
          </HStack>
          <Switch
            size="md"
            isChecked={value}
            isDisabled={disabled}
            onToggle={() => onValueChange(!value)}
            accessibilityLabel={label}
          />
        </HStack>
      </Box>
      {showDivider ? <Divider className="bg-border/70 ml-16" /> : null}
    </>
  );
}
