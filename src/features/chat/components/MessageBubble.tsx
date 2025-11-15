import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ChatMessage, ChatUser } from '../../../api/chat/types';

type IProps = {
  message: ChatMessage;
  currentUser: ChatUser | null;
};

const MessageBubble = ({ message, currentUser }: IProps) => {
  const isCurrentUser = currentUser?.id === message.user.id;
  const avatarColor = getAvatarColor(message.user.id);

  return (
    <View style={[styles.container, isCurrentUser && styles.containerRight]}>
      {!isCurrentUser && (
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>
            {message.user.nickname.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <View style={styles.content}>
        {!isCurrentUser && (
          <Text style={styles.nickname}>{message.user.nickname}</Text>
        )}
        <View
          style={[
            styles.bubble,
            isCurrentUser ? styles.bubbleRight : styles.bubbleLeft,
          ]}
        >
          <Text
            style={[
              styles.text,
              isCurrentUser ? styles.textRight : styles.textLeft,
            ]}
          >
            {message.text}
          </Text>
        </View>
      </View>
      {isCurrentUser && (
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>
            {message.user.nickname.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
    </View>
  );
};

// Generate consistent color based on user ID
const getAvatarColor = (userId: number): string => {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E2',
  ];
  return colors[userId % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 16,
    alignItems: 'flex-end',
  },
  containerRight: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    maxWidth: '70%',
  },
  nickname: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
    marginLeft: 12,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleLeft: {
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 4,
  },
  bubbleRight: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
  textLeft: {
    color: '#000000',
  },
  textRight: {
    color: '#FFFFFF',
  },
});

export default memo(MessageBubble);
