import { FrostedHeader, useFrostedHeaderContentInset } from '@/components/layout/FrostedHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useChatQuota } from '@/lib/chat/quota';
import React from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function UsageScreen() {
  const insets = useSafeAreaInsets();
  const headerInset = useFrostedHeaderContentInset();
  const { usedPercentLabel, progressValue, resetHint, loading, error, quota } = useChatQuota();
  const remainingLabel =
    quota != null ? `${Math.round(quota.remainingPercent)}% 剩余` : '本周额度按自然周重置';

  return (
    <Box className="bg-background flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: headerInset + 16,
          paddingBottom: Math.max(insets.bottom, 24),
        }}
        showsVerticalScrollIndicator={false}>
        <ScreenContainer variant="settings" className="px-5">
          <VStack className="w-full" space="2xl">
            <VStack space="xs">
              <Heading size="xl" className="text-foreground">
                每周用量
              </Heading>
              <Text size="sm" className="text-muted-foreground">
                {loading && !quota ? '正在同步额度…' : resetHint}
              </Text>
              {error && !quota ? (
                <Text size="sm" className="text-destructive">
                  额度暂时读不到，请稍后下拉返回重试
                </Text>
              ) : null}
            </VStack>

            <VStack className="bg-muted w-full rounded-3xl px-5 py-8" space="xl">
              {loading && !quota ? (
                <Box className="items-center py-6">
                  <Spinner />
                </Box>
              ) : (
                <>
                  <Progress
                    value={progressValue}
                    className="h-3 w-full"
                    accessibilityLabel="本周用量进度">
                    <ProgressFilledTrack className="h-3" />
                  </Progress>
                  <Text size="4xl" bold className="text-foreground text-center">
                    {usedPercentLabel}
                  </Text>
                  <Text size="sm" className="text-muted-foreground text-center">
                    {remainingLabel}
                  </Text>
                </>
              )}
            </VStack>
          </VStack>
        </ScreenContainer>
      </ScrollView>

      <FrostedHeader fallbackHref="/profile" backVariant="back" title="用量" />
    </Box>
  );
}
