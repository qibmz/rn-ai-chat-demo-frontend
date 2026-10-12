import { AppLogoLive } from '@/components/brand/AppLogoLive';
import { BotFace } from '@/components/bot/BotFace';
import { CircleIconButton } from '@/components/bot/CircleIconButton';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  Message,
  MessageContent,
  MessageResponse,
  PromptInput,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from '@/components/ui/chat-ai';
import { ArrowLeftIcon } from '@/components/ui/icon';
import { GlassView } from '@/components/ui/liquid-glass';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { getBotById } from '@/lib/bot/bots';
import { createChatTransport } from '@/lib/chat/createChatTransport';
import { isChatMockEnabled } from '@/lib/config';
import { useAppToast } from '@/lib/hooks/useAppToast';
import { goBackOr } from '@/lib/navigation/goBack';
import { useThemePreference } from '@/lib/theme/ThemeProvider';
import { useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import { router } from 'expo-router';
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  FlatList,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  Text as RNText,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** 距底小于此值视为仍贴底；用户上滑后暂停自动滚 */
const STICK_BOTTOM_THRESHOLD = 80;
/** 给绝对定位的 PromptInput 留空，避免末条消息被挡住 */
const MESSAGE_LIST_BOTTOM_PAD = 192;

type ChatScreenProps = {
  botId: string;
};

function buildWelcomeMessage(botTitle: string, isMain: boolean): UIMessage {
  return {
    id: 'welcome',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: `我是${botTitle}${isMain ? '（主 Bot）' : ''}，有什么需要帮忙的？`,
      },
    ],
  };
}

type PromptAttachment = {
  id: string;
  type: 'file';
  filename?: string;
  mediaType?: string;
  url: string;
};

const AttachmentItem = memo(
  ({ attachment, onRemove }: { attachment: PromptAttachment; onRemove: (id: string) => void }) => {
    const handleRemove = React.useCallback(
      () => onRemove(attachment.id),
      [onRemove, attachment.id]
    );

    return (
      <Attachment data={attachment} onRemove={handleRemove}>
        <AttachmentPreview />
        <AttachmentRemove />
      </Attachment>
    );
  }
);

function PromptInputAttachmentsDisplay() {
  const attachments = usePromptInputAttachments();

  if (attachments.files.length === 0) return null;

  return (
    <Attachments variant="grid" className="mb-4">
      {attachments.files.map((attachment) => (
        <AttachmentItem key={attachment.id} attachment={attachment} onRemove={attachments.remove} />
      ))}
    </Attachments>
  );
}

export function ChatScreen({ botId }: ChatScreenProps) {
  const insets = useSafeAreaInsets();
  const { show } = useAppToast();
  const { resolved } = useThemePreference();
  const bot = useMemo(() => getBotById(botId), [botId]);

  const transport = useMemo(
    () => (bot ? createChatTransport({ botId: bot.id }) : createChatTransport({ botId })),
    [bot, botId]
  );

  const welcome = useMemo(
    () =>
      bot
        ? buildWelcomeMessage(bot.title, bot.kind === 'main')
        : buildWelcomeMessage('助手', false),
    [bot]
  );

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const html = document.documentElement;
    const { body } = document;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  const { messages, sendMessage, status, error, clearError } = useChat({
    id: `bot-${botId}`,
    messages: [welcome],
    transport,
    onError: (err) => {
      show({
        title: '发送失败',
        description: err.message || '聊天服务暂不可用',
        action: 'error',
      });
    },
  });

  // 官方 ConversationContent 仅在「新增用户消息」时 scrollToEnd，流式变长不会跟；
  // 经 FlatList 透传 props 补贴底（不改 components/ui）。
  const listRef = useRef<FlatList<UIMessage>>(null);
  const stickToBottomRef = useRef(true);

  const scrollToBottom = useCallback((animated = false) => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd?.({ animated });
    });
  }, []);

  useEffect(() => {
    if (!stickToBottomRef.current) return;
    scrollToBottom(status !== 'streaming');
  }, [messages, status, scrollToBottom]);

  const handleListScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;
    stickToBottomRef.current = distanceFromBottom <= STICK_BOTTOM_THRESHOLD;
  }, []);

  const handleContentSizeChange = useCallback(() => {
    if (!stickToBottomRef.current) return;
    scrollToBottom(false);
  }, [scrollToBottom]);

  const renderMessage: ListRenderItem<UIMessage> = ({ item: message, index }) => (
    <Message role={message.role} index={index} message={message}>
      <MessageContent>
        <MessageResponse message={message} />
      </MessageContent>
    </Message>
  );

  const handleSubmit = ({ text, files }: { text: string; files?: PromptAttachment[] }) => {
    if (!text?.trim() && (!files || files.length === 0)) return;
    stickToBottomRef.current = true;
    void sendMessage({
      text: text?.trim() ?? '',
      files: files?.length ? files : undefined,
    });
  };

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
  const busy = status === 'submitted' || status === 'streaming';

  return (
    <Box
      className="bg-background min-h-0 flex-1 overflow-hidden"
      style={{ paddingTop: insets.top }}>
      <GlassView
        className="bg-background/80 web:backdrop-blur-xl w-full overflow-hidden"
        glassEffectStyle="regular"
        colorScheme={resolved}>
        <Box className="border-border/30 bg-background/30 h-14 flex-row items-center gap-2 border-b px-2">
          <ScreenContainer variant="wide" className="w-full flex-row items-center gap-2 px-1">
            <CircleIconButton
              icon={ArrowLeftIcon}
              accessibilityLabel="返回"
              onPress={() => goBackOr('/home')}
            />
            {bot.kind === 'main' ? (
              <AppLogoLive size={36} color={faceColor} eyeColor={eyeColor} />
            ) : (
              <BotFace size={36} color={faceColor} eyeColor={eyeColor} shape={bot.faceShape} />
            )}
            <VStack className="min-w-0 flex-1">
              <Text size="md" bold isTruncated className="text-foreground">
                {bot.title}
              </Text>
              <Text size="xs" className="text-muted-foreground">
                {bot.kind === 'main' ? '主 Bot' : '子 Bot'}
                {isChatMockEnabled ? ' · 演示模式' : ''}
                {busy ? ' · 回复中' : ''}
              </Text>
            </VStack>
          </ScreenContainer>
        </Box>
      </GlassView>

      {error ? (
        <Pressable
          onPress={clearError}
          className="bg-destructive/10 px-4 py-2"
          accessibilityRole="button"
          accessibilityLabel="关闭错误提示">
          <Text size="sm" className="text-destructive text-center">
            {error.message}（点按关闭）
          </Text>
        </Pressable>
      ) : null}

      {/* 官方 chat-ai 树。Example 用 h-[600px] 把滚动关在盒子里；全屏页用 overflow-hidden + min-h-0 等价，否则 Web 对焦输入会把整页顶上去 */}
      <Box className="bg-background web:pb-5 min-h-0 flex-1 overflow-hidden">
        <ScreenContainer variant="wide" className="relative min-h-0 flex-1 overflow-hidden">
          <Conversation className="flex-1">
            <ConversationContent
              messages={messages}
              renderItem={renderMessage}
              onScroll={handleListScroll}
              onContentSizeChange={handleContentSizeChange}
              contentContainerStyle={{ paddingBottom: MESSAGE_LIST_BOTTOM_PAD }}
              // React 19：ref 经 ...flatListProps 落到内部列表，覆盖库内仅「发用户消息才滚」的 ref
              {...{ ref: listRef }}
            />
            <ConversationScrollButton />
          </Conversation>

          <PromptInputProvider>
            <PromptInput onSubmit={handleSubmit}>
              <PromptInputAttachmentsDisplay />
              <PromptInputBody>
                <PromptInputTextarea />
              </PromptInputBody>

              <PromptInputFooter>
                <PromptInputTools>
                  <PromptInputActionMenu>
                    <PromptInputActionMenuContent
                      trigger={(props: Record<string, unknown>) => (
                        <PromptInputActionMenuTrigger {...props} className="px-3">
                          <RNText className="text-primary text-3xl">+</RNText>
                        </PromptInputActionMenuTrigger>
                      )}
                    />
                  </PromptInputActionMenu>
                </PromptInputTools>

                <PromptInputSubmit />
              </PromptInputFooter>
            </PromptInput>
          </PromptInputProvider>
        </ScreenContainer>
      </Box>
    </Box>
  );
}
