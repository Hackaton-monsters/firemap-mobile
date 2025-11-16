import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { forwardRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { useBottomSheetContext } from '../../contexts/BottomSheetContext';

type IProps = TextInputProps;

/**
 * Context-aware TextInput that automatically uses BottomSheetTextInput
 * when rendered inside a BottomSheet, or regular TextInput otherwise.
 */
export const AdaptiveTextInput = forwardRef<TextInput, IProps>((props, ref) => {
  const { isInsideBottomSheet } = useBottomSheetContext();

  console.log('AdaptiveTextInput - isInsideBottomSheet:', isInsideBottomSheet);
  if (isInsideBottomSheet) {
    return <BottomSheetTextInput ref={ref as any} {...props} />;
  }

  return <TextInput ref={ref} {...props} />;
});

AdaptiveTextInput.displayName = 'AdaptiveTextInput';
