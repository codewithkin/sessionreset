/**
 * SessionReset Design Tokens
 * Extracted from design HTML files (designs/raw/)
 * Source: SessionReset-All-Screens.html, SessionReset-Main-Dashboard.html
 */

// ─── Colors ──────────────────────────────────────────────────────────────────

export const colors = {
  light: {
    // Backgrounds
    bg: '#FFFFFF',
    surface: '#F5F6F7',
    canvas: '#E9EAEC',

    // Text
    textPrimary: '#17181A',
    textSecondary: '#4A4E54',
    textTertiary: '#6C7076',
    textMuted: '#9DA1A7',
    textDisabled: '#C9CBCF',
    textOnAccent: '#FFFFFF',

    // Accent
    accent: '#3B82F6',
    accentHover: '#1D4ED8',
    accentTint: '#F0F6FF',
    accentShadow: 'rgba(59,130,246,0.32)',

    // Status
    error: '#EF4444',
    errorBg: '#FEF2F2',
    warning: '#F59E0B',
    warningDark: '#D97706',
    success: '#10A37F',
    successText: '#FFFFFF',

    // Brand
    claude: '#CC785C',
    codex: '#10A37F',

    // Borders
    border: '#E6E7EA',
    borderStrong: '#DDE0E4',
    divider: '#EDEEF0',
    borderIcon: '#C9CBCF',

    // Progress
    progressTrack: '#E1E3E6',
    progressFill: '#3B82F6',
    progressWarning: '#F59E0B',

    // Overlay
    overlay: 'rgba(23,24,26,0.5)',
    overlayHeavy: 'rgba(23,24,26,0.5)',

    // Link
    link: '#3B82F6',
    linkHover: '#1D4ED8',
  },
  dark: {
    // Backgrounds
    bg: '#000000',
    surface: '#1A1A1A',
    surfaceAlt: '#111111',
    canvas: '#111111',

    // Text
    textPrimary: '#FFFFFF',
    textSecondary: '#8A8A8A',
    textTertiary: '#6C7076',
    textMuted: '#6C7076',
    textDisabled: '#4A4E54',
    textOnAccent: '#06152B',
    textOnBrand: '#04120D',

    // Accent
    accent: '#60A5FA',
    accentHover: '#93C5FD',
    accentTint: '#0E1A2B',
    accentShadow: 'rgba(96,165,250,0.32)',

    // Status
    error: '#F87171',
    errorBg: '#2A1616',
    warning: '#FBBF24',
    warningDark: '#F59E0B',
    success: '#10A37F',
    successText: '#FFFFFF',

    // Brand
    claude: '#CC785C',
    codex: '#10A37F',

    // Borders
    border: '#2A2A2A',
    borderStrong: '#2A2A2A',
    divider: '#1A1A1A',
    borderIcon: '#4A4E54',
    borderHandle: '#3A3A3A',

    // Progress
    progressTrack: '#2A2A2A',
    progressFill: '#60A5FA',
    progressWarning: '#FBBF24',

    // Overlay
    overlay: 'rgba(0,0,0,0.62)',
    overlayHeavy: 'rgba(0,0,0,0.68)',

    // Link
    link: '#60A5FA',
    linkHover: '#93C5FD',
  },
} as const;

// ─── Typography ──────────────────────────────────────────────────────────────

export const fonts = {
  display: 'Manrope',
  mono: 'JetBrains Mono',
} as const;

/**
 * Loaded font faces, addressed by weight.
 *
 * React Native does not synthesise weights on Android: `fontFamily: 'Manrope'`
 * with `fontWeight: '800'` renders whatever single face was registered under
 * that name, not ExtraBold. Each weight therefore ships as its own family and
 * must be referenced by its exact name, WITHOUT also setting `fontWeight`.
 *
 * The numeric keys mirror the CSS weights used in the design files
 * (`designs/extracted/all-screens-template.html`) so specs translate directly:
 * `font:800 30px Manrope` → `fontFamily: fontFamily.manrope[800]`.
 */
export const fontFamily = {
  manrope: {
    400: 'Manrope_400Regular',
    500: 'Manrope_500Medium',
    600: 'Manrope_600SemiBold',
    700: 'Manrope_700Bold',
    800: 'Manrope_800ExtraBold',
  },
  mono: {
    400: 'JetBrainsMono_400Regular',
    500: 'JetBrainsMono_500Medium',
    700: 'JetBrainsMono_700Bold',
  },
} as const;

export const fontSizes = {
  // Display / Countdown
  displayLg: 44,
  display: 34,
  displaySm: 30,
  displayTimer: 28,

  // Headlines
  h1: 30,
  h2: 26,
  h3: 22,
  h4: 21,
  h5: 19,

  // Body
  bodyLg: 16,
  body: 16,
  bodySm: 15,

  // Captions
  caption: 14,
  captionSm: 13,

  // Micro
  micro: 13,
  microSm: 12,
  badge: 12,

  // Extra Small
  xs: 12,
  xsMono: 12,

  // Tiny
  tiny: 11,
  tinyMono: 11,
  tabLabel: 10,
  tabLabelMuted: 10,
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

export const lineHeights = {
  tight: 1,
  heading: 1.2,
  subheading: 1.25,
  relaxed: 1.3,
  body: 1.45,
  bodyMd: 1.5,
  bodyLong: 1.55,
  bodyQuote: 1.65,
} as const;

export const letterSpacing = {
  tightLg: -2,
  tightMd: -1.5,
  tightSm: -1.4,
  tight: -1,
  tightXs: -0.8,
  tightXxs: -0.5,
  tightMicro: -0.4,
  tightNano: -0.3,
  normal: 0,
  wideXs: 0.4,
  wide: 1,
  wideSm: 1.2,
  wideMd: 1.4,
} as const;

// ─── Spacing ─────────────────────────────────────────────────────────────────

export const spacing = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  8: 8,
  10: 10,
  12: 12,
  14: 14,
  16: 16,
  18: 18,
  20: 20,
  22: 22,
  24: 24,
  26: 26,
  28: 28,
  32: 32,
  34: 34,
  36: 36,
  40: 40,
  52: 52,
  56: 56,
} as const;

// ─── Border Radius ───────────────────────────────────────────────────────────

export const radii = {
  none: 0,
  xs: 1,
  sm: 2,
  md: 4,
  badge: 6,
  lg: 8,
  xl: 10,
  card: 12,
  pill: 14,
  button: 16,
  timer: 18,
  dialog: 20,
  sheet: 24,
  frame: 42,
  full: 999,
} as const;

// ─── Shadows ─────────────────────────────────────────────────────────────────

export const shadows = {
  light: {
    card: '0 1px 4px rgba(0,0,0,0.06)',
    elevated: '0 2px 8px rgba(0,0,0,0.08)',
    button: '0 6px 18px rgba(59,130,246,0.32)',
    fab: '0 8px 20px rgba(59,130,246,0.36)',
    notification: '0 8px 24px rgba(20,22,26,0.10)',
    dialog: '0 8px 32px rgba(0,0,0,0.2)',
    sheet: '0 -12px 40px rgba(20,22,26,0.22)',
    frame: '0 24px 60px rgba(20,22,26,0.16)',
    ring: '0 0 0 4px rgba(59,130,246,0.18)',
  },
  dark: {
    notification: '0 8px 24px rgba(0,0,0,0.5)',
    dialog: '0 8px 32px rgba(0,0,0,0.6)',
    sheet: '0 -12px 40px rgba(0,0,0,0.6)',
    frame: '0 24px 60px rgba(20,22,26,0.26)',
    ring: '0 0 0 4px rgba(96,165,250,0.22)',
  },
} as const;

// ─── Layout ──────────────────────────────────────────────────────────────────

export const layout = {
  screen: {
    width: 390,
    height: 844,
    radius: 42,
  },
  statusBar: {
    height: 52,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    radius: 3,
  },
  tabBar: {
    height: 78,
    padding: { top: 10, horizontal: 26, bottom: 4 },
    iconSize: 16,
    itemWidth: 64,
  },
  fab: {
    size: 60,
    offset: -18,
  },
  button: {
    height: 56,
    heightSm: 52,
    radius: 16,
  },
  toggle: {
    width: 46,
    height: 28,
    radius: 14,
    knob: 22,
    padding: 3,
  },
  progressBar: {
    height: 4,
    radius: 2,
  },
  progressDot: {
    width: 22,
    height: 4,
    radius: 2,
  },
  timeline: {
    timeColWidth: 54,
    dotColWidth: 16,
    lineWidth: 2,
    dotPast: 8,
    dotActive: 12,
    dotFuture: 10,
  },
  bannerAd: {
    height: 58,
    radius: 10,
  },
  notification: {
    iconSize: 38,
    iconRadius: 10,
  },
  dialog: {
    maxWidth: 332,
    iconSize: 64,
    iconRadius: 18,
  },
  sheet: {
    radius: 24,
    handleWidth: 40,
    handleHeight: 4,
  },
  hamburger: {
    size: 36,
    radius: 12,
    lineWidth: 14,
    lineHeight: 2,
  },
  checkCircle: {
    size: 20,
  },
  serviceDot: {
    size: 10,
  },
  quizCard: {
    minHeight: 92,
    radius: 14,
    checkboxSize: 18,
  },
  onboarding: {
    hPadding: 24,
    topPadding: 16,
  },
  dashboard: {
    hPadding: 20,
  },
  settings: {
    hPadding: 20,
  },
} as const;

// ─── Component Tokens ────────────────────────────────────────────────────────

export const components = {
  primaryButton: {
    height: 56,
    radius: 16,
    font: { family: 'Manrope', weight: '700', size: 16 },
    light: { bg: '#3B82F6', text: '#FFFFFF', shadow: '0 6px 18px rgba(59,130,246,0.32)' },
    dark: { bg: '#60A5FA', text: '#06152B' },
  },
  secondaryButton: {
    height: 56,
    radius: 16,
    borderWidth: 2,
    font: { family: 'Manrope', weight: '700', size: 16 },
    light: { border: '#DDE0E4', text: '#17181A' },
    dark: { border: '#2A2A2A', text: '#FFFFFF' },
  },
  fab: {
    size: 60,
    offset: -18,
    font: { family: 'Manrope', weight: '400', size: 30 },
    light: { bg: '#3B82F6', text: '#FFFFFF', shadow: '0 8px 20px rgba(59,130,246,0.36)' },
    dark: { bg: '#60A5FA', text: '#06152B' },
  },
  screenBadge: {
    font: { family: 'JetBrains Mono', weight: '700', size: 12 },
    padding: { vertical: 5, horizontal: 9 },
    radius: 6,
    light: { bg: '#17181A', text: '#FFFFFF' },
    dark: { bg: '#FFFFFF', text: '#17181A' },
  },
  sectionLabel: {
    font: { family: 'JetBrains Mono', weight: '700', size: 11 },
    letterSpacing: 1.4,
    light: { text: '#9DA1A7' },
    dark: { text: '#6C7076' },
  },
  timerCard: {
    radius: 18,
    padding: 18,
    light: { bg: '#F5F6F7' },
    dark: { bg: '#1A1A1A' },
    titleFont: { family: 'Manrope', weight: '700', size: 15 },
    countdownFont: { family: 'JetBrains Mono', weight: '700', size: 28 },
    countdownLetterSpacing: -1.4,
    alertBadgeFont: { family: 'JetBrains Mono', weight: '700', size: 11 },
  },
  priceCard: {
    leftBorderWidth: 3,
    radius: 12,
    padding: 20,
    priceFont: { family: 'JetBrains Mono', weight: '700', size: 34 },
    priceLetterSpacing: -1.5,
    strikethroughFont: { family: 'JetBrains Mono', weight: '500', size: 15 },
    light: { bg: '#F5F6F7', border: '#3B82F6' },
    dark: { bg: '#1A1A1A', border: '#60A5FA' },
  },
  upgradeCard: {
    leftBorderWidth: 3,
    radius: 14,
    padding: 18,
    light: { bg: '#F5F6F7', border: '#3B82F6' },
    dark: { bg: '#1A1A1A', border: '#60A5FA' },
  },
  notificationCard: {
    radius: 18,
    padding: 16,
    light: { bg: '#F5F6F7', shadow: '0 8px 24px rgba(20,22,26,0.10)' },
    dark: { bg: '#1A1A1A', shadow: '0 8px 24px rgba(0,0,0,0.5)' },
  },
  founderCard: {
    radius: 16,
    padding: 28,
    font: { family: 'Manrope', weight: '500', size: 16 },
    lineHeight: 1.65,
    light: { bg: '#F5F6F7' },
    dark: { bg: '#1A1A1A' },
  },
  bottomSheet: {
    radius: 24,
    handleWidth: 40,
    handleHeight: 4,
    handleRadius: 2,
    padding: { top: 12, horizontal: 24 },
    light: { handle: '#DDE0E4', shadow: '0 -12px 40px rgba(20,22,26,0.22)' },
    dark: { handle: '#3A3A3A', shadow: '0 -12px 40px rgba(0,0,0,0.6)' },
  },
  dialog: {
    maxWidth: 332,
    radius: 20,
    padding: 28,
    iconSize: 64,
    iconRadius: 18,
    light: { bg: '#FFFFFF', shadow: '0 8px 32px rgba(0,0,0,0.2)' },
    dark: { bg: '#1A1A1A', shadow: '0 8px 32px rgba(0,0,0,0.6)' },
  },
  toggle: {
    width: 46,
    height: 28,
    radius: 14,
    knobSize: 22,
    padding: 3,
    light: { on: '#3B82F6', knob: '#FFFFFF' },
    dark: { on: '#60A5FA', knob: '#06152B' },
  },
  offsetPill: {
    radius: 999,
    activeFont: { family: 'Manrope', weight: '700', size: 13 },
    inactiveFont: { family: 'JetBrains Mono', weight: '700', size: 13 },
    light: { activeBg: '#3B82F6', activeText: '#FFFFFF', inactiveBorder: '#E6E7EA' },
    dark: { activeBg: '#60A5FA', activeText: '#06152B', inactiveBorder: '#2A2A2A' },
  },
  quizCard: {
    radius: 14,
    padding: 14,
    minHeight: 92,
    checkboxSize: 18,
    serviceDotSize: 9,
    light: { activeBorder: '#3B82F6', activeBg: '#F0F6FF', inactiveBorder: '#E6E7EA' },
    dark: { activeBorder: '#60A5FA', activeBg: '#0E1A2B', inactiveBorder: '#2A2A2A' },
  },
  progressBar: {
    height: 4,
    radius: 2,
    light: { track: '#E1E3E6', fill: '#3B82F6', warning: '#F59E0B' },
    dark: { track: '#2A2A2A', fill: '#60A5FA', warning: '#FBBF24' },
  },
  bannerAd: {
    height: 58,
    radius: 10,
    light: {
      pattern: 'repeating-linear-gradient(135deg, #F0F1F3 0 8px, #E6E7EA 8px 16px)',
      text: '#6C7076',
    },
    dark: {
      pattern: 'repeating-linear-gradient(135deg, #111111 0 8px, #1C1C1C 8px 16px)',
      text: '#8A8A8A',
    },
  },
  timeline: {
    lineWidth: 2,
    light: { line: '#E6E7EA', dotBorder: '#C9CBCF' },
    dark: { line: '#2A2A2A', dotBorder: '#4A4E54' },
  },
  tabBar: {
    iconSize: 16,
    itemWidth: 64,
    padding: { top: 10, horizontal: 26, bottom: 4 },
    light: { activeBg: '#17181A', activeText: '#17181A', inactiveText: '#9DA1A7', border: '#EDEEF0', iconBorder: '#C9CBCF' },
    dark: { activeBg: '#FFFFFF', activeText: '#FFFFFF', inactiveText: '#6C7076', border: '#1A1A1A', iconBorder: '#4A4E54' },
  },
  checklistItem: {
    circleSize: 20,
    font: { family: 'Manrope', weight: '700', size: 11 },
    labelFont: { family: 'Manrope', weight: '500', size: 16 },
    labelLineHeight: 1.45,
    gap: 14,
    light: { circleBg: '#F0F6FF', circleText: '#3B82F6' },
    dark: { circleBg: '#0E1A2B', circleText: '#60A5FA' },
  },
  settingsRow: {
    padding: { vertical: 16, horizontal: 2 },
    titleFont: { family: 'Manrope', weight: '600', size: 15 },
    valueFont: { family: 'Manrope', weight: '500', size: 14 },
    light: { value: '#6C7076', chevron: '#C9CBCF', divider: '#EDEEF0' },
    dark: { value: '#8A8A8A', chevron: '#4A4E54', divider: '#1A1A1A' },
  },
} as const;

// ─── Animations ──────────────────────────────────────────────────────────────

export const animations = {
  fadeIn: { duration: 300, easing: 'ease-out' },
  fadeOut: { duration: 500 },
  sheetSpring: { damping: 0.8 },
  notificationSlide: { duration: 500 },
} as const;
