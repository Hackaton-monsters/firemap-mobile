import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, StyleSheet, View } from 'react-native';
import Button from '../../../shared/uikit/Button/Button';

type IProps = {
  onAddPress: () => void;
  onCancelPress: () => void;
  visible: boolean;
};

export const AddMarkerButton = ({ onAddPress, onCancelPress, visible }: IProps) => {
  const { t } = useTranslation();
  const slideAnim = useRef(new Animated.Value(100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          stiffness: 300,
          mass: 1,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setShouldRender(false));
    }
  }, [visible, slideAnim, opacityAnim]);

  if (!shouldRender) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.buttonRow}>
        <Button
          title={t('common.cancel')}
          onPress={onCancelPress}
          variant="secondary"
          style={styles.cancelButton}
        />
        <Button
          title={t('map.addReport')}
          onPress={onAddPress}
          variant="primary"
          style={styles.addButton}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  cancelButton: {
    flex: 1,
  },
  addButton: {
    flex: 2,
  },
});
