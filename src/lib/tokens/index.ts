/**
 * Lux Design System - Token Exports
 *
 * Unified export of all design tokens for the Lux platform.
 */

// Color tokens
export { default as colors } from './colors';
export {
  brand,
  semantic,
  background,
  text,
  border,
  gradients,
  chart,
  shadow,
} from './colors';

// Spacing tokens
export { default as spacingTokens } from './spacing';
export {
  spacing,
  spacingPx,
  semanticSpacing,
  containerWidths,
  radius,
} from './spacing';

// Animation tokens
export { default as animationTokens } from './animation';
export {
  duration,
  durationMs,
  easing,
  keyframes,
  animations,
  staggerDelays,
  reducedMotion,
  transitions,
  getStaggerDelay,
} from './animation';

// Typography tokens
export { default as typography } from './typography';
export {
  fontFamily,
  fontSize,
  fontSizePx,
  lineHeight,
  fontWeight,
  letterSpacing,
  textStyles,
  responsiveMultipliers,
} from './typography';

// Combined design tokens object
import colorsModule from './colors';
import spacingModule from './spacing';
import animationModule from './animation';
import typographyModule from './typography';

export const tokens = {
  colors: colorsModule,
  spacing: spacingModule,
  animation: animationModule,
  typography: typographyModule,
} as const;

export default tokens;
