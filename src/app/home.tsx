import { useAuthStore } from '@/src/shared/stores/auth.store';
import Button from '@/src/shared/uikit/Button/Button';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.replace('/auth/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('home.welcome')}</Text>

      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.label}>{t('home.email')}</Text>
          <Text style={styles.value}>{user.email}</Text>

          <Text style={styles.label}>{t('home.nickname')}</Text>
          <Text style={styles.value}>{user.nickname}</Text>

          <Text style={styles.label}>{t('home.role')}</Text>
          <Text style={styles.value}>{user.role}</Text>
        </View>
      )}

      <Button
        title={t('home.logout')}
        onPress={handleLogout}
        variant="danger"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  userInfo: {
    width: '100%',
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 5,
  },
});
