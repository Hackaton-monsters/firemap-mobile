import { StyleSheet, Text, View } from 'react-native';
import type { ChatUser } from '../../../api/chat/types';

type IProps = {
  text: string;
  user: ChatUser;
};

const PendingMessageBubble = ({ text }: IProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.bubble}>
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 16,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  content: {
    maxWidth: '70%',
  },
  bubble: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    overflow: 'hidden',
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default PendingMessageBubble;
