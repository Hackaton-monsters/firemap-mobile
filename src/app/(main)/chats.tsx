import { useBottomTabBarHeight } from '@/src/shared/hooks/useBottomTabBarHeight';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

export default function ChatsScreen() {
  const { t } = useTranslation();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={[styles.container, { paddingBottom: tabBarHeight }]}>
      <Text style={styles.text}>{t('chats.title')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#666',
  },
});
