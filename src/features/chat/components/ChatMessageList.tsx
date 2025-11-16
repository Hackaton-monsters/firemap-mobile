import type { ChatMessage, ChatUser, DisplayMessage, PendingMessage } from '@/src/api/chat/types';
import { useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import DateDivider from './DateDivider';
import MessageBubble from './MessageBubble';
import PendingMessageBubble from './PendingMessageBubble';

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

type MessagePosition = 'single' | 'first' | 'middle' | 'last';

type MessageItem = 
  | { type: 'message'; data: DisplayMessage; position: MessagePosition }
  | { type: 'divider'; date: Date; id: string };

type IProps = {
  messages: DisplayMessage[];
  currentUser: ChatUser | null;
  chatId: number;
};

export const ChatMessageList = ({ messages, currentUser, chatId }: IProps) => {
  // Insert date dividers between messages and calculate positions for grouping
  const messagesWithDividers = useMemo(() => {
    const items: MessageItem[] = [];

    // Process messages in reverse because list is inverted
    messages.forEach((message, index) => {
      // Get message date (pending messages don't have created_at)
      const messageDate = 'created_at' in message && message.created_at
        ? new Date(message.created_at)
        : new Date();

      // Determine position based on adjacent messages from same user
      // Note: list is inverted, so "previous" message appears BELOW, "next" appears ABOVE
      let position: MessagePosition = 'single';
      
      if (!('isPending' in message)) {
        const prevMessage = index > 0 ? messages[index - 1] : null;
        const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;

        const isSameUserAsPrev = prevMessage && !('isPending' in prevMessage) && 
          prevMessage.user.id === message.user.id;
        const isSameUserAsNext = nextMessage && !('isPending' in nextMessage) && 
          nextMessage.user.id === message.user.id;

        // In inverted list: prev is OLDER (below), next is NEWER (above)
        // first = oldest in group (top visually = rounded bottom in array)
        // last = newest in group (bottom visually = rounded top in array)
        if (isSameUserAsPrev && isSameUserAsNext) {
          position = 'middle';
        } else if (isSameUserAsPrev) {
          // Has older message from same user below, but not above = visually at top of group
          position = 'first';
        } else if (isSameUserAsNext) {
          // Has newer message from same user above, but not below = visually at bottom of group
          position = 'last';
        }
      }

      // Add message with position
      items.push({ type: 'message', data: message, position });

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

    // Regular message - use MessageBubble component
    return (
      <MessageBubble 
        message={message as ChatMessage} 
        currentUser={currentUser} 
        chatId={chatId}
        position={item.position}
      />
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
});
