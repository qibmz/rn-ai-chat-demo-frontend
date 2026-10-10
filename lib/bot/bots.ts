import { MOCK_CONVERSATIONS } from '@/lib/bot/mockConversations';
import type { BotConversation, BotFaceShape } from '@/lib/bot/types';
import { APP_NAME } from '@/lib/config';

export type BotEntity = {
  id: string;
  title: string;
  /** 主 Bot / 子 Bot */
  kind: 'main' | 'sub';
  faceColor: string;
  faceShape: BotFaceShape;
  preview?: string;
  timeLabel?: string;
};

export const MAIN_BOT_ID = 'main';

export const MAIN_BOT: BotEntity = {
  id: MAIN_BOT_ID,
  title: APP_NAME,
  kind: 'main',
  faceColor: '#0A0A0A',
  faceShape: 'circle',
};

export function getSubBots(): BotEntity[] {
  return MOCK_CONVERSATIONS.map((item) => conversationToBot(item));
}

export function conversationToBot(item: BotConversation): BotEntity {
  return {
    id: item.id,
    title: item.title,
    kind: 'sub',
    faceColor: item.faceColor,
    faceShape: item.faceShape,
    preview: item.preview,
    timeLabel: item.timeLabel,
  };
}

export function getBotById(id: string): BotEntity | null {
  if (id === MAIN_BOT_ID) return MAIN_BOT;
  const found = MOCK_CONVERSATIONS.find((item) => item.id === id);
  return found ? conversationToBot(found) : null;
}

export function chatPath(botId: string) {
  return `/chat/${botId}` as const;
}
