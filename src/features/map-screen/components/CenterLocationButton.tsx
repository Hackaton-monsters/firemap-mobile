import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../shared/constants/colors';

type IProps = {
  onPress: () => void;
  bottomOffset?: number;
};

export const CenterLocationButton = ({ onPress, bottomOffset = 0 }: IProps) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
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

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.92,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      damping: 15,
      stiffness: 300,
      mass: 0.5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.button,
        {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 80],
                outputRange: [0, -80],
              })
            },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.touchable}
      >
        <View style={styles.inner}>
          <MaterialCommunityIcons name="target" size={24} color={Colors.mapCenterOnUser}  />
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
    backgroundColor: Colors.white,
    borderRadius: 30,
    shadowColor: Colors.shadow,
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
