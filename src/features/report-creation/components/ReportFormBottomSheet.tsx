import { BottomSheetProvider } from '@/src/shared/contexts/BottomSheetContext';
import { StyledBottomSheet } from '@/src/shared/uikit/BottomSheet/StyledBottomSheet';
import type BottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useEffect, useRef } from 'react';
import type { MarkerResponse } from '../../../api/reports/types';
import { ReportForm } from './ReportForm';

type IProps = {
  latitude: number;
  longitude: number;
  visible: boolean;
  onClose: () => void;
  onSuccess: (response: MarkerResponse) => void;
};

export const ReportFormBottomSheet = ({
  latitude,
  longitude,
  visible,
  onClose,
  onSuccess,
}: IProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  return (
    <StyledBottomSheet
      ref={bottomSheetRef}
      index={-1}
      enablePanDownToClose
      onClose={onClose}
      enableDynamicSizing={false}
    >
      <BottomSheetProvider value={{ isInsideBottomSheet: true }}>
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>

          {visible && (
            <ReportForm
              latitude={latitude}
              longitude={longitude}
              onClose={onClose}
              onSuccess={onSuccess}
            />
          )}

        </BottomSheetScrollView>
      </BottomSheetProvider>
    </StyledBottomSheet>
  );
};