import { Box } from '@/components/ui/box';
import { Divider } from '@/components/ui/divider';
import { HStack } from '@/components/ui/hstack';
import { ChevronRightIcon, Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import React from 'react';
import type { ComponentProps } from 'react';

type IconComponent = ComponentProps<typeof Icon>['as'];

type ProfileMenuRowProps = {
  label: string;
  hint?: string;
  icon: IconComponent;
  onPress: () => void;
  showDivider?: boolean;
};

export function ProfileMenuRow({
  label,
  hint,
  icon,
  onPress,
  showDivider = true,
}: ProfileMenuRowProps) {
  return (
    <>
      <Pressable
        onPress={onPress}
        className="data-[active=true]:bg-muted/70 px-4 py-3.5"
        accessibilityRole="button"
        accessibilityLabel={label}>
        <HStack className="items-center justify-between" space="md">
          <HStack className="min-w-0 flex-1 items-center" space="md">
            <Box className="bg-background h-10 w-10 items-center justify-center rounded-2xl">
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
          <Icon as={ChevronRightIcon} size="sm" className="text-muted-foreground/70" />
        </HStack>
      </Pressable>
      {showDivider ? <Divider className="bg-border/70 ml-16" /> : null}
    </>
  );
}
