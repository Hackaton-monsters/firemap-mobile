import { useRegisterMutation } from '@/src/api/auth/hooks';
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

export default function RegisterScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  const registerMutation = useRegisterMutation();

  const handleRegister = () => {
    setEmailError('');
    setPasswordError('');

    if (!email.trim() || !password.trim() || !nickname.trim()) {
      Alert.alert(t('common.error'), t('auth.register.errors.fillAllFields'));
      return;
    }

    if (!validateEmail(email)) {
      setEmailError(t('auth.register.errors.invalidEmail'));
      return;
    }

    if (password.length < 6) {
      setPasswordError(t('auth.register.errors.passwordTooShort'));
      return;
    }

    registerMutation.mutate(
      { email, password, nickname },
      {
        onSuccess: () => {
          router.replace('/home');
        },
        onError: (error) => {
          Alert.alert(t('auth.register.errors.registrationFailed'), error.message);
        },
      }
    );
  };

  const navigateToLogin = () => {
    router.push('/auth/login');
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
          <Text style={styles.title}>{t('auth.register.title')}</Text>

          <Input
            placeholder={t('auth.register.nickname')}
            value={nickname}
            onChangeText={setNickname}
            editable={!registerMutation.isPending}
          />

          <Input
            placeholder={t('auth.register.email')}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!registerMutation.isPending}
            error={emailError}
          />

          <Input
            placeholder={t('auth.register.password')}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError('');
            }}
            secureTextEntry
            editable={!registerMutation.isPending}
            error={passwordError}
          />

          <Button
            title={t('auth.register.registerButton')}
            onPress={handleRegister}
            isLoading={registerMutation.isPending}
            disabled={registerMutation.isPending}
            style={styles.registerButton}
          />

          <TextButton
            title={t('auth.register.haveAccount')}
            onPress={navigateToLogin}
            disabled={registerMutation.isPending}
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
  registerButton: {
    marginTop: 10,
  },
});
