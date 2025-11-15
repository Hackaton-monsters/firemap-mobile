import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Colors } from '../../constants/colors';

type IProps = TouchableOpacityProps & {
  title: string;
};

const TextButton = ({ title, style, ...props }: IProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.94,
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
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      <Animated.View style={[styles.container, style, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.text}>{title}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
  },
  text: {
    color: Colors.info,
    fontSize: 14,
  },
});

export default TextButton;
