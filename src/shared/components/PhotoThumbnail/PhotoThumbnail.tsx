import { Colors } from '@/src/shared/constants/colors';
import { getCloudinaryThumbnail } from '@/src/shared/helpers/cloudinary';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, View } from 'react-native';

type IProps = {
  photoUrl: string;
  onPress: () => void;
  size?: number;
};

export const PhotoThumbnail = ({ photoUrl, onPress, size = 100 }: IProps) => {
  const thumbnailUrl = getCloudinaryThumbnail(photoUrl, size);
  const [isLoading, setIsLoading] = useState(true);
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
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
    }
  }, [isLoading, shimmerAnimation]);

  const translateX = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-size * 3, size * 3],
  });

  return (
    <Pressable style={[styles.photoThumbnail, { width: size, height: size }]} onPress={onPress}>
      {isLoading && (
        <View style={styles.loadingSkeleton}>
          <Animated.View
            style={[styles.shimmerOverlay, { transform: [{ translateX }] }]}
          >
            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.gradient, { width: size * 3 }]}
            />
          </Animated.View>
        </View>
      )}
      <Image
        source={{ uri: thumbnailUrl }}
        style={styles.thumbnailImage}
        onLoadEnd={() => setIsLoading(false)}
      />
      <View style={styles.thumbnailOverlay}>
        <MaterialIcons name="zoom-in" size={24} color={Colors.white} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  photoThumbnail: {
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
  },
  loadingSkeleton: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    flex: 1,
  },
});
