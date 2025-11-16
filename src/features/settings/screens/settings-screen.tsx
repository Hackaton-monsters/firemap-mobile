import { useAuthStore } from '@/src/shared/stores/auth.store';
import Button from '@/src/shared/uikit/Button/Button';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function SettingsScreen() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    clearAuth();
    router.replace('/auth/login');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top }]}
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.profile.title')}</Text>

        {user && (
          <View style={styles.userInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>{t('settings.profile.email')}</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>{t('settings.profile.nickname')}</Text>
              <Text style={styles.value}>{user.nickname}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.logoutSection}>
        <Button
          title={t('settings.logout')}
          onPress={handleLogout}
          variant="danger"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  userInfo: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
  },
  infoRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  logoutSection: {
    marginTop: 'auto',
    paddingTop: 20,
    paddingBottom: 40,
  },
});
