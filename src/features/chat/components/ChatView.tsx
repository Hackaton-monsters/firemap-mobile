import { useChatHistoryQuery } from '@/src/api/chat/hooks';
import type { ChatUser, DisplayMessage } from '@/src/api/chat/types';
import { Colors } from '@/src/shared/constants/colors';
import { chatWebSocketService, useChatWebSocket } from '@/src/shared/services/chat-websocket.service';
import { useAuthStore } from '@/src/shared/stores/auth.store';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { ChatInput } from './ChatInput';
import { ChatMessageList } from './ChatMessageList';
import ChatSkeleton from './ChatSkeleton';
import { JoinChatButton } from './JoinChatButton';

type IProps = {
  chatId: number;
  isJoined: boolean;
  onJoinSuccess: () => void;
};

export const ChatView = ({ chatId, onJoinSuccess }: IProps) => {
  const isJoined = true;
  const { t } = useTranslation();
  const currentUser = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const { data, isLoading } = useChatHistoryQuery(chatId, true);
  const { connect, disconnect } = useChatWebSocket();

  // Map auth store user to ChatUser type
  const chatUser: ChatUser | null = useMemo(() => {
    if (!currentUser) return null;
    return {
      id: currentUser.id,
      email: currentUser.email,
      nickname: currentUser.nickname,
      role: currentUser.role === 'gov' ? 'government' : 'user',
    };
  }, [currentUser]);

  useEffect(() => {
    connect();

    const unsubscribe = chatWebSocketService.subscribe(chatId, (newMessage) => {
      // Update query cache when receiving WebSocket message
      queryClient.setQueryData(['chat', chatId, 'history'], (old: any) => {
        if (!old) return old;
        
        // Check if message already exists (avoid duplicates)
        const exists = old.messages.some((msg: any) => msg.id === newMessage.id);
        if (exists) return old;
        
        return {
          ...old,
          messages: [...old.messages, newMessage],
        };
      });
    });

    return () => {
      unsubscribe();
      disconnect();
    };
  }, [chatId, connect, disconnect, queryClient]);

  if (isLoading) {
    return <ChatSkeleton />;
  }

  const messages: DisplayMessage[] = data?.messages ? [...data.messages].reverse() : [];

  return (
    <View style={styles.container}>
      <View style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>{t('chats.noMessages')}</Text>
          </View>
        ) : (
          <ChatMessageList messages={messages} currentUser={chatUser} chatId={chatId} />
        )}
      </View>

      {isJoined ? (
        <ChatInput chatId={chatId} />
      ) : (
        <JoinChatButton chatId={chatId} onJoined={onJoinSuccess} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
});
