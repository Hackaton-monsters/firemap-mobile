
import { StyleSheet, Text, View } from 'react-native';

type IProps = {
  nickname: string;
  avatarColor: string;
};

export function MessageBubbleAvatar({ nickname, avatarColor }: IProps) {
  return (
    <View style={[styles.avatar, { backgroundColor: avatarColor, marginTop: 18 }]}>
      <Text style={styles.avatarText}>
        {nickname.charAt(0).toUpperCase()}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    marginTop: 4,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
