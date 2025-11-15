import { useChatHistoryQuery } from '@/src/api/chat/hooks';
import type { ChatMessage } from '@/src/api/chat/types';
import { Colors } from '@/src/shared/constants/colors';
import { chatWebSocketService, useChatWebSocket } from '@/src/shared/services/chat-websocket.service';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ChatInput } from './ChatInput';
import { ChatMessageList } from './ChatMessageList';
import { JoinChatButton } from './JoinChatButton';

type IProps = {
  chatId: number;
  currentUserId?: string;
  isJoined: boolean;
  onJoinSuccess: () => void;
};

export const ChatView = ({ chatId, currentUserId, isJoined, onJoinSuccess }: IProps) => {
  const { data, isLoading, refetch } = useChatHistoryQuery(chatId, true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { connect, disconnect } = useChatWebSocket();

  useEffect(() => {
    if (data?.messages) {
      setMessages([...data.messages].reverse());
    }
  }, [data]);

  useEffect(() => {
    connect();

    const unsubscribe = chatWebSocketService.subscribe(chatId, (newMessage) => {
      setMessages((prev) => [newMessage, ...prev]);
    });

    return () => {
      unsubscribe();
      disconnect();
    };
  }, [chatId, connect, disconnect]);

  const handleMessageSent = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No messages yet</Text>
          </View>
        ) : (
          <ChatMessageList messages={messages} currentUserId={currentUserId} />
        )}
      </View>
      
      {isJoined ? (
        <ChatInput chatId={chatId} onMessageSent={handleMessageSent} />
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
