import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

type IProps = TouchableOpacityProps & {
  title: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const Button = ({
  title,
  variant = 'primary',
  isLoading = false,
  style,
  textStyle,
  disabled,
  ...props
}: IProps) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    (disabled || isLoading) && styles.disabled,
    style,
  ];

  const buttonTextStyle = [styles.buttonText, styles[`${variant}Text`], textStyle];

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#007AFF'} />
      ) : (
        <Text style={buttonTextStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  danger: {
    backgroundColor: '#FF3B30',
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#007AFF',
  },
  dangerText: {
    color: '#fff',
  },
});

export default Button;
