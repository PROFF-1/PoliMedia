import { Platform } from 'react-native';

const Colors = {
  // Classic Twitter + professional SaaS light palette
  primary: '#1DA1F2',
  primaryDark: '#0d8fd8',
  primaryLight: '#E8F5FD',
  bg: '#FFFFFF',
  surface: '#F7F9FA',
  surfaceAlt: '#EFF3F4',
  border: '#CFD9DE',
  textPrimary: '#0F1419',
  textSecondary: '#536471',
  textLink: '#1DA1F2',
  success: '#00BA7C',
  error: '#F4212E',
  warning: '#FFD400',
  white: '#FFFFFF',
  black: '#000000',

  overlay: 'rgba(0, 0, 0, 0.4)',
  headerGlass: 'rgba(255, 255, 255, 0.85)',
  shadowColor: 'rgba(15, 20, 25, 0.12)',
};

export const Typography = {
  fontFamily: Platform.select({
    // Chirp/TwitterChirp is preferred when bundled by host app.
    ios: 'Helvetica Neue',
    android: 'sans-serif',
    default: 'System',
  }),
  h1: {
    fontSize: 26,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: -0.3,
    color: Colors.textPrimary,
  },
  h2: {
    fontSize: 19,
    fontWeight: '600' as const,
    lineHeight: 24,
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
    color: Colors.textPrimary,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  button: {
    fontSize: 15,
    fontWeight: '700' as const,
    lineHeight: 20,
    color: Colors.white,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  giant: 40,
  huge: 48,
};

export const Radius = {
  input: 4,
  card: 12,
  modal: 16,
  pill: 9999,
};

export default Colors;
