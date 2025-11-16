import { useJoinChatMutation } from '@/src/api/chat/hooks';
import Button from '@/src/shared/uikit/Button/Button';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

type IProps = {
  chatId: number;
};

export const JoinChatButton = ({ chatId }: IProps) => {
  const { t } = useTranslation();
  const joinChatMutation = useJoinChatMutation();

  const handleJoin = async () => {
    try {
      await joinChatMutation.mutateAsync({ chatId });
    } catch (error) {
      // console.error('Failed to join chat:', error);
    }
  };

  return (
    <Button
      title={t('chats.joinChat')}
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
