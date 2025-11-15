import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useBottomTabBarHeight = () => {
  const insets = useSafeAreaInsets();
  
  // Tab bar height: 68 (content) + bottom inset (or 12 if no notch)
  const tabBarHeight = 68 + (insets.bottom > 0 ? insets.bottom : 12);
  
  return tabBarHeight;
};
