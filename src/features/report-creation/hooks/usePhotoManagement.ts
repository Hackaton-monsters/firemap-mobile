import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";
import { useUploadPhotoMutation } from "../../../api/reports/hooks";

export type PhotoState = {
  uri: string;
  id?: number;
  uploading: boolean;
  error?: string;
};

type UsePhotoManagementProps = {
  maxPhotos: number;
  photoPermissionTitle: string;
  photoPermissionMessage: string;
  cameraPermissionTitle: string;
  cameraPermissionMessage: string;
};

export const usePhotoManagement = ({
  maxPhotos,
  photoPermissionTitle,
  photoPermissionMessage,
  cameraPermissionTitle,
  cameraPermissionMessage,
}: UsePhotoManagementProps) => {
  const [photos, setPhotos] = useState<PhotoState[]>([]);
  const uploadPhotoMutation = useUploadPhotoMutation();

  const uploadPhoto = async (uri: string) => {
    const newPhoto: PhotoState = {
      uri,
      uploading: true,
    };
    setPhotos((prev) => [...prev, newPhoto]);

    const photoIndex = photos.length;

    try {
      const uploadResult = await uploadPhotoMutation.mutateAsync({
        uri,
        name: `photo_${Date.now()}.jpg`,
        type: "image/jpeg",
      });

      setPhotos((prev) =>
        prev.map((p, i) =>
          i === photoIndex ? { ...p, id: uploadResult.id, uploading: false } : p
        )
      );
    } catch (error) {
      setPhotos((prev) =>
        prev.map((p, i) =>
          i === photoIndex
            ? {
                ...p,
                uploading: false,
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : p
        )
      );
    }
  };

  const handlePickFromGallery = async () => {
    if (photos.length >= maxPhotos) {
      Alert.alert("Maximum Photos", `You can only upload up to ${maxPhotos} photos.`);
      return;
    }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(photoPermissionTitle, photoPermissionMessage);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image from gallery");
    }
  };

  const handleTakePhoto = async () => {
    if (photos.length >= maxPhotos) {
      Alert.alert("Maximum Photos", `You can only upload up to ${maxPhotos} photos.`);
      return;
    }

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(cameraPermissionTitle, cameraPermissionMessage);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const hasUploadingPhotos = photos.some((p) => p.uploading);
  const hasPhotoErrors = photos.some((p) => p.error);
  const uploadedPhotoIds: number[] = photos
    .filter((p) => p.id)
    .map((p) => p.id) as number[];

  return {
    photos,
    handlePickFromGallery,
    handleTakePhoto,
    handleRemovePhoto,
    hasUploadingPhotos,
    hasPhotoErrors,
    uploadedPhotoIds,
  };
};
