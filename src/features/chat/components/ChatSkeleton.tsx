import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const ChatSkeleton = () => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnimation]);

  const translateX = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((index) => (
        <View
          key={index}
          style={[
            styles.messageRow,
            index % 2 === 0 ? styles.messageRowRight : styles.messageRowLeft,
          ]}
        >
          {index % 2 !== 0 && <View style={styles.avatarSkeleton} />}
          <View style={styles.content}>
            {index % 2 !== 0 && (
              <View style={styles.nicknameSkeleton}>
                <Animated.View
                  style={[
                    styles.shimmerOverlay,
                    { transform: [{ translateX }] },
                  ]}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(255,255,255,0.3)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                  />
                </Animated.View>
              </View>
            )}
            <View
              style={[
                styles.bubbleSkeleton,
                index % 2 === 0
                  ? styles.bubbleSkeletonRight
                  : styles.bubbleSkeletonLeft,
              ]}
            >
              <Animated.View
                style={[styles.shimmerOverlay, { transform: [{ translateX }] }]}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(255,255,255,0.3)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradient}
                />
              </Animated.View>
            </View>
          </View>
          {index % 2 === 0 && <View style={styles.avatarSkeleton} />}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'flex-end',
  },
  messageRowLeft: {
    justifyContent: 'flex-start',
  },
  messageRowRight: {
    justifyContent: 'flex-end',
  },
  avatarSkeleton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  content: {
    maxWidth: '70%',
  },
  nicknameSkeleton: {
    width: 80,
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginBottom: 4,
    marginLeft: 12,
    overflow: 'hidden',
  },
  bubbleSkeleton: {
    height: 40,
    backgroundColor: '#E0E0E0',
    borderRadius: 18,
    overflow: 'hidden',
  },
  bubbleSkeletonLeft: {
    width: 200,
    borderBottomLeftRadius: 4,
  },
  bubbleSkeletonRight: {
    width: 160,
    borderBottomRightRadius: 4,
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    flex: 1,
    width: 300,
  },
});

export default ChatSkeleton;
