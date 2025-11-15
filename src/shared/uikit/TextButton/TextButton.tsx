import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type IProps = TouchableOpacityProps & {
  title: string;
};

const TextButton = ({ title, style, ...props }: IProps) => {
  return (
    <TouchableOpacity style={[styles.container, style]} {...props}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
  },
  text: {
    color: '#007AFF',
    fontSize: 14,
  },
});

export default TextButton;
