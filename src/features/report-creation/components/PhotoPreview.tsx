import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Colors } from '../../../shared/constants/colors';
import CircularProgress from '../../../shared/uikit/CircularProgress/CircularProgress';

type PhotoState = {
  uri: string;
  id?: number;
  uploading: boolean;
  error?: string;
};

type IProps = {
  photo: PhotoState;
  onPress?: () => void;
  onDelete: () => void;
  disabled?: boolean;
};

export const PhotoPreview = ({ photo, onPress, onDelete, disabled = false }: IProps) => {
  return (
    <Pressable style={styles.photoItem} onPress={onPress} disabled={disabled || photo.uploading}>
      <Image source={{ uri: photo.uri }} style={styles.photoImage} />
      
      {photo.uploading && (
        <View style={styles.photoOverlay}>
          <CircularProgress
            size={40}
            strokeWidth={3}
            color={Colors.white}
            indeterminate
          />
        </View>
      )}
      
      {photo.error && (
        <View style={[styles.photoOverlay, styles.errorOverlay]}>
          <MaterialIcons name="error-outline" size={32} color={Colors.white} />
        </View>
      )}
      
      {!photo.uploading && (
        <Pressable
          style={styles.deletePhotoButton}
          onPress={onDelete}
          disabled={disabled}
        >
          <Ionicons name="close" size={16} color={Colors.white} />
        </Pressable>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  photoItem: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorOverlay: {
    backgroundColor: 'rgba(255, 59, 48, 0.7)',
  },
  deletePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
