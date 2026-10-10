export type BotFaceShape = 'circle' | 'oval' | 'squircle';

export type ConversationPreviewKind = 'text' | 'attachment';

export type SearchFilterId = 'all' | 'message' | 'bot' | 'group' | 'file' | 'schedule';

export type ConversationFilterTag = Exclude<SearchFilterId, 'all'>;

export type BotConversation = {
  id: string;
  title: string;
  preview: string;
  previewKind: ConversationPreviewKind;
  timeLabel: string;
  faceColor: string;
  faceShape: BotFaceShape;
  /** 搜索页筛选项匹配标签 */
  filterTags: ConversationFilterTag[];
};

export const SEARCH_FILTERS: { id: SearchFilterId; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'message', label: '消息' },
  { id: 'bot', label: 'Bot' },
  { id: 'group', label: '群聊' },
  { id: 'file', label: '文件' },
  { id: 'schedule', label: '定时任务' },
];
