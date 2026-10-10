import { ChatScreen } from '@/components/chat/ChatScreen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function ChatRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ChatScreen botId={typeof id === 'string' ? id : Array.isArray(id) ? id[0] : ''} />;
}
