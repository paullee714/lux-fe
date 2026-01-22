/**
 * Lux Design System - Typography Tokens
 *
 * Consistent typography definitions for the Lux platform.
 * Optimized for both Korean and English text.
 */

// Font families
export const fontFamily = {
  sans: [
    'Pretendard',
    '-apple-system',
    'BlinkMacSystemFont',
    'system-ui',
    'Roboto',
    'Helvetica Neue',
    'Segoe UI',
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    'Malgun Gothic',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    'sans-serif',
  ],
  display: [
    'Pretendard',
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    'sans-serif',
  ],
  mono: [
    'ui-monospace',
    'SFMono-Regular',
    'Menlo',
    'Monaco',
    'Consolas',
    'Liberation Mono',
    'Courier New',
    'monospace',
  ],
} as const;

// Font sizes (rem values)
export const fontSize = {
  xs: '0.75rem',      // 12px
  sm: '0.875rem',     // 14px
  base: '1rem',       // 16px
  lg: '1.125rem',     // 18px
  xl: '1.25rem',      // 20px
  '2xl': '1.5rem',    // 24px
  '3xl': '1.875rem',  // 30px
  '4xl': '2.25rem',   // 36px
  '5xl': '3rem',      // 48px
  '6xl': '3.75rem',   // 60px
  '7xl': '4.5rem',    // 72px
  '8xl': '6rem',      // 96px
  '9xl': '8rem',      // 128px
} as const;

// Font sizes in pixels (for reference)
export const fontSizePx = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
  '7xl': 72,
  '8xl': 96,
  '9xl': 128,
} as const;

// Line heights
export const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const;

// Font weights
export const fontWeight = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

// Letter spacing
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

// Typography presets (for common use cases)
export const textStyles = {
  // Display styles (for heroes, large headings)
  display: {
    '2xl': {
      fontSize: fontSize['7xl'],
      lineHeight: lineHeight.none,
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.tight,
    },
    xl: {
      fontSize: fontSize['6xl'],
      lineHeight: lineHeight.none,
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.tight,
    },
    lg: {
      fontSize: fontSize['5xl'],
      lineHeight: lineHeight.none,
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.tight,
    },
    md: {
      fontSize: fontSize['4xl'],
      lineHeight: lineHeight.tight,
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.tight,
    },
    sm: {
      fontSize: fontSize['3xl'],
      lineHeight: lineHeight.tight,
      fontWeight: fontWeight.semibold,
      letterSpacing: letterSpacing.tight,
    },
  },

  // Heading styles
  heading: {
    h1: {
      fontSize: fontSize['4xl'],
      lineHeight: lineHeight.tight,
      fontWeight: fontWeight.semibold,
      letterSpacing: letterSpacing.tight,
    },
    h2: {
      fontSize: fontSize['3xl'],
      lineHeight: lineHeight.tight,
      fontWeight: fontWeight.semibold,
      letterSpacing: letterSpacing.tight,
    },
    h3: {
      fontSize: fontSize['2xl'],
      lineHeight: lineHeight.snug,
      fontWeight: fontWeight.semibold,
      letterSpacing: letterSpacing.tight,
    },
    h4: {
      fontSize: fontSize.xl,
      lineHeight: lineHeight.snug,
      fontWeight: fontWeight.semibold,
      letterSpacing: letterSpacing.normal,
    },
    h5: {
      fontSize: fontSize.lg,
      lineHeight: lineHeight.normal,
      fontWeight: fontWeight.medium,
      letterSpacing: letterSpacing.normal,
    },
    h6: {
      fontSize: fontSize.base,
      lineHeight: lineHeight.normal,
      fontWeight: fontWeight.medium,
      letterSpacing: letterSpacing.normal,
    },
  },

  // Body text styles
  body: {
    lg: {
      fontSize: fontSize.lg,
      lineHeight: lineHeight.relaxed,
      fontWeight: fontWeight.normal,
    },
    md: {
      fontSize: fontSize.base,
      lineHeight: lineHeight.relaxed,
      fontWeight: fontWeight.normal,
    },
    sm: {
      fontSize: fontSize.sm,
      lineHeight: lineHeight.normal,
      fontWeight: fontWeight.normal,
    },
    xs: {
      fontSize: fontSize.xs,
      lineHeight: lineHeight.normal,
      fontWeight: fontWeight.normal,
    },
  },

  // UI text styles
  ui: {
    button: {
      fontSize: fontSize.sm,
      lineHeight: lineHeight.tight,
      fontWeight: fontWeight.semibold,
      letterSpacing: letterSpacing.normal,
    },
    buttonSm: {
      fontSize: fontSize.xs,
      lineHeight: lineHeight.tight,
      fontWeight: fontWeight.semibold,
      letterSpacing: letterSpacing.normal,
    },
    buttonLg: {
      fontSize: fontSize.base,
      lineHeight: lineHeight.tight,
      fontWeight: fontWeight.semibold,
      letterSpacing: letterSpacing.normal,
    },
    label: {
      fontSize: fontSize.sm,
      lineHeight: lineHeight.none,
      fontWeight: fontWeight.medium,
    },
    caption: {
      fontSize: fontSize.xs,
      lineHeight: lineHeight.normal,
      fontWeight: fontWeight.normal,
    },
    overline: {
      fontSize: fontSize.xs,
      lineHeight: lineHeight.normal,
      fontWeight: fontWeight.semibold,
      letterSpacing: letterSpacing.wider,
      textTransform: 'uppercase' as const,
    },
  },

  // Special styles
  special: {
    quote: {
      fontSize: fontSize.xl,
      lineHeight: lineHeight.relaxed,
      fontWeight: fontWeight.normal,
      fontStyle: 'italic' as const,
    },
    code: {
      fontSize: fontSize.sm,
      lineHeight: lineHeight.normal,
      fontWeight: fontWeight.normal,
      fontFamily: fontFamily.mono,
    },
    stat: {
      fontSize: fontSize['4xl'],
      lineHeight: lineHeight.none,
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.tight,
    },
  },
} as const;

// Responsive font size multipliers
export const responsiveMultipliers = {
  mobile: 0.875,   // 87.5% of desktop size
  tablet: 0.9375,  // 93.75% of desktop size
  desktop: 1,      // 100% (base)
} as const;

// Export unified typography object
export const typography = {
  fontFamily,
  fontSize,
  fontSizePx,
  lineHeight,
  fontWeight,
  letterSpacing,
  textStyles,
  responsiveMultipliers,
} as const;

export default typography;
