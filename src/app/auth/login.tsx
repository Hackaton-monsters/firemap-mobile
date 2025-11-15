import { useLoginMutation } from '@/src/api/auth/hooks';
import { validateEmail } from '@/src/shared/helpers/validation';
import Button from '@/src/shared/uikit/Button/Button';
import Input from '@/src/shared/uikit/Input/Input';
import TextButton from '@/src/shared/uikit/TextButton/TextButton';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function LoginScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const router = useRouter();

  const loginMutation = useLoginMutation();

  const handleLogin = () => {
    setEmailError('');

    if (!email.trim() || !password.trim()) {
      Alert.alert(t('common.error'), t('auth.login.errors.fillAllFields'));
      return;
    }

    if (!validateEmail(email)) {
      setEmailError(t('auth.login.errors.invalidEmail'));
      return;
    }

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          router.replace('/(main)/map');
        },
        onError: (error) => {
          Alert.alert(t('auth.login.errors.loginFailed'), error.message);
        },
      }
    );
  };

  const navigateToRegister = () => {
    router.push('/auth/register');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>{t('auth.login.title')}</Text>

          <Input
            placeholder={t('auth.login.email')}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loginMutation.isPending}
            error={emailError}
          />

          <Input
            placeholder={t('auth.login.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loginMutation.isPending}
          />

          <Button
            title={t('auth.login.loginButton')}
            onPress={handleLogin}
            isLoading={loginMutation.isPending}
            disabled={loginMutation.isPending}
            style={styles.loginButton}
          />

          <TextButton
            title={t('auth.login.noAccount')}
            onPress={navigateToRegister}
            disabled={loginMutation.isPending}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: 10,
  },
});
