import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from '../../../shared/constants/colors';

type IProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  disabled?: boolean;
};

export const CommentInput = ({
  value,
  onChangeText,
  placeholder,
  error,
  disabled = false,
}: IProps) => {
  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textTertiary}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        editable={!disabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    backgroundColor: Colors.gray100,
    minHeight: 100,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    marginBottom: 8,
  },
});
