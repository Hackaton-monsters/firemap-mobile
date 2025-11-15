import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../shared/constants/colors';
import { PhotoPreview } from './PhotoPreview';

type PhotoState = {
  uri: string;
  id?: string;
  uploading: boolean;
  error?: string;
};

type IProps = {
  photos: PhotoState[];
  maxPhotos: number;
  onAddPhoto: () => void;
  onRemovePhoto: (index: number) => void;
  addPhotoLabel: string;
  disabled?: boolean;
};

export const PhotoUploader = ({
  photos,
  maxPhotos,
  onAddPhoto,
  onRemovePhoto,
  addPhotoLabel,
  disabled = false,
}: IProps) => {
  return (
    <View style={styles.photosContainer}>
      {photos.length < maxPhotos && (
        <Pressable
          style={styles.addPhotoButton}
          onPress={onAddPhoto}
          disabled={disabled}
        >
          <MaterialIcons name="add-a-photo" size={32} color={Colors.textSecondary} />
          <Text style={styles.addPhotoText}>{addPhotoLabel}</Text>
        </Pressable>
      )}
      {photos.map((photo, index) => (
        <PhotoPreview
          key={index}
          photo={photo}
          onDelete={() => onRemovePhoto(index)}
          disabled={disabled}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addPhotoText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
