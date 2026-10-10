import { BotFace } from '@/components/bot/BotFace';
import { FrostedHeader, useFrostedHeaderContentInset } from '@/components/layout/FrostedHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { VStack } from '@/components/ui/vstack';
import { useAppToast } from '@/lib/hooks/useAppToast';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SHAPES = ['circle', 'oval', 'squircle'] as const;
const COLORS = [
  '#0A0A0A',
  '#78716C',
  '#DC2626',
  '#EA580C',
  '#CA8A04',
  '#16A34A',
  '#0D9488',
  '#2563EB',
  '#7C3AED',
  '#DB2777',
  '#A3A3A3',
];

export default function CreateBotScreen() {
  const insets = useSafeAreaInsets();
  const headerInset = useFrostedHeaderContentInset();
  const { show } = useAppToast();
  const [name, setName] = useState('');
  const [shape, setShape] = useState<(typeof SHAPES)[number]>('squircle');
  const [color, setColor] = useState('#DB2777');

  return (
    <Box className="bg-background flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: headerInset + 12,
          paddingBottom: Math.max(insets.bottom, 24) + 72,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <ScreenContainer variant="settings" className="px-5">
          <VStack className="w-full items-center" space="2xl">
            <BotFace size={112} color={color} shape={shape === 'oval' ? 'oval' : shape} />

            <Input className="bg-muted h-12 w-full rounded-full border-0 px-5">
              <InputField
                value={name}
                onChangeText={setName}
                placeholder="为 Bot 取个名字"
                className="text-foreground text-center text-base"
              />
            </Input>

            <VStack className="w-full" space="md">
              <Box className="flex-row flex-wrap justify-center gap-3">
                {SHAPES.map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => setShape(item)}
                    className={`rounded-2xl p-1 ${shape === item ? 'border-border border' : 'border border-transparent'}`}>
                    <BotFace size={44} color={color} shape={item} />
                  </Pressable>
                ))}
              </Box>

              <Box className="flex-row flex-wrap justify-center gap-3 pt-2">
                {COLORS.map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => setColor(item)}
                    className={`h-9 w-9 items-center justify-center rounded-full ${
                      color === item
                        ? 'border-muted-foreground border-2'
                        : 'border-2 border-transparent'
                    }`}>
                    <Box className="h-7 w-7 rounded-full" style={{ backgroundColor: item }} />
                  </Pressable>
                ))}
              </Box>
            </VStack>
          </VStack>
        </ScreenContainer>
      </ScrollView>

      <Box
        className="absolute inset-x-0 bottom-0 px-5"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <ScreenContainer variant="settings">
          <Button
            size="lg"
            className="h-14 rounded-full"
            onPress={() => {
              if (!name.trim()) {
                show({ title: '请先为 Bot 取名', action: 'warning' });
                return;
              }
              show({ title: '创建成功（演示）', description: name.trim(), action: 'success' });
              router.back();
            }}>
            <ButtonText>创建</ButtonText>
          </Button>
        </ScreenContainer>
      </Box>

      <FrostedHeader
        onBack={() => router.back()}
        backVariant="close"
        title="创建新 Bot"
        accessibilityLabel="关闭"
      />
    </Box>
  );
}
