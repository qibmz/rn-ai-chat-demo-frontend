import { BotConversationRow } from '@/components/bot/BotConversationRow';
import { CircleIconButton } from '@/components/bot/CircleIconButton';
import { FilterMenu } from '@/components/bot/FilterMenu';
import { CapsuleField } from '@/components/form/CapsuleField';
import { FrostedHeader, useFrostedHeaderContentInset } from '@/components/layout/FrostedHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Box } from '@/components/ui/box';
import { Icon, SearchIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { chatPath } from '@/lib/bot/bots';
import { MOCK_CONVERSATIONS } from '@/lib/bot/mockConversations';
import { SEARCH_FILTERS, type SearchFilterId } from '@/lib/bot/types';
import { router } from 'expo-router';
import { ListFilter } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** 独立搜索页：关闭 + 搜索框 + 筛选 */
export function BotSearchScreen() {
  const insets = useSafeAreaInsets();
  const headerInset = useFrostedHeaderContentInset();
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
          paddingTop: headerInset + 8,
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

      <FrostedHeader
        fallbackHref="/home"
        backVariant="close"
        accessibilityLabel="关闭搜索"
        center={
          <Box className="relative w-full justify-center">
            <Box className="absolute left-3 z-10" pointerEvents="none">
              <Icon as={SearchIcon} size="sm" className="text-muted-foreground" />
            </Box>
            <CapsuleField
              value={query}
              onChangeText={setQuery}
              placeholder="搜索"
              autoFocus
              returnKeyType="search"
              containerClassName="h-10"
              style={styles.searchField}
            />
          </Box>
        }
        trailing={
          <FilterMenu
            value={filter}
            onChange={setFilter}
            trigger={(triggerProps) => (
              <CircleIconButton
                {...triggerProps}
                icon={ListFilter}
                accessibilityLabel={filterActive ? `筛选中：${filterLabel}` : '筛选'}
                className={filterActive ? 'bg-foreground' : undefined}
                iconClassName={filterActive ? 'text-background' : 'text-foreground'}
              />
            )}
          />
        }
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  searchField: {
    paddingLeft: 28,
  },
});
