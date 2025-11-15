import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import type { ChatUser } from '../../../api/chat/types';
import { Colors } from '../../../shared/constants/colors';

type IProps = {
  text: string;
  user: ChatUser;
};

const PendingMessageBubble = ({ text, user }: IProps) => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnimation]);

  const translateX = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const avatarColor = getAvatarColor(user.id);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.bubble}>
          <LinearGradient
            colors={[Colors.primary + '60', Colors.primary + '40', Colors.primary + '60']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          >
            <Animated.View
              style={[
                styles.shimmerOverlay,
                { transform: [{ translateX }] },
              ]}
            >
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
              />
            </Animated.View>
          </LinearGradient>
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
      <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
        <Text style={styles.avatarText}>
          {user.nickname.charAt(0).toUpperCase()}
        </Text>
      </View>
    </View>
  );
};

const getAvatarColor = (userId: number): string => {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E2',
  ];
  return colors[userId % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 16,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    maxWidth: '70%',
  },
  bubble: {
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
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    flex: 1,
    width: 200,
  },
});

export default PendingMessageBubble;
