import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useCreateMarkerMutation } from '../../../api/reports/hooks';
import type { MarkerResponse } from '../../../api/reports/types';
import { Colors } from '../../../shared/constants/colors';
import Button from '../../../shared/uikit/Button/Button';
import { usePhotoManagement } from '../hooks/usePhotoManagement';
import { CommentInput } from './CommentInput';
import { IncidentTypeSelector } from './IncidentTypeSelector';
import { PhotoUploader } from './PhotoUploader';

const MAX_PHOTOS = 5;
const MIN_COMMENT_LENGTH = 10;

type IncidentType = 'fire' | 'rescue';

type IProps = {
  latitude: number;
  longitude: number;
  onClose: () => void;
  onSuccess: (response: MarkerResponse) => void;
};

export const ReportForm = ({ latitude, longitude, onClose, onSuccess }: IProps) => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<IncidentType>('fire');
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<{ comment?: string }>({});

  const createMarkerMutation = useCreateMarkerMutation();

  const {
    photos,
    handlePickImage,
    handleRemovePhoto,
    hasUploadingPhotos,
    hasPhotoErrors,
    uploadedPhotoIds,
  } = usePhotoManagement({
    maxPhotos: MAX_PHOTOS,
    photoPermissionTitle: t('report.photoPermissionTitle'),
    photoPermissionMessage: t('report.photoPermissionMessage'),
  });

  const isSubmitting = createMarkerMutation.isPending;
  const isFormValid = comment.trim().length >= MIN_COMMENT_LENGTH && !!selectedType;
  const isFormDisabled = isSubmitting || hasUploadingPhotos;
  const isSubmitDisabled = isFormDisabled || !isFormValid || hasPhotoErrors;

  const handleSubmit = async () => {
    setErrors({});

    try {
      const result = await createMarkerMutation.mutateAsync({
        lat: latitude,
        lon: longitude,
        type: selectedType,
        comment: comment.trim(),
        photos: uploadedPhotoIds,
      });

      onSuccess(result);
      onClose();
    } catch (error) {
      Alert.alert(
        t('report.error'),
        error instanceof Error ? error.message : t('report.submitFailed')
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('report.createReport')}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>{t('report.incidentType')}</Text>
        <IncidentTypeSelector
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          fireLabel={t('report.fire')}
          rescueLabel={t('report.rescue')}
          disabled={isFormDisabled}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t('report.comment')}</Text>
        <CommentInput
          value={comment}
          onChangeText={(text: string) => {
            setComment(text);
            if (errors.comment) setErrors({ ...errors, comment: undefined });
          }}
          placeholder={t('report.commentPlaceholder')}
          error={errors.comment}
          disabled={isFormDisabled}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>
          {t('report.photos')} ({photos.length}/{MAX_PHOTOS})
        </Text>
        <PhotoUploader
          photos={photos}
          maxPhotos={MAX_PHOTOS}
          onAddPhoto={handlePickImage}
          onRemovePhoto={handleRemovePhoto}
          addPhotoLabel={t('report.addPhoto')}
          disabled={isFormDisabled}
        />
      </View>

      <View style={styles.buttons}>
        <Button
          title={t('common.submit')}
          variant="primary"
          onPress={handleSubmit}
          disabled={isSubmitDisabled}
          isLoading={isSubmitting}
          style={styles.submitButton}
          rootStyle={styles.submitButtonRoot}
        />
        <Button
          title={t('common.cancel')}
          variant="secondary"
          onPress={onClose}
          disabled={isSubmitting}
          style={styles.cancelButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray700,
    marginBottom: 12,
  },
  buttons: {
    flexDirection: 'column',
    gap: 8,
    marginTop: 8,
  },
  cancelButton: {
    width: '100%',
  },
  submitButton: {
    width: '100%',
  },
  submitButtonRoot: {
    width: '100%',
  },
});
