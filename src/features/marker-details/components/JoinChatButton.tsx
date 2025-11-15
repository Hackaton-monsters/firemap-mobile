import { useJoinChatMutation } from '@/src/api/chat/hooks';
import { Colors } from '@/src/shared/constants/colors';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

type IProps = {
  chatId: number;
  onJoined: () => void;
};

export const JoinChatButton = ({ chatId, onJoined }: IProps) => {
  const joinChatMutation = useJoinChatMutation();

  const handleJoin = async () => {
    try {
      await joinChatMutation.mutateAsync({ chatId });
      onJoined();
    } catch (error) {
      // console.error('Failed to join chat:', error);
    }
  };

  return (
    <Pressable
      style={[styles.button, joinChatMutation.isPending && styles.buttonDisabled]}
      onPress={handleJoin}
      disabled={joinChatMutation.isPending}
    >
      {joinChatMutation.isPending ? (
        <ActivityIndicator size="small" color={Colors.white} />
      ) : (
        <Text style={styles.buttonText}>Join Chat</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});
