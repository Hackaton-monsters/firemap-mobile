import { useMeQuery } from '@/src/api/auth/hooks';
import { useAuthStore } from '@/src/shared/stores/auth.store';
import { Redirect } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setLoading = useAuthStore((state) => state.setLoading);
  
  const { isLoading: isFetchingUser, isError } = useMeQuery();
console.log(isFetchingUser)
  useEffect(() => {
    // When me query completes (success or error), mark loading as complete
    if (!isFetchingUser && isAuthenticated) {
      setLoading(false);
    }
  }, [isFetchingUser, isAuthenticated, setLoading]);

  // Show loading while checking auth or fetching user
  if (isLoading || (isAuthenticated && isFetchingUser)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(main)/map" />;
  }

  return <Redirect href="/auth/login" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

