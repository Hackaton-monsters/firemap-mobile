import { Colors } from '@/src/shared/constants/colors';
import BottomSheet, { BottomSheetProps } from '@gorhom/bottom-sheet';
import { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SNAP_POINTS = ['100%'];

type IProps = BottomSheetProps;

export const StyledBottomSheet = forwardRef<BottomSheet, IProps>(({
  style,
  backgroundStyle,
  handleIndicatorStyle,
  snapPoints = SNAP_POINTS,
  ...props
}, ref) => {
  const insets = useSafeAreaInsets()
  const keyboardBehavior = 'interactive';

  return (
    <BottomSheet
      topInset={insets.top}
      ref={ref}
      keyboardBehavior={keyboardBehavior}
      backgroundStyle={[styles.sheet, backgroundStyle]}
      handleIndicatorStyle={[styles.handle, handleIndicatorStyle]}
      style={[styles.container, style]}
      snapPoints={snapPoints}
      {...props}
    />
  );
});

StyledBottomSheet.displayName = 'StyledBottomSheet';

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    backgroundColor: Colors.white,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  container: {
    flex: 1,
  },
  handle: {
    backgroundColor: Colors.gray400,
  },
});
