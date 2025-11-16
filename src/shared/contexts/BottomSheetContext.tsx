import { createContext, useContext } from 'react';

type BottomSheetContextType = {
  isInsideBottomSheet: boolean;
};

const BottomSheetContext = createContext<BottomSheetContextType>({
  isInsideBottomSheet: false,
});

export const useBottomSheetContext = () => useContext(BottomSheetContext);

export const BottomSheetProvider = BottomSheetContext.Provider;
