import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useUploadPhotoMutation } from '../../../api/reports/hooks';

export type PhotoState = {
  uri: string;
  id?: string;
  uploading: boolean;
  error?: string;
};

type UsePhotoManagementProps = {
  maxPhotos: number;
  photoPermissionTitle: string;
  photoPermissionMessage: string;
};

export const usePhotoManagement = ({
  maxPhotos,
  photoPermissionTitle,
  photoPermissionMessage,
}: UsePhotoManagementProps) => {
  const [photos, setPhotos] = useState<PhotoState[]>([]);
  const uploadPhotoMutation = useUploadPhotoMutation();

  const handlePickImage = async () => {
    if (photos.length >= maxPhotos) {
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(photoPermissionTitle, photoPermissionMessage);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newPhoto: PhotoState = {
        uri: result.assets[0].uri,
        uploading: true,
      };
      setPhotos(prev => [...prev, newPhoto]);
      
      const photoIndex = photos.length;
      
      try {
        const uploadResult = await uploadPhotoMutation.mutateAsync({
          uri: result.assets[0].uri,
          name: `photo_${Date.now()}.jpg`,
          type: 'image/jpeg',
        });
        
        setPhotos(prev => 
          prev.map((p, i) => 
            i === photoIndex 
              ? { ...p, id: uploadResult.id, uploading: false } 
              : p
          )
        );
      } catch (error) {
        setPhotos(prev => 
          prev.map((p, i) => 
            i === photoIndex 
              ? { 
                  ...p, 
                  uploading: false, 
                  error: error instanceof Error ? error.message : 'Upload failed' 
                } 
              : p
          )
        );
      }
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const hasUploadingPhotos = photos.some(p => p.uploading);
  const hasPhotoErrors = photos.some(p => p.error);
  const uploadedPhotoIds = photos.filter(p => p.id).map(p => p.id!);

  return {
    photos,
    handlePickImage,
    handleRemovePhoto,
    hasUploadingPhotos,
    hasPhotoErrors,
    uploadedPhotoIds,
  };
};
