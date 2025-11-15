import { useJoinChatMutation } from '@/src/api/chat/hooks';
import Button from '@/src/shared/uikit/Button/Button';
import { StyleSheet } from 'react-native';

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
    <Button
      title="Join Chat"
      onPress={handleJoin}
      isLoading={joinChatMutation.isPending}
      disabled={joinChatMutation.isPending}
      rootStyle={styles.buttonRoot}
      style={styles.button}
    />
  );
};

const styles = StyleSheet.create({
  buttonRoot: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  button: {
    paddingVertical: 12,
  },
});
