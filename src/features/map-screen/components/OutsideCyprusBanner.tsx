import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../shared/constants/colors';

export const OutsideCyprusBanner = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.banner, { top: insets.top + 16 }]}>
      <MaterialIcons name="warning" size={24} color={Colors.warningDark} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{t('map.locationNotice.title')}</Text>
        <Text style={styles.text}>{t('map.locationNotice.message')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: Colors.warningLight,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.warningDark,
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: Colors.warningDark,
    lineHeight: 20,
  },
});
