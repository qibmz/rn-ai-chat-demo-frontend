import { BotFace } from '@/components/bot/BotFace';
import { HStack } from '@/components/ui/hstack';
import { Icon, PaperclipIcon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import type { BotConversation } from '@/lib/bot/types';
import React from 'react';

type BotConversationRowProps = {
  item: BotConversation;
  onPress?: () => void;
};

export function BotConversationRow({ item, onPress }: BotConversationRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="px-1 py-3 data-[active=true]:opacity-80 data-[hover=true]:opacity-90"
      accessibilityRole="button"
      accessibilityLabel={item.title}>
      <HStack className="items-center" space="md">
        <BotFace size={52} color={item.faceColor} shape={item.faceShape} />
        <VStack className="min-w-0 flex-1" space="xs">
          <HStack className="items-center justify-between" space="sm">
            <Text size="md" bold isTruncated className="text-foreground flex-1">
              {item.title}
            </Text>
            <Text size="xs" className="text-muted-foreground">
              {item.timeLabel}
            </Text>
          </HStack>
          <HStack className="items-center" space="xs">
            {item.previewKind === 'attachment' ? (
              <Icon as={PaperclipIcon} size="sm" className="text-muted-foreground" />
            ) : null}
            <Text size="sm" isTruncated className="text-muted-foreground flex-1">
              {item.preview}
            </Text>
          </HStack>
        </VStack>
      </HStack>
    </Pressable>
  );
}
