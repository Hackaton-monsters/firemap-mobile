import { Colors } from '@/src/shared/constants/colors';
import { StyleSheet, View } from 'react-native';

const ChatListSeparator = () => {
  return <View style={styles.separator} />;
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginLeft: 76,
  },
});

export default ChatListSeparator;
