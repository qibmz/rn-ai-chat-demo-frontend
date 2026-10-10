import { FrostedHeader, useFrostedHeaderContentInset } from '@/components/layout/FrostedHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { getWeeklyUsage } from '@/lib/usage/mockUsage';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function UsageScreen() {
  const insets = useSafeAreaInsets();
  const headerInset = useFrostedHeaderContentInset();
  const { percentUsed, daysUntilRecharge } = getWeeklyUsage();

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
                {daysUntilRecharge} 天后充值
              </Text>
            </VStack>

            <VStack
              className="border-border/80 bg-card w-full rounded-3xl border px-5 py-8"
              space="xl">
              <Progress
                value={percentUsed}
                className="h-3 w-full"
                accessibilityLabel="本周用量进度">
                <ProgressFilledTrack className="h-3" />
              </Progress>
              <Text size="4xl" bold className="text-foreground text-center">
                {percentUsed}%
              </Text>
            </VStack>
          </VStack>
        </ScreenContainer>
      </ScrollView>

      <FrostedHeader onBack={() => router.back()} title="用量" />
    </Box>
  );
}
