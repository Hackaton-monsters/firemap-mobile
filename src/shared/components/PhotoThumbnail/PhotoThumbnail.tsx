import { Colors } from '@/src/shared/constants/colors';
import { getCloudinaryThumbnail } from '@/src/shared/helpers/cloudinary';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image, Pressable, StyleSheet, View } from 'react-native';

type IProps = {
  photoUrl: string;
  onPress: () => void;
  size?: number;
};

export const PhotoThumbnail = ({ photoUrl, onPress, size = 100 }: IProps) => {
  const thumbnailUrl = getCloudinaryThumbnail(photoUrl, size);

  return (
    <Pressable style={[styles.photoThumbnail, { width: size, height: size }]} onPress={onPress}>
      <Image source={{ uri: thumbnailUrl }} style={styles.thumbnailImage} />
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
});
