import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../shared/constants/colors';

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
      <TouchableOpacity style={styles.button} onPress={onOpenSettings}>
        <Text style={styles.buttonText}>{t('map.permissions.openSettings')}</Text>
      </TouchableOpacity>
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
    backgroundColor: Colors.info,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
