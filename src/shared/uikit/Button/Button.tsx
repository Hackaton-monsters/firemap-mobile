import React, { useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../constants/colors';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

type IProps = TouchableOpacityProps & {
  title: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
  style?: ViewStyle;
  rootStyle?: ViewStyle;
  textStyle?: TextStyle;
};

const Button = ({
  title,
  variant = 'primary',
  isLoading = false,
  style,
  textStyle,
  disabled,
  rootStyle,
  ...props
}: IProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.96,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      damping: 15,
      stiffness: 300,
      mass: 0.5,
      useNativeDriver: true,
    }).start();
  };

  const buttonStyle = [
    styles.button,
    styles[variant],
    (disabled || isLoading) && styles.disabled,
    style,
  ];

  const buttonTextStyle = [styles.buttonText, styles[`${variant}Text`], textStyle];

  const getActivityIndicatorColor = () => {
    if (variant === 'primary') return Colors.white;
    if (variant === 'danger') return Colors.white;
    return Colors.info;
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || isLoading}
      style={rootStyle}
      {...props}
    >
      <Animated.View style={[buttonStyle, { transform: [{ scale: scaleAnim }] }]}>
        {isLoading ? (
          <ActivityIndicator color={getActivityIndicatorColor()} />
        ) : (
          <Text style={buttonTextStyle}>{title}</Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  danger: {
    backgroundColor: Colors.danger,
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.primary,
  },
  dangerText: {
    color: Colors.white,
  },
});

export default Button;
