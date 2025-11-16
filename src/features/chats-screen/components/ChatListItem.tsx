import type { ChatListItem as ChatListItemType } from '@/src/api/chat/types';
import { Colors } from '@/src/shared/constants/colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type IProps = {
  item: ChatListItemType;
  onPress: (chat: ChatListItemType) => void;
};

const formatTime = (dateString: string, t: (key: string) => string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return t('common.now');
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return date.toLocaleDateString();
};

const ChatListItem = ({ item, onPress }: IProps) => {
  const { t } = useTranslation();
  const iconName = item.marker.type === 'fire' ? 'local-fire-department' : 'health-and-safety';
  const iconColor = item.marker.type === 'fire' ? Colors.danger : Colors.warning;
  const lastMessage = item.messages?.[0];
  return (
    <Pressable
      style={({ pressed }) => [
        styles.chatItem,
        pressed && styles.chatItemPressed,
      ]}
      onPress={() => onPress(item)}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
        <MaterialIcons name={iconName} size={24} color="white" />
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatTitle} numberOfLines={1}>
            {item.marker.title}
          </Text>
          {lastMessage && (
            <Text style={styles.chatTime}>
              {formatTime(lastMessage.created_at, t)}
            </Text>
          )}
        </View>

        <View style={styles.chatFooter}>
          {lastMessage ? (
            <Text style={styles.lastMessage} numberOfLines={1}>
              {lastMessage.user.nickname}: {lastMessage.text}
            </Text>
          ) : (
            <Text style={styles.noMessages}>{t('chats.noMessages')}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  chatItemPressed: {
    backgroundColor: Colors.gray100,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  chatTime: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  noMessages: {
    fontSize: 14,
    color: Colors.textTertiary,
    fontStyle: 'italic',
  },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default memo(ChatListItem);
