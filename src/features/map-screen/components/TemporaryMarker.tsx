import { MarkerView } from '@maplibre/maplibre-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { Colors } from '../../../shared/constants/colors';

type IProps = {
  longitude: number;
  latitude: number;
  onPress?: () => void;
};

export const TemporaryMarker = ({ longitude, latitude, onPress }: IProps) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entry animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.4,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim, scaleAnim]);

  const handlePress = () => {
    // Stop pulse animation
    pulseAnim.stopAnimation();

    // Quick scale up then immediate collapse animation
    Animated.sequence([
      Animated.timing(pressAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onPress?.();
    });
  };

  return (
    <MarkerView
      id="temp-marker"
      coordinate={[longitude, latitude]}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <Pressable onPress={handlePress}>
        <Animated.View
          style={[
            styles.container,
            { transform: [{ scale: Animated.multiply(scaleAnim, pressAnim) }] },
          ]}
        >
          {/* Pulse ring */}
          <Animated.View
            style={[
              styles.pulseRing,
              {
                transform: [{ scale: pulseAnim }],
                opacity: 0.2,
              },
            ]}
          />

          {/* Main marker */}
          <View style={styles.marker}>
            <View style={styles.markerInner} />
          </View>
        </Animated.View>
      </Pressable>
    </MarkerView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
  },
  pulseRing: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.mapPulse,
  },
  marker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.mapMarkerFire,
    borderWidth: 3,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  markerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
});
