import { Colors } from '@/src/shared/constants/colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IProps = {
  visible: boolean;
  onClose: () => void;
  onCamera: () => void;
  onGallery: () => void;
};

export const PhotoSourcePicker = ({ visible, onClose, onCamera, onGallery }: IProps) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={[styles.container, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.content}>
            <Text style={styles.title}>{t('report.addPhoto')}</Text>
            
            <Pressable
              style={styles.option}
              onPress={() => {
                onClose();
                onCamera();
              }}
            >
              <View style={[styles.iconContainer, styles.cameraIconContainer]}>
                <MaterialIcons name="photo-camera" size={28} color={Colors.primary} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{t('report.photoSource.takePhoto')}</Text>
                <Text style={styles.optionDescription}>Use your camera</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
            </Pressable>

            <View style={styles.divider} />

            <Pressable
              style={styles.option}
              onPress={() => {
                onClose();
                onGallery();
              }}
            >
              <View style={[styles.iconContainer, styles.galleryIconContainer]}>
                <MaterialIcons name="photo-library" size={28} color={Colors.success} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{t('report.photoSource.chooseFromGallery')}</Text>
                <Text style={styles.optionDescription}>Pick from your photos</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
            </Pressable>
          </View>

          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>{t('report.photoSource.cancel')}</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    paddingHorizontal: 16,
  },
  content: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconContainer: {
    backgroundColor: `${Colors.primary}15`,
  },
  galleryIconContainer: {
    backgroundColor: `${Colors.success}15`,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  cancelButton: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.danger,
  },
});
