import { FrostedHeader, useFrostedHeaderContentInset } from '@/components/layout/FrostedHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Box } from '@/components/ui/box';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { CheckIcon, Icon, MoonIcon, SettingsIcon, SunIcon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useThemePreference } from '@/lib/theme/ThemeProvider';
import { THEME_PREFERENCE_OPTIONS, type ThemePreference } from '@/lib/theme/types';
import React from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OPTION_ICONS: Record<ThemePreference, typeof SunIcon> = {
  system: SettingsIcon,
  light: SunIcon,
  dark: MoonIcon,
};

export function AppearanceScreen() {
  const insets = useSafeAreaInsets();
  const headerInset = useFrostedHeaderContentInset();
  const { preference, setPreference } = useThemePreference();

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
          <VStack className="w-full" space="lg">
            <VStack space="xs">
              <Heading size="xl" className="text-foreground">
                显示模式
              </Heading>
              <Text size="sm" className="text-muted-foreground">
                选择浅色、深色，或跟随系统自动切换。
              </Text>
            </VStack>

            <VStack className="bg-muted overflow-hidden rounded-3xl">
              {THEME_PREFERENCE_OPTIONS.map((option, index) => {
                const selected = preference === option.value;
                return (
                  <React.Fragment key={option.value}>
                    <Pressable
                      onPress={() => setPreference(option.value)}
                      className="data-[active=true]:bg-muted/70 data-[hover=true]:bg-muted/50 px-4 py-4"
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                      accessibilityLabel={option.label}>
                      <HStack className="items-center justify-between" space="md">
                        <HStack className="min-w-0 flex-1 items-center" space="md">
                          <Box className="bg-background h-10 w-10 items-center justify-center rounded-2xl">
                            <Icon
                              as={OPTION_ICONS[option.value]}
                              size="md"
                              className="text-foreground"
                            />
                          </Box>
                          <VStack className="min-w-0 flex-1">
                            <Text size="md" bold className="text-foreground">
                              {option.label}
                            </Text>
                            <Text size="xs" className="text-muted-foreground mt-0.5">
                              {option.description}
                            </Text>
                          </VStack>
                        </HStack>
                        {selected ? (
                          <Box className="bg-primary h-7 w-7 items-center justify-center rounded-full">
                            <Icon as={CheckIcon} size="sm" className="text-primary-foreground" />
                          </Box>
                        ) : (
                          <Box className="border-border h-7 w-7 rounded-full border" />
                        )}
                      </HStack>
                    </Pressable>
                    {index < THEME_PREFERENCE_OPTIONS.length - 1 ? (
                      <Divider className="bg-border/70 ml-16" />
                    ) : null}
                  </React.Fragment>
                );
              })}
            </VStack>
          </VStack>
        </ScreenContainer>
      </ScrollView>

      <FrostedHeader
        fallbackHref="/profile"
        backVariant="back"
        title="外观"
        accessibilityLabel="返回"
      />
    </Box>
  );
}
