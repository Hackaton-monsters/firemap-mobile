import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../shared/constants/colors';
import Button from '../../../shared/uikit/Button/Button';

type IProps = {
  onOpenSettings: () => void;
};

export const PermissionBanner = ({ onOpenSettings }: IProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.banner, { top: insets.top + 16 }]}>
      <Text style={styles.title}>{t('map.permissions.bannerTitle')}</Text>
      <Text style={styles.text}>{t('map.permissions.bannerMessage')}</Text>
      <Button
        title={t('map.permissions.openSettings')}
        onPress={onOpenSettings}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  button: {
    paddingVertical: 10,
  },
});
