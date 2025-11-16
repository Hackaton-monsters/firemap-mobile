import { useTranslateMessageMutation } from '@/src/api/chat/hooks';
import type { ChatMessage, ChatUser } from '@/src/api/chat/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getLocales } from 'expo-localization';
import { memo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { MessageBubbleAvatar } from './MessageBubbleAvatar';

type MessagePosition = 'single' | 'first' | 'middle' | 'last';

type IProps = {
  message: ChatMessage;
  currentUser: ChatUser | null;
  chatId: number;
  position?: MessagePosition;
};

const MessageBubble = ({ message, currentUser, chatId, position = 'single' }: IProps) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const translateMutation = useTranslateMessageMutation(chatId);
  const isCurrentUser = currentUser?.id === message.user.id;
  const avatarColor = getAvatarColor(message.user.id);

  const isTranslateFeatureAvailable = !message.translation && message.user.id !== currentUser?.id;

  const handleTranslate = async () => {
    if (message.translation || isTranslating || !isTranslateFeatureAvailable) return;

    setIsTranslating(true);
    const language = getLocales()[0]?.languageCode || 'en';

    try {
      await translateMutation.mutateAsync({
        messageId: message.id,
        language,
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const showAvatar = !isCurrentUser && (position === 'single' || position === 'first');
  const showNickname = position === 'single' || position === 'first';

  return (
    <View style={[styles.container, isCurrentUser && styles.containerRight]}>
      {showAvatar && (
        <MessageBubbleAvatar nickname={message.user.nickname} avatarColor={avatarColor} />
      )}

      <View style={styles.content}>
        {!isCurrentUser && showNickname && (
          <Text style={styles.nickname}>{message.user.nickname}</Text>
        )}
        <View style={styles.bubbleWrapper}>
          <View
            style={[
              styles.bubble,
              isCurrentUser ? styles.bubbleRight : styles.bubbleLeft,
              isCurrentUser
                ? getBubbleRightStyle(position)
                : getBubbleLeftStyle(position),
            ]}
          >
            <Text
              selectable
              style={[
                styles.text,
                isCurrentUser ? styles.textRight : styles.textLeft,
              ]}
            >
              {message.text}
            </Text>
            {message.translation && (
              <>
                <View style={styles.separator} />
                <Text
                  selectable
                  style={[
                    styles.translatedText,
                    isCurrentUser ? styles.textRight : styles.textLeft,
                  ]}
                >
                  {message.translation}
                </Text>
              </>
            )}
            <Text style={[styles.timestamp, isCurrentUser && styles.timestampRight]}>
              {formatTime(message.created_at)}
            </Text>
          </View>

          {
            isTranslateFeatureAvailable && (
              <Pressable
                style={styles.translateButton}
                onPress={handleTranslate}
                disabled={isTranslating || !!message.translation}
              >
                {isTranslating ? (
                  <ActivityIndicator size="small" color="#666" />
                ) : (
                  <Ionicons
                    name="language-outline"
                    size={18}
                    color={message.translation ? '#ccc' : '#666'}
                  />
                )}
              </Pressable>
            )
          }
        </View>
      </View>
    </View>
  );
};

// Get bubble style based on position for left-aligned messages
const getBubbleLeftStyle = (position: MessagePosition) => {
  switch (position) {
    case 'first':
      return { borderTopLeftRadius: 14 };
    case 'last':
      return { borderBottomLeftRadius: 14 };
    default:
      return {};
  }
};

// Get bubble style based on position for right-aligned messages
const getBubbleRightStyle = (position: MessagePosition) => {
  switch (position) {
    case 'first':
      return { borderTopRightRadius: 14 };
    case 'last':
      return { borderBottomRightRadius: 14 };
    default:
      return {};
  }
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

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 2,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  containerRight: {
    justifyContent: 'flex-end',
  },
  content: {
    maxWidth: '70%',
  },
  bubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  translateButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 8,
    marginHorizontal: -4,
  },
  translatedText: {
    fontSize: 14,
    lineHeight: 18,
    fontStyle: 'italic',
    opacity: 0.9,
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
    borderRadius: 8,

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
  timestamp: {
    fontSize: 10,
    color: '#999999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timestampRight: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default memo(MessageBubble);
