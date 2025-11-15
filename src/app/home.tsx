import { useAuthStore } from '@/src/shared/stores/auth.store';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.replace('/auth/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>

      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>

          <Text style={styles.label}>Nickname:</Text>
          <Text style={styles.value}>{user.nickname}</Text>

          <Text style={styles.label}>Role:</Text>
          <Text style={styles.value}>{user.role}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
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
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
