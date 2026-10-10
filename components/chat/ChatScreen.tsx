import { BotFace } from '@/components/bot/BotFace';
import { CircleIconButton } from '@/components/bot/CircleIconButton';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { ArrowLeftIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { GlassView } from '@/components/ui/liquid-glass';
import { getBotById } from '@/lib/bot/bots';
import { useThemePreference } from '@/lib/theme/ThemeProvider';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type ChatScreenProps = {
  botId: string;
};

export function ChatScreen({ botId }: ChatScreenProps) {
  const insets = useSafeAreaInsets();
  const { resolved } = useThemePreference();
  const bot = useMemo(() => getBotById(botId), [botId]);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      content: bot
        ? `我是${bot.title}${bot.kind === 'main' ? '（主 Bot）' : ''}，有什么需要帮忙的？`
        : '会话不存在',
    },
  ]);

  if (!bot) {
    return (
      <Box className="bg-background flex-1 items-center justify-center px-6">
        <Text className="text-muted-foreground mb-4">找不到该 Bot</Text>
        <Button onPress={() => router.replace('/home')}>
          <ButtonText>返回首页</ButtonText>
        </Button>
      </Box>
    );
  }

  const faceColor =
    bot.kind === 'main' ? (resolved === 'dark' ? '#FAFAFA' : '#0A0A0A') : bot.faceColor;
  const eyeColor = bot.kind === 'main' && resolved === 'dark' ? '#0A0A0A' : '#FFFFFF';

  const send = () => {
    const content = text.trim();
    if (!content) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content,
    };
    const reply: ChatMessage = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: `（演示回复）已收到：${content}`,
    };
    setMessages((prev) => [...prev, userMsg, reply]);
    setText('');
  };

  return (
    <Box className="bg-background flex-1" style={{ paddingTop: insets.top }}>
      <GlassView
        className="bg-background/80 web:backdrop-blur-xl w-full overflow-hidden"
        glassEffectStyle="regular"
        colorScheme={resolved}>
        <Box className="border-border/30 bg-background/30 h-14 flex-row items-center gap-2 border-b px-2">
          <ScreenContainer variant="settings" className="w-full flex-row items-center gap-2 px-1">
            <CircleIconButton
              icon={ArrowLeftIcon}
              accessibilityLabel="返回"
              onPress={() => router.back()}
            />
            <BotFace size={36} color={faceColor} eyeColor={eyeColor} shape={bot.faceShape} />
            <VStack className="min-w-0 flex-1">
              <Text size="md" bold isTruncated className="text-foreground">
                {bot.title}
              </Text>
              <Text size="xs" className="text-muted-foreground">
                {bot.kind === 'main' ? '主 Bot' : '子 Bot'}
              </Text>
            </VStack>
          </ScreenContainer>
        </Box>
      </GlassView>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 16,
            flexGrow: 1,
          }}
          renderItem={({ item }) => (
            <Box
              className={`mb-3 w-full flex-row ${
                item.role === 'user' ? 'justify-end' : 'justify-start'
              }`}>
              <Box
                className={`max-w-80 rounded-3xl px-4 py-3 ${
                  item.role === 'user' ? 'bg-primary' : 'border-border/70 bg-card border'
                }`}>
                <Text
                  size="sm"
                  className={item.role === 'user' ? 'text-primary-foreground' : 'text-foreground'}>
                  {item.content}
                </Text>
              </Box>
            </Box>
          )}
        />

        <Box
          className="border-border/40 bg-background border-t px-3 pt-2"
          style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
          <ScreenContainer variant="settings" className="w-full flex-row items-center gap-2">
            <Input className="bg-muted h-12 flex-1 rounded-full border-0 px-4">
              <InputField
                value={text}
                onChangeText={setText}
                placeholder="发消息…"
                className="text-foreground text-base"
                returnKeyType="send"
                onSubmitEditing={send}
              />
            </Input>
            <Button size="lg" className="rounded-full px-5" onPress={send}>
              <ButtonText>发送</ButtonText>
            </Button>
          </ScreenContainer>
        </Box>
      </KeyboardAvoidingView>
    </Box>
  );
}
