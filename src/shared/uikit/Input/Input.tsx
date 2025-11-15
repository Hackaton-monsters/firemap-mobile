import React from 'react';
import {
    TextInput as RNTextInput,
    StyleSheet,
    Text,
    TextInputProps,
    View,
} from 'react-native';
import { Colors } from '../../constants/colors';

type IProps = TextInputProps & {
  error?: string;
};

const Input = ({ error, style, ...props }: IProps) => {
  return (
    <View style={styles.container}>
      <RNTextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={Colors.textTertiary}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: Colors.white,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
});

export default Input;
