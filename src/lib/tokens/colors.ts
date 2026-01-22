/**
 * Lux Design System - Color Tokens
 *
 * Centralized color definitions for the Lux platform.
 * These tokens ensure consistency across the application.
 */

// Brand Colors - Core identity
export const brand = {
  // Primary Gold/Amber - Main brand color
  gold: {
    DEFAULT: 'hsl(43, 96%, 56%)',
    50: 'hsl(48, 100%, 96%)',
    100: 'hsl(48, 96%, 89%)',
    200: 'hsl(48, 97%, 77%)',
    300: 'hsl(46, 97%, 65%)',
    400: 'hsl(43, 96%, 56%)',
    500: 'hsl(38, 92%, 50%)',
    600: 'hsl(32, 95%, 44%)',
    700: 'hsl(26, 90%, 37%)',
    800: 'hsl(23, 83%, 31%)',
    900: 'hsl(22, 78%, 26%)',
    950: 'hsl(21, 92%, 14%)',
  },

  // Secondary Amber
  amber: {
    DEFAULT: 'hsl(38, 92%, 50%)',
    light: 'hsl(43, 96%, 56%)',
    dark: 'hsl(32, 95%, 44%)',
  },

  // Copper accent for dark mode
  copper: {
    DEFAULT: 'hsl(30, 80%, 45%)',
    light: 'hsl(35, 85%, 55%)',
    dark: 'hsl(25, 75%, 35%)',
  },
} as const;

// Semantic Colors
export const semantic = {
  success: {
    DEFAULT: 'hsl(158, 64%, 42%)',
    light: 'hsl(158, 64%, 52%)',
    dark: 'hsl(158, 64%, 32%)',
    bg: 'hsl(158, 64%, 95%)',
    bgDark: 'hsl(158, 64%, 15%)',
  },
  warning: {
    DEFAULT: 'hsl(38, 92%, 50%)',
    light: 'hsl(43, 96%, 56%)',
    dark: 'hsl(32, 95%, 44%)',
    bg: 'hsl(43, 96%, 95%)',
    bgDark: 'hsl(38, 92%, 15%)',
  },
  error: {
    DEFAULT: 'hsl(0, 84%, 60%)',
    light: 'hsl(0, 84%, 70%)',
    dark: 'hsl(0, 84%, 50%)',
    bg: 'hsl(0, 84%, 95%)',
    bgDark: 'hsl(0, 84%, 15%)',
  },
  info: {
    DEFAULT: 'hsl(210, 80%, 55%)',
    light: 'hsl(210, 80%, 65%)',
    dark: 'hsl(210, 80%, 45%)',
    bg: 'hsl(210, 80%, 95%)',
    bgDark: 'hsl(210, 80%, 15%)',
  },
} as const;

// Background Colors
export const background = {
  light: {
    primary: 'hsl(45, 30%, 98%)',
    secondary: 'hsl(40, 20%, 96%)',
    tertiary: 'hsl(45, 20%, 95%)',
    card: 'hsl(0, 0%, 100%)',
    elevated: 'hsl(0, 0%, 100%)',
  },
  dark: {
    primary: 'hsl(24, 10%, 6%)',
    secondary: 'hsl(24, 10%, 8%)',
    tertiary: 'hsl(24, 10%, 10%)',
    card: 'hsl(24, 10%, 8%)',
    elevated: 'hsl(24, 10%, 12%)',
  },
} as const;

// Text Colors
export const text = {
  light: {
    primary: 'hsl(24, 10%, 10%)',
    secondary: 'hsl(24, 5%, 35%)',
    tertiary: 'hsl(24, 5%, 45%)',
    muted: 'hsl(24, 5%, 55%)',
    inverted: 'hsl(0, 0%, 100%)',
  },
  dark: {
    primary: 'hsl(40, 20%, 96%)',
    secondary: 'hsl(40, 10%, 75%)',
    tertiary: 'hsl(40, 10%, 60%)',
    muted: 'hsl(40, 10%, 50%)',
    inverted: 'hsl(24, 10%, 10%)',
  },
} as const;

// Border Colors
export const border = {
  light: {
    DEFAULT: 'hsl(40, 15%, 89%)',
    subtle: 'hsl(40, 15%, 92%)',
    strong: 'hsl(40, 15%, 80%)',
    focus: 'hsl(38, 92%, 50%)',
  },
  dark: {
    DEFAULT: 'hsl(24, 10%, 16%)',
    subtle: 'hsl(24, 10%, 12%)',
    strong: 'hsl(24, 10%, 22%)',
    focus: 'hsl(43, 96%, 56%)',
  },
} as const;

// Gradient Definitions
export const gradients = {
  // Brand gradients
  amber: 'linear-gradient(to right, hsl(43, 96%, 56%), hsl(32, 95%, 44%))',
  gold: 'linear-gradient(135deg, hsl(48, 97%, 65%), hsl(43, 96%, 56%), hsl(38, 92%, 50%))',
  warm: 'linear-gradient(135deg, hsl(25, 95%, 53%), hsl(38, 92%, 50%), hsl(48, 97%, 65%))',
  sunset: 'linear-gradient(to right, hsl(38, 92%, 50%), hsl(25, 95%, 53%), hsl(350, 84%, 60%))',

  // Utility gradients
  shimmer: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
  glow: 'linear-gradient(135deg, hsla(43, 96%, 56%, 0.4), hsla(38, 92%, 50%, 0.4))',
  overlay: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.5))',
} as const;

// Chart Colors (for data visualization)
export const chart = {
  1: 'hsl(38, 92%, 50%)',
  2: 'hsl(43, 96%, 56%)',
  3: 'hsl(48, 96%, 53%)',
  4: 'hsl(36, 100%, 50%)',
  5: 'hsl(32, 95%, 44%)',
  6: 'hsl(158, 64%, 42%)',
  7: 'hsl(210, 80%, 55%)',
  8: 'hsl(280, 60%, 55%)',
} as const;

// Shadow Colors
export const shadow = {
  light: {
    color: 'hsl(38, 30%, 50%)',
    ambient: 'hsla(38, 30%, 50%, 0.08)',
    strong: 'hsla(38, 30%, 50%, 0.15)',
  },
  dark: {
    color: 'hsl(38, 50%, 20%)',
    ambient: 'hsla(0, 0%, 0%, 0.3)',
    strong: 'hsla(0, 0%, 0%, 0.5)',
  },
} as const;

// Export unified colors object
export const colors = {
  brand,
  semantic,
  background,
  text,
  border,
  gradients,
  chart,
  shadow,
} as const;

export default colors;
