import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Marker } from '../../../api/reports/types';
import { Colors } from '../../../shared/constants/colors';
import Button from '../../../shared/uikit/Button/Button';

type IProps = {
  isNew: boolean;
  marker: Marker;
  onClose: () => void;
  onOpenReport: () => void;
};

export const ReportSuccessNotice = ({
  isNew,
  marker,
  onClose,
  onOpenReport,
}: IProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-200)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 300,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-close after 10 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -200,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  const handleOpenReport = () => {
    handleClose();
    // Small delay to let animation complete
    setTimeout(() => {
      onOpenReport();
    }, 300);
  };

  const title = isNew
    ? t('report.success.newMarkerTitle')
    : t('report.success.mergedTitle');

  const message = isNew
    ? t('report.success.newMarkerMessage')
    : t('report.success.mergedMessage');

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.notice,
          {
            top: insets.top + 16,
            transform: [{ translateY: slideAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <Pressable style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>

        <View style={styles.content}>
          <Text style={styles.icon}>{isNew ? '✅' : '📍'}</Text>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>
        </View>

        <Button
          title={t('report.success.openReport')}
          variant="primary"
          onPress={handleOpenReport}
          style={styles.button}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2000,
  },
  notice: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  closeIcon: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingRight: 32,
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  button: {
    marginTop: 8,
  },
});
