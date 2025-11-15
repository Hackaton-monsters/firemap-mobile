import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/colors';

type IProps = {
  size?: number;
  strokeWidth?: number;
  color?: string;
  indeterminate?: boolean;
};

const CircularProgress = ({
  size = 40,
  strokeWidth = 3,
  color = Colors.white,
  indeterminate = true,
}: IProps) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (indeterminate) {
      // Rotation animation
      const rotation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      
      // Dash animation
      const spinning = Animated.loop(
        Animated.sequence([
          Animated.timing(spinAnim, {
            toValue: 1,
            duration: 750,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: false,
          }),
          Animated.timing(spinAnim, {
            toValue: 0,
            duration: 750,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: false,
          }),
        ])
      );

      rotation.start();
      spinning.start();

      return () => {
        rotation.stop();
        spinning.stop();
      };
    }
  }, [indeterminate, rotateAnim, spinAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  
  // Create dots for circular progress
  const numDots = 8;
  const dots = Array.from({ length: numDots }, (_, i) => {
    const angle = (i / numDots) * 2 * Math.PI - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    
    return { x, y, angle: i };
  });

  return (
    <Animated.View style={[styles.container, { width: size, height: size, transform: [{ rotate: rotation }] }]}>
      {dots.map((dot, index) => {
        const opacity = 0.2 + (0.8 * index) / numDots;
        return (
          <View
            key={index}
            style={[
              styles.dot,
              {
                width: strokeWidth * 1.5,
                height: strokeWidth * 1.5,
                borderRadius: strokeWidth * 0.75,
                backgroundColor: color,
                opacity,
                position: 'absolute',
                left: dot.x - strokeWidth * 0.75,
                top: dot.y - strokeWidth * 0.75,
              },
            ]}
          />
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {},
});

export default CircularProgress;
