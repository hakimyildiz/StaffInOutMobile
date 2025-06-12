// styles/globalStyles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Color palette (equivalent to Tailwind colors)
export const colors = {
  // Primary colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a',
  },
  // Gray colors
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  // Semantic colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  // Status colors
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

// Spacing (equivalent to Tailwind spacing)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

// Typography (equivalent to Tailwind text sizes)
export const typography = {
  xs: { fontSize: 12, lineHeight: 16 },
  sm: { fontSize: 14, lineHeight: 20 },
  base: { fontSize: 16, lineHeight: 24 },
  lg: { fontSize: 18, lineHeight: 28 },
  xl: { fontSize: 20, lineHeight: 28 },
  '2xl': { fontSize: 24, lineHeight: 32 },
  '3xl': { fontSize: 30, lineHeight: 36 },
  '4xl': { fontSize: 36, lineHeight: 40 },
};

// Global styles that can be reused across components
export const globalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Flexbox utilities
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  
  // Padding utilities
  p1: { padding: spacing.xs },
  p2: { padding: spacing.sm },
  p3: { padding: spacing.md },
  p4: { padding: spacing.lg },
  px2: { paddingHorizontal: spacing.sm },
  px3: { paddingHorizontal: spacing.md },
  px4: { paddingHorizontal: spacing.lg },
  py2: { paddingVertical: spacing.sm },
  py3: { paddingVertical: spacing.md },
  py4: { paddingVertical: spacing.lg },
  
  // Margin utilities
  m1: { margin: spacing.xs },
  m2: { margin: spacing.sm },
  m3: { margin: spacing.md },
  m4: { margin: spacing.lg },
  mx2: { marginHorizontal: spacing.sm },
  mx3: { marginHorizontal: spacing.md },
  mx4: { marginHorizontal: spacing.lg },
  my2: { marginVertical: spacing.sm },
  my3: { marginVertical: spacing.md },
  my4: { marginVertical: spacing.lg },
  
  // Text styles
  textXs: typography.xs,
  textSm: typography.sm,
  textBase: typography.base,
  textLg: typography.lg,
  textXl: typography.xl,
  text2Xl: typography['2xl'],
  text3Xl: typography['3xl'],
  text4Xl: typography['4xl'],
  
  textCenter: { textAlign: 'center' },
  textLeft: { textAlign: 'left' },
  textRight: { textAlign: 'right' },
  
  fontBold: { fontWeight: 'bold' },
  fontSemiBold: { fontWeight: '600' },
  fontMedium: { fontWeight: '500' },
  fontNormal: { fontWeight: 'normal' },
  
  // Background colors
  bgWhite: { backgroundColor: colors.white },
  bgGray50: { backgroundColor: colors.gray[50] },
  bgGray100: { backgroundColor: colors.gray[100] },
  bgGray800: { backgroundColor: colors.gray[800] },
  bgGray900: { backgroundColor: colors.gray[900] },
  bgPrimary: { backgroundColor: colors.primary[500] },
  bgPrimary600: { backgroundColor: colors.primary[600] },
  
  // Text colors
  textWhite: { color: colors.white },
  textBlack: { color: colors.black },
  textGray500: { color: colors.gray[500] },
  textGray600: { color: colors.gray[600] },
  textGray700: { color: colors.gray[700] },
  textGray800: { color: colors.gray[800] },
  textPrimary: { color: colors.primary[500] },
  
  // Border styles
  border: { borderWidth: 1, borderColor: colors.gray[200] },
  borderGray300: { borderColor: colors.gray[300] },
  borderPrimary: { borderColor: colors.primary[500] },
  
  // Border radius
  rounded: { borderRadius: 4 },
  roundedMd: { borderRadius: 6 },
  roundedLg: { borderRadius: 8 },
  roundedXl: { borderRadius: 12 },
  rounded2Xl: { borderRadius: 16 },
  roundedFull: { borderRadius: 9999 },
  
  // Shadow (equivalent to Tailwind shadows)
  shadow: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3, // Android shadow
  },
  shadowMd: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shadowLg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  
  // Width and height utilities
  wFull: { width: '100%' },
  hFull: { height: '100%' },
  wScreen: { width: width },
  hScreen: { height: height },
  
  // Position utilities
  absolute: { position: 'absolute' },
  relative: { position: 'relative' },
  
  // Common button styles
  button: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.primary[500],
  },
  buttonSecondary: {
    backgroundColor: colors.gray[200],
  },
  
  // Input styles
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  inputFocused: {
    borderColor: colors.primary[500],
  },
});

// Theme-specific styles
export const lightTheme = {
  background: colors.gray[50],
  surface: colors.white,
  text: colors.gray[900],
  textSecondary: colors.gray[600],
  border: colors.gray[200],
};

export const darkTheme = {
  background: colors.gray[900],
  surface: colors.gray[800],
  text: colors.white,
  textSecondary: colors.gray[300],
  border: colors.gray[700],
};
