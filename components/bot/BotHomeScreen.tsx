import { BotConversationRow } from '@/components/bot/BotConversationRow';
import { BotHomeHero } from '@/components/bot/BotHomeHero';
import { CircleIconButton } from '@/components/bot/CircleIconButton';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { UserAvatar } from '@/components/profile/UserAvatar';
import { Box } from '@/components/ui/box';
import { AddIcon, SearchIcon } from '@/components/ui/icon';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { GlassView } from '@/components/ui/liquid-glass';
import { useAuth } from '@/lib/auth/AuthProvider';
import { MAIN_BOT_ID, chatPath, getSubBots } from '@/lib/bot/bots';
import { MOCK_CONVERSATIONS } from '@/lib/bot/mockConversations';
import { useAppToast } from '@/lib/hooks/useAppToast';
import { useThemePreference } from '@/lib/theme/ThemeProvider';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function BotHomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { show } = useAppToast();
  const { resolved } = useThemePreference();
  const subBots = getSubBots();

  const soon = (title: string) => {
    show({ title, description: '功能即将开放', action: 'info' });
  };

  const openSearch = () => router.push('/search');
  const openChat = (botId: string) => router.push(chatPath(botId));

  return (
    <Box className="bg-background flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 56,
          paddingBottom: Math.max(insets.bottom, 28),
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <ScreenContainer variant="settings" className="px-4">
          <VStack className="w-full" space="xl">
            <Box className="items-center pt-6 pb-2">
              <BotHomeHero onPress={() => openChat(MAIN_BOT_ID)} />
            </Box>

            <VStack className="w-full">
              <Text size="xs" className="text-muted-foreground mb-1 px-1">
                子 Bot
              </Text>
              {subBots.map((bot) => {
                const item = MOCK_CONVERSATIONS.find((c) => c.id === bot.id);
                if (!item) return null;
                return (
                  <BotConversationRow key={bot.id} item={item} onPress={() => openChat(bot.id)} />
                );
              })}
              {subBots.length === 0 ? (
                <Text size="sm" className="text-muted-foreground py-10 text-center">
                  暂无子 Bot
                </Text>
              ) : null}
            </VStack>
          </VStack>
        </ScreenContainer>
      </ScrollView>

      <Box
        pointerEvents="box-none"
        className="absolute inset-x-0 top-0 z-20"
        style={{ paddingTop: insets.top }}>
        <GlassView
          className="bg-background/70 web:backdrop-blur-xl w-full overflow-hidden"
          glassEffectStyle="regular"
          colorScheme={resolved}>
          <Box className="bg-background/25 h-14 justify-center px-3">
            <ScreenContainer variant="settings" className="w-full">
              <Box className="flex-row items-center justify-between">
                <Pressable
                  onPress={() => router.push('/profile')}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="打开个人中心"
                  className="rounded-full data-[active=true]:opacity-85">
                  <View className="rounded-full shadow-sm">
                    <UserAvatar email={user?.email} className="h-10 w-10" textClassName="text-xs" />
                  </View>
                </Pressable>
                <Box className="flex-row items-center gap-2.5">
                  <CircleIconButton
                    icon={SearchIcon}
                    accessibilityLabel="搜索"
                    onPress={openSearch}
                  />
                  <Menu
                    placement="bottom right"
                    offset={8}
                    className="rounded-3xl"
                    trigger={(triggerProps: Record<string, unknown>) => (
                      <CircleIconButton
                        {...triggerProps}
                        icon={AddIcon}
                        accessibilityLabel="新建"
                      />
                    )}>
                    <MenuItem
                      textValue="新建 Bot"
                      onPress={() => router.push('/create-bot')}
                      className="min-w-36">
                      <MenuItemLabel>新建 Bot</MenuItemLabel>
                    </MenuItem>
                    <MenuItem
                      textValue="新建群聊"
                      onPress={() => soon('新建群聊')}
                      className="min-w-36">
                      <MenuItemLabel>新建群聊</MenuItemLabel>
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>
            </ScreenContainer>
          </Box>
        </GlassView>
      </Box>
    </Box>
  );
}
