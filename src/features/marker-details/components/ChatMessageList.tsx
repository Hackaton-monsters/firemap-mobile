import type { ChatMessage } from '@/src/api/chat/types';
import { Colors } from '@/src/shared/constants/colors';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

type IProps = {
  messages: ChatMessage[];
  currentUserId?: string;
};

export const ChatMessageList = ({ messages, currentUserId }: IProps) => {
  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isOwnMessage = currentUserId === item.userId;
    
    return (
      <View style={[styles.messageContainer, isOwnMessage && styles.ownMessageContainer]}>
        {!isOwnMessage && (
          <Text style={styles.username}>{item.username}</Text>
        )}
        <View style={[styles.messageBubble, isOwnMessage && styles.ownMessageBubble]}>
          <Text style={[styles.messageText, isOwnMessage && styles.ownMessageText]}>
            {item.message}
          </Text>
          <Text style={[styles.timestamp, isOwnMessage && styles.ownTimestamp]}>
            {formatTime(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={messages}
      renderItem={renderMessage}
      keyExtractor={(item) => item.id.toString()}
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
