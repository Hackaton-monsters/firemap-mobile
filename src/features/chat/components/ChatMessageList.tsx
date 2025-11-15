import type { DisplayMessage, PendingMessage } from '@/src/api/chat/types';
import { Colors } from '@/src/shared/constants/colors';
import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import DateDivider from './DateDivider';
import PendingMessageBubble from './PendingMessageBubble';

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

type MessageItem = 
  | { type: 'message'; data: DisplayMessage }
  | { type: 'divider'; date: Date; id: string };

type IProps = {
  messages: DisplayMessage[];
  currentUserId?: number;
};

export const ChatMessageList = ({ messages, currentUserId }: IProps) => {
  // Insert date dividers between messages
  const messagesWithDividers = useMemo(() => {
    const items: MessageItem[] = [];
    let lastDate: Date | null = null;

    // Process messages in reverse because list is inverted
    messages.forEach((message, index) => {
      // Get message date (pending messages don't have created_at)
      const messageDate = 'created_at' in message && message.created_at
        ? new Date(message.created_at)
        : new Date();

      // Add message first
      items.push({ type: 'message', data: message });

      // Check if we need a divider AFTER this message
      // (which will appear ABOVE it in the inverted list)
      const nextMessage = messages[index + 1];
      if (nextMessage) {
        const nextDate = 'created_at' in nextMessage && nextMessage.created_at
          ? new Date(nextMessage.created_at)
          : new Date();
        
        if (!isSameDay(messageDate, nextDate)) {
          items.push({
            type: 'divider',
            date: messageDate,
            id: `divider-${messageDate.toISOString()}`,
          });
        }
      }
    });

    return items;
  }, [messages]);

  const renderItem = ({ item }: { item: MessageItem }) => {
    if (item.type === 'divider') {
      return <DateDivider date={item.date} />;
    }

    const message = item.data;

    // Check if it's a pending message
    if ((message as PendingMessage).isPending) {
      const pendingMsg = message as PendingMessage;
      return <PendingMessageBubble text={pendingMsg.text} user={pendingMsg.user} />;
    }

    const isOwnMessage = currentUserId === message.user.id;

    return (
      <View style={[styles.messageContainer, isOwnMessage && styles.ownMessageContainer]}>
        {!isOwnMessage && (
          <Text style={styles.username}>{message.user.nickname}</Text>
        )}
        <View style={[styles.messageBubble, isOwnMessage && styles.ownMessageBubble]}>
          <Text style={[styles.messageText, isOwnMessage && styles.ownMessageText]}>
            {message.text}
          </Text>
          {'created_at' in message && message.created_at && (
            <Text style={[styles.timestamp, isOwnMessage && styles.ownTimestamp]}>
              {formatTime(message.created_at)}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={messagesWithDividers}
      renderItem={renderItem}
      keyExtractor={(item) => 
        item.type === 'divider' ? item.id : item.data.id?.toString() || ''
      }
      inverted
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    marginVertical: 4,
    alignItems: 'flex-start',
  },
  ownMessageContainer: {
    alignItems: 'flex-end',
  },
  username: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
    marginLeft: 12,
    fontWeight: '500',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.gray200,
  },
  ownMessageBubble: {
    backgroundColor: Colors.primary,
  },
  messageText: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  ownMessageText: {
    color: Colors.white,
  },
  timestamp: {
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  ownTimestamp: {
    color: Colors.white + 'CC',
  },
});
