import { useSendMessageMutation } from '@/src/api/chat/hooks';
import { Colors } from '@/src/shared/constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';

type IProps = {
  chatId: number;
  onMessageSent: () => void;
};

export const ChatInput = ({ chatId, onMessageSent }: IProps) => {
  const [message, setMessage] = useState('');
  const sendMessageMutation = useSendMessageMutation();

  const handleSend = async () => {
    if (!message.trim() || sendMessageMutation.isPending) return;

    try {
      await sendMessageMutation.mutateAsync({
        chatId,
        message: message.trim(),
      });
      setMessage('');
      onMessageSent();
    } catch (error) {
      // console.error('Failed to send message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        placeholderTextColor={Colors.textTertiary}
        value={message}
        onChangeText={setMessage}
        multiline
        maxLength={500}
        editable={!sendMessageMutation.isPending}
      />
      <Pressable
        style={[
          styles.sendButton,
          (!message.trim() || sendMessageMutation.isPending) && styles.sendButtonDisabled,
        ]}
        onPress={handleSend}
        disabled={!message.trim() || sendMessageMutation.isPending}
      >
        {sendMessageMutation.isPending ? (
          <ActivityIndicator size="small" color={Colors.white} />
        ) : (
          <Ionicons name="send" size={20} color={Colors.white} />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.gray200,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
