import { useChatHistoryQuery } from '@/src/api/chat/hooks';
import type { ChatMessage } from '@/src/api/chat/types';
import { Colors } from '@/src/shared/constants/colors';
import { chatWebSocketService, useChatWebSocket } from '@/src/shared/services/chat-websocket.service';
import { useAuthStore } from '@/src/shared/stores/auth.store';
import { useEffect, useState } from 'react';
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

export const ChatView = ({ chatId, isJoined, onJoinSuccess }: IProps) => {
  const currentUser = useAuthStore((state) => state.user);
  const { data, isLoading, refetch } = useChatHistoryQuery(chatId, true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { connect, disconnect } = useChatWebSocket();

  console.log({ data })

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
    return <ChatSkeleton />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No messages yet</Text>
          </View>
        ) : (
          <ChatMessageList messages={messages} currentUserId={currentUser?.id} />
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
