import type { BotConversation } from '@/lib/bot/types';

/** 首页演示会话，后续接真实 API */
export const MOCK_CONVERSATIONS: BotConversation[] = [
  {
    id: '1',
    title: '牛马二号',
    preview: '附件',
    previewKind: 'attachment',
    timeLabel: '星期一',
    faceColor: '#737373',
    faceShape: 'oval',
    filterTags: ['bot', 'file'],
  },
  {
    id: '2',
    title: '牛马一号',
    preview: '找到了。最终 Word 在共享电脑上: …',
    previewKind: 'text',
    timeLabel: '星期一',
    faceColor: '#2563EB',
    faceShape: 'circle',
    filterTags: ['bot', 'message'],
  },
  {
    id: '3',
    title: '日程助手',
    preview: '明天 10:00 的同步会已加入日历',
    previewKind: 'text',
    timeLabel: '昨天',
    faceColor: '#0A0A0A',
    faceShape: 'squircle',
    filterTags: ['bot', 'schedule', 'message'],
  },
  {
    id: '4',
    title: '项目群',
    preview: '明天一起对一下进度',
    previewKind: 'text',
    timeLabel: '今天',
    faceColor: '#16A34A',
    faceShape: 'squircle',
    filterTags: ['group', 'message'],
  },
];
