import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type IProps = {
  onPress: () => void;
  bottomOffset?: number;
};

export const CenterLocationButton = ({ onPress, bottomOffset = 0 }: IProps) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const previousOffset = useRef(0);

  useEffect(() => {
    if (bottomOffset !== previousOffset.current) {
      Animated.spring(slideAnim, {
        toValue: bottomOffset,
        useNativeDriver: true,
        damping: 20,
        stiffness: 300,
        mass: 1,
      }).start();
      previousOffset.current = bottomOffset;
    }
  }, [bottomOffset, slideAnim]);

  return (
    <Animated.View
      style={[
        styles.button,
        {
          transform: [{ translateY: slideAnim.interpolate({
            inputRange: [0, 80],
            outputRange: [0, -80],
          }) }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.touchable}
      >
        <View style={styles.inner}>
          <Text style={styles.icon}>📍</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: '#fff',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  touchable: {
    borderRadius: 30,
  },
  inner: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
  },
});
