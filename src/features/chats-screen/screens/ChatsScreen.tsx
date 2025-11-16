import { useAllChatsQuery } from '@/src/api/chat/hooks';
import type { ChatListItem as ChatListItemType } from '@/src/api/chat/types';
import { Colors } from '@/src/shared/constants/colors';
import { serializeChatListItem } from '@/src/shared/helpers/router-params-serializer';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatListItem, ChatListSeparator, EmptyChatsState } from '../components';

export const ChatsScreen = () => {
  const router = useRouter();
  const { data, isLoading } = useAllChatsQuery();
  const insets = useSafeAreaInsets();

  const chats = data?.chats || [];

  const handleChatPress = (chat: ChatListItemType) => {
    router.push({
      pathname: '/chat/[chatId]',
      params: serializeChatListItem(chat),
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (chats.length === 0) {
    return <EmptyChatsState />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={chats}
        renderItem={({ item }) => (
          <ChatListItem item={item} onPress={handleChatPress} />
        )}
        keyExtractor={(item) => item.marker.chatId.toString()}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={ChatListSeparator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingVertical: 8,
    flex: 1,
  },
});

