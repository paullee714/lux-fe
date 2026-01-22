/**
 * Lux Design System - Spacing Tokens
 *
 * Consistent spacing values for layout, margins, padding, and gaps.
 * Based on a 4px base unit for precision.
 */

// Base unit in pixels
const BASE_UNIT = 4;

// Pixel values (for reference and calculations)
export const spacingPx = {
  0: 0,
  px: 1,
  0.5: BASE_UNIT * 0.5,  // 2px
  1: BASE_UNIT,          // 4px
  1.5: BASE_UNIT * 1.5,  // 6px
  2: BASE_UNIT * 2,      // 8px
  2.5: BASE_UNIT * 2.5,  // 10px
  3: BASE_UNIT * 3,      // 12px
  3.5: BASE_UNIT * 3.5,  // 14px
  4: BASE_UNIT * 4,      // 16px
  5: BASE_UNIT * 5,      // 20px
  6: BASE_UNIT * 6,      // 24px
  7: BASE_UNIT * 7,      // 28px
  8: BASE_UNIT * 8,      // 32px
  9: BASE_UNIT * 9,      // 36px
  10: BASE_UNIT * 10,    // 40px
  11: BASE_UNIT * 11,    // 44px
  12: BASE_UNIT * 12,    // 48px
  14: BASE_UNIT * 14,    // 56px
  16: BASE_UNIT * 16,    // 64px
  20: BASE_UNIT * 20,    // 80px
  24: BASE_UNIT * 24,    // 96px
  28: BASE_UNIT * 28,    // 112px
  32: BASE_UNIT * 32,    // 128px
  36: BASE_UNIT * 36,    // 144px
  40: BASE_UNIT * 40,    // 160px
  44: BASE_UNIT * 44,    // 176px
  48: BASE_UNIT * 48,    // 192px
  52: BASE_UNIT * 52,    // 208px
  56: BASE_UNIT * 56,    // 224px
  60: BASE_UNIT * 60,    // 240px
  64: BASE_UNIT * 64,    // 256px
  72: BASE_UNIT * 72,    // 288px
  80: BASE_UNIT * 80,    // 320px
  96: BASE_UNIT * 96,    // 384px
} as const;

// REM values (for CSS)
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',   // 2px
  1: '0.25rem',      // 4px
  1.5: '0.375rem',   // 6px
  2: '0.5rem',       // 8px
  2.5: '0.625rem',   // 10px
  3: '0.75rem',      // 12px
  3.5: '0.875rem',   // 14px
  4: '1rem',         // 16px
  5: '1.25rem',      // 20px
  6: '1.5rem',       // 24px
  7: '1.75rem',      // 28px
  8: '2rem',         // 32px
  9: '2.25rem',      // 36px
  10: '2.5rem',      // 40px
  11: '2.75rem',     // 44px
  12: '3rem',        // 48px
  14: '3.5rem',      // 56px
  16: '4rem',        // 64px
  20: '5rem',        // 80px
  24: '6rem',        // 96px
  28: '7rem',        // 112px
  32: '8rem',        // 128px
  36: '9rem',        // 144px
  40: '10rem',       // 160px
  44: '11rem',       // 176px
  48: '12rem',       // 192px
  52: '13rem',       // 208px
  56: '14rem',       // 224px
  60: '15rem',       // 240px
  64: '16rem',       // 256px
  72: '18rem',       // 288px
  80: '20rem',       // 320px
  96: '24rem',       // 384px
} as const;

// Semantic spacing for common use cases
export const semanticSpacing = {
  // Component internals
  component: {
    xs: spacing[1],    // 4px - Very tight internal spacing
    sm: spacing[2],    // 8px - Tight internal spacing
    md: spacing[3],    // 12px - Default internal spacing
    lg: spacing[4],    // 16px - Comfortable internal spacing
    xl: spacing[6],    // 24px - Spacious internal spacing
  },

  // Card padding
  card: {
    sm: spacing[4],    // 16px
    md: spacing[6],    // 24px
    lg: spacing[8],    // 32px
  },

  // Page margins and padding
  page: {
    mobile: spacing[4],   // 16px
    tablet: spacing[6],   // 24px
    desktop: spacing[8],  // 32px
  },

  // Section spacing (vertical rhythm)
  section: {
    xs: spacing[8],    // 32px
    sm: spacing[12],   // 48px
    md: spacing[16],   // 64px
    lg: spacing[24],   // 96px
    xl: spacing[32],   // 128px
  },

  // Stack spacing (between elements)
  stack: {
    xs: spacing[1],    // 4px
    sm: spacing[2],    // 8px
    md: spacing[4],    // 16px
    lg: spacing[6],    // 24px
    xl: spacing[8],    // 32px
  },

  // Inline spacing (horizontal)
  inline: {
    xs: spacing[1],    // 4px
    sm: spacing[2],    // 8px
    md: spacing[3],    // 12px
    lg: spacing[4],    // 16px
    xl: spacing[6],    // 24px
  },

  // Form spacing
  form: {
    gap: spacing[4],       // 16px - Gap between form fields
    groupGap: spacing[6],  // 24px - Gap between form groups
    labelGap: spacing[2],  // 8px - Gap between label and input
  },

  // Grid gaps
  grid: {
    xs: spacing[2],    // 8px
    sm: spacing[4],    // 16px
    md: spacing[6],    // 24px
    lg: spacing[8],    // 32px
  },

  // Touch targets (minimum 44px for accessibility)
  touchTarget: {
    min: spacing[11],  // 44px
    comfortable: spacing[12], // 48px
  },
} as const;

// Container max widths
export const containerWidths = {
  xs: '20rem',     // 320px
  sm: '24rem',     // 384px
  md: '28rem',     // 448px
  lg: '32rem',     // 512px
  xl: '36rem',     // 576px
  '2xl': '42rem',  // 672px
  '3xl': '48rem',  // 768px
  '4xl': '56rem',  // 896px
  '5xl': '64rem',  // 1024px
  '6xl': '72rem',  // 1152px
  '7xl': '80rem',  // 1280px
  full: '100%',
  prose: '65ch',   // Optimal reading width
} as const;

// Border radius
export const radius = {
  none: '0',
  sm: '0.25rem',    // 4px
  DEFAULT: '0.5rem', // 8px
  md: '0.625rem',   // 10px (--radius)
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.25rem', // 20px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// Export unified spacing object
export const spacingTokens = {
  spacing,
  spacingPx,
  semantic: semanticSpacing,
  container: containerWidths,
  radius,
} as const;

export default spacingTokens;
