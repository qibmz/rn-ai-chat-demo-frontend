import { BotConversationRow } from '@/components/bot/BotConversationRow';
import { CircleIconButton } from '@/components/bot/CircleIconButton';
import { FilterMenu } from '@/components/bot/FilterMenu';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Box } from '@/components/ui/box';
import { CheckIcon, CloseIcon, MenuIcon, SearchIcon } from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { GlassView } from '@/components/ui/liquid-glass';
import { chatPath } from '@/lib/bot/bots';
import { MOCK_CONVERSATIONS } from '@/lib/bot/mockConversations';
import { SEARCH_FILTERS, type SearchFilterId } from '@/lib/bot/types';
import { useThemePreference } from '@/lib/theme/ThemeProvider';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** 独立搜索页：关闭 + 搜索框 + 筛选 */
export function BotSearchScreen() {
  const insets = useSafeAreaInsets();
  const { resolved } = useThemePreference();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<SearchFilterId>('all');
  const filterActive = filter !== 'all';
  const filterLabel = SEARCH_FILTERS.find((item) => item.id === filter)?.label ?? '全部';

  const conversations = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_CONVERSATIONS.filter((item) => {
      if (filter !== 'all' && !item.filterTags.includes(filter)) return false;
      if (!q) return true;
      return item.title.toLowerCase().includes(q) || item.preview.toLowerCase().includes(q);
    });
  }, [filter, query]);

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
          <VStack className="w-full pt-2">
            {conversations.map((item) => (
              <BotConversationRow
                key={item.id}
                item={item}
                onPress={() => router.push(chatPath(item.id))}
              />
            ))}
            {conversations.length === 0 ? (
              <Text size="sm" className="text-muted-foreground py-10 text-center">
                {query.trim() || filterActive ? '没有匹配的会话' : '输入关键词搜索会话'}
              </Text>
            ) : null}
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
              <Box className="flex-row items-center gap-2">
                <CircleIconButton
                  icon={CloseIcon}
                  accessibilityLabel="关闭搜索"
                  onPress={() => router.back()}
                />
                <Input className="bg-muted h-10 flex-1 rounded-full border-0 px-3">
                  <InputSlot className="pl-1">
                    <InputIcon as={SearchIcon} className="text-muted-foreground" />
                  </InputSlot>
                  <InputField
                    value={query}
                    onChangeText={setQuery}
                    placeholder="搜索"
                    autoFocus
                    className="text-foreground text-base"
                    returnKeyType="search"
                  />
                </Input>
                <FilterMenu
                  value={filter}
                  onChange={setFilter}
                  trigger={(triggerProps) => (
                    <CircleIconButton
                      {...triggerProps}
                      icon={filterActive ? CheckIcon : MenuIcon}
                      accessibilityLabel={filterActive ? `筛选中：${filterLabel}` : '筛选'}
                      className={filterActive ? 'bg-foreground' : undefined}
                      iconClassName={filterActive ? 'text-background' : 'text-foreground'}
                    />
                  )}
                />
              </Box>
            </ScreenContainer>
          </Box>
        </GlassView>
      </Box>
    </Box>
  );
}
