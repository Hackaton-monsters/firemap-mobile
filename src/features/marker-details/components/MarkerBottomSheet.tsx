import type { Marker } from '@/src/api/reports/types';
import { useBottomTabBarHeight } from '@/src/shared/hooks/useBottomTabBarHeight';
import { StyledBottomSheet } from '@/src/shared/uikit/BottomSheet/StyledBottomSheet';
import type BottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { MarkerContent } from './MarkerContent';

type IProps = {
  visible: boolean;
  marker: Marker | null;
  currentUserId?: string;
  isJoined?: boolean;
  onClose: () => void;
};

export const MarkerBottomSheet = ({
  visible,
  marker,
  currentUserId,
  isJoined = false,
  onClose,
}: IProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [joined, setJoined] = useState(isJoined);
  const snapPoints = useMemo(() => ['90%'], []);
  const tabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    if (visible && marker) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible, marker]);

  const handleJoinSuccess = () => {
    setJoined(true);
  };

  return (
    <StyledBottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
    >
      <BottomSheetView style={[styles.contentContainer, { paddingBottom: tabBarHeight }]}>
        {visible && marker && (
          <MarkerContent
            marker={marker}
            currentUserId={currentUserId}
            isJoined={joined}
            onJoinSuccess={handleJoinSuccess}
          />
        )}
      </BottomSheetView>
    </StyledBottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    height: '100%',
  },
});
