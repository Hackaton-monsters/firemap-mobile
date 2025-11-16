import type { Marker } from '@/src/api/reports/types';
import { BottomSheetProvider } from '@/src/shared/contexts/BottomSheetContext';
import { StyledBottomSheet } from '@/src/shared/uikit/BottomSheet/StyledBottomSheet';
import type BottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { MarkerContent } from './MarkerContent';

type IProps = {
  visible: boolean;
  marker: Marker | null;
  isJoined?: boolean;
  onClose: () => void;
  onNavigateToMarkerPress?: (marker: Marker) => void;
};


export const MarkerBottomSheet = ({
  visible,
  marker,
  onClose,
  onNavigateToMarkerPress,
}: IProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (visible && marker) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible, marker]);

  return (
    <StyledBottomSheet
      ref={bottomSheetRef}
      index={-1}
      enablePanDownToClose
      onClose={onClose}
      android_keyboardInputMode="adjustResize"
    >
      <BottomSheetProvider value={{ isInsideBottomSheet: true }}>
        <BottomSheetView style={styles.contentContainer}>
          {visible && marker && (
            <MarkerContent
              marker={marker}
              onNavigateToMarkerPress={onNavigateToMarkerPress}
            />
          )}
        </BottomSheetView>
      </BottomSheetProvider>
    </StyledBottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    height: '100%',
  },
});
