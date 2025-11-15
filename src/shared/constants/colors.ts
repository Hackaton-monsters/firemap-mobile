// Brand Color Palette
export const Colors = {
  // Primary Brand Colors
  primary: '#FF7F50',
  
  // Secondary Colors
  secondary: '#F5F5F5',
  secondaryDark: '#E0E0E0',
  
  // Semantic Colors
  danger: '#FF3B30',
  dangerLight: '#FF6B6B',
  success: '#34C759',
  warning: '#FFC107',
  warningLight: '#FFF3CD',
  warningDark: '#856404',
  info: '#007AFF',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#FAFAFA',
  gray200: '#F5F5F5',
  gray300: '#E0E0E0',
  gray400: '#CCCCCC',
  gray500: '#999999',
  gray600: '#666666',
  gray700: '#333333',
  gray800: '#1A1A1A',
  
  // Text Colors
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textInverse: '#FFFFFF',
  
  // Background Colors
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  backgroundTertiary: '#FAFAFA',
  
  // Border Colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  borderDark: '#CCCCCC',
  
  // Shadow Colors
  shadow: '#000000',
  
  // Overlay Colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
  
  // Map-specific colors
  mapMarkerFire: '#FF6B6B',
  mapMarkerRescue: '#007AFF',
  mapPulse: '#FF6B6B',
  mapCenterOnUser: '#D84315',
} as const;

export type ColorKey = keyof typeof Colors;
