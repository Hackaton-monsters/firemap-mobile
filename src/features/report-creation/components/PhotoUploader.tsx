import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PhotoGallery } from '../../../shared/components/PhotoGallery/PhotoGallery';
import { Colors } from '../../../shared/constants/colors';
import { PhotoPreview } from './PhotoPreview';
import { PhotoSourcePicker } from './PhotoSourcePicker';

type PhotoState = {
  uri: string;
  id?: number;
  uploading: boolean;
  error?: string;
};

type IProps = {
  photos: PhotoState[];
  maxPhotos: number;
  onTakePhoto: () => void;
  onPickFromGallery: () => void;
  onRemovePhoto: (index: number) => void;
  addPhotoLabel: string;
  disabled?: boolean;
};

export const PhotoUploader = ({
  photos,
  maxPhotos,
  onTakePhoto,
  onPickFromGallery,
  onRemovePhoto,
  addPhotoLabel,
  disabled = false,
}: IProps) => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const handleOpenPicker = () => {
    setIsPickerVisible(true);
  };

  const handleClosePicker = () => {
    setIsPickerVisible(false);
  };

  const handleCamera = () => {
    handleClosePicker();
    onTakePhoto();
  };

  const handleGallery = () => {
    handleClosePicker();
    onPickFromGallery();
  };

  const handlePhotoPress = (index: number) => {
    setSelectedPhotoIndex(index);
    setGalleryVisible(true);
  };

  return (
    <>
      <View style={styles.photosContainer}>
        {photos.length < maxPhotos && (
          <Pressable
            style={styles.addPhotoButton}
            onPress={handleOpenPicker}
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
            onPress={() => handlePhotoPress(index)}
            onDelete={() => onRemovePhoto(index)}
            disabled={disabled}
          />
        ))}
      </View>

      <PhotoSourcePicker
        visible={isPickerVisible}
        onClose={handleClosePicker}
        onCamera={handleCamera}
        onGallery={handleGallery}
      />

      <PhotoGallery
        photos={photos.map((p) => p.uri)}
        initialIndex={selectedPhotoIndex}
        visible={galleryVisible}
        onClose={() => setGalleryVisible(false)}
      />
    </>
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
