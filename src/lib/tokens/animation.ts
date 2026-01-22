/**
 * Lux Design System - Animation Tokens
 *
 * Consistent animation definitions for micro-interactions and transitions.
 * All values are optimized for smooth 60fps performance.
 */

// Duration values
export const duration = {
  instant: '0ms',
  fast: '100ms',
  normal: '200ms',
  moderate: '300ms',
  slow: '400ms',
  slower: '500ms',
  slowest: '700ms',

  // Semantic durations
  interaction: '150ms',   // Button clicks, toggles
  transition: '200ms',    // State changes
  animation: '300ms',     // Entrance animations
  pageTransition: '400ms', // Page/route transitions
} as const;

// Duration in milliseconds (for JavaScript)
export const durationMs = {
  instant: 0,
  fast: 100,
  normal: 200,
  moderate: 300,
  slow: 400,
  slower: 500,
  slowest: 700,
  interaction: 150,
  transition: 200,
  animation: 300,
  pageTransition: 400,
} as const;

// Easing curves
export const easing = {
  // Standard easings
  linear: 'linear',
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',    // Material Design standard
  in: 'cubic-bezier(0.4, 0, 1, 1)',           // Accelerating
  out: 'cubic-bezier(0, 0, 0.2, 1)',          // Decelerating
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',      // Standard ease-in-out

  // Expressive easings
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',  // Playful bounce
  smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',           // Smooth deceleration
  snappy: 'cubic-bezier(0.34, 1.56, 0.64, 1)',      // Quick with overshoot
  gentle: 'cubic-bezier(0.25, 0.1, 0.25, 1)',       // Gentle ease

  // Spring-like
  springLight: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  springMedium: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
} as const;

// Keyframe definitions (CSS @keyframes)
export const keyframes = {
  // Fade animations
  fadeIn: {
    from: { opacity: '0' },
    to: { opacity: '1' },
  },
  fadeOut: {
    from: { opacity: '1' },
    to: { opacity: '0' },
  },
  fadeInUp: {
    from: { opacity: '0', transform: 'translateY(10px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  fadeInDown: {
    from: { opacity: '0', transform: 'translateY(-10px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },

  // Slide animations
  slideUp: {
    from: { opacity: '0', transform: 'translateY(20px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  slideDown: {
    from: { opacity: '0', transform: 'translateY(-20px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  slideInLeft: {
    from: { opacity: '0', transform: 'translateX(-20px)' },
    to: { opacity: '1', transform: 'translateX(0)' },
  },
  slideInRight: {
    from: { opacity: '0', transform: 'translateX(20px)' },
    to: { opacity: '1', transform: 'translateX(0)' },
  },

  // Scale animations
  scaleIn: {
    from: { opacity: '0', transform: 'scale(0.95)' },
    to: { opacity: '1', transform: 'scale(1)' },
  },
  scaleOut: {
    from: { opacity: '1', transform: 'scale(1)' },
    to: { opacity: '0', transform: 'scale(0.95)' },
  },

  // Interactive animations
  bounceClick: {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(0.95)' },
    '100%': { transform: 'scale(1)' },
  },
  pulseSubtle: {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.7' },
  },
  pulseGlow: {
    '0%, 100%': { boxShadow: '0 0 20px hsla(43, 96%, 56%, 0.2)' },
    '50%': { boxShadow: '0 0 40px hsla(43, 96%, 56%, 0.4)' },
  },

  // Reveal animation
  reveal: {
    from: { opacity: '0', transform: 'translateY(8px)', filter: 'blur(4px)' },
    to: { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
  },

  // Shimmer effect
  shimmer: {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },

  // Spin
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },

  // Ping (notification)
  ping: {
    '75%, 100%': {
      transform: 'scale(2)',
      opacity: '0',
    },
  },

  // Bounce
  bounce: {
    '0%, 100%': {
      transform: 'translateY(-25%)',
      animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
    },
    '50%': {
      transform: 'translateY(0)',
      animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
    },
  },

  // Accordion
  accordionDown: {
    from: { height: '0' },
    to: { height: 'var(--radix-accordion-content-height)' },
  },
  accordionUp: {
    from: { height: 'var(--radix-accordion-content-height)' },
    to: { height: '0' },
  },
} as const;

// Pre-built animation values (for Tailwind)
export const animations = {
  // Entrance animations
  fadeIn: `fadeIn ${duration.animation} ${easing.out}`,
  fadeInUp: `fadeInUp ${duration.animation} ${easing.smooth}`,
  fadeInDown: `fadeInDown ${duration.animation} ${easing.smooth}`,
  slideUp: `slideUp ${duration.animation} ${easing.smooth}`,
  slideDown: `slideDown ${duration.animation} ${easing.smooth}`,
  slideInLeft: `slideInLeft ${duration.animation} ${easing.smooth}`,
  slideInRight: `slideInRight ${duration.animation} ${easing.smooth}`,
  scaleIn: `scaleIn ${duration.animation} ${easing.out}`,

  // Interactive
  bounceClick: `bounceClick ${duration.fast} ${easing.out}`,
  pulseSubtle: `pulseSubtle 2s ${easing.inOut} infinite`,
  pulseGlow: `pulseGlow 2s ${easing.inOut} infinite`,

  // Continuous
  shimmer: `shimmer 2s ${easing.linear} infinite`,
  spin: `spin 1s ${easing.linear} infinite`,
  ping: `ping 1s ${easing.default} infinite`,
  bounce: `bounce 1s infinite`,

  // Reveal (premium)
  reveal: `reveal ${duration.slow} ${easing.smooth}`,

  // Accordion
  accordionDown: `accordionDown ${duration.normal} ${easing.out}`,
  accordionUp: `accordionUp ${duration.normal} ${easing.out}`,
} as const;

// Stagger delays for list animations
export const staggerDelays = {
  fast: [0, 30, 60, 90, 120, 150],
  normal: [0, 50, 100, 150, 200, 250],
  slow: [0, 75, 150, 225, 300, 375],
} as const;

// Generate stagger CSS (helper function)
export function getStaggerDelay(index: number, speed: 'fast' | 'normal' | 'slow' = 'normal'): string {
  const delays = staggerDelays[speed];
  const delay = delays[index] ?? delays[delays.length - 1] + (index - delays.length + 1) * 50;
  return `${delay}ms`;
}

// Reduced motion alternatives
export const reducedMotion = {
  duration: '0.01ms',
  easing: 'linear',
  noAnimation: 'none',
} as const;

// Transition presets
export const transitions = {
  // Common property transitions
  default: `all ${duration.transition} ${easing.default}`,
  fast: `all ${duration.fast} ${easing.default}`,
  slow: `all ${duration.slow} ${easing.default}`,

  // Specific property transitions
  opacity: `opacity ${duration.transition} ${easing.default}`,
  transform: `transform ${duration.transition} ${easing.smooth}`,
  colors: `color ${duration.transition} ${easing.default}, background-color ${duration.transition} ${easing.default}, border-color ${duration.transition} ${easing.default}`,
  shadow: `box-shadow ${duration.transition} ${easing.default}`,

  // Interactive
  button: `all ${duration.interaction} ${easing.out}`,
  link: `color ${duration.fast} ${easing.default}`,
  card: `transform ${duration.moderate} ${easing.smooth}, box-shadow ${duration.moderate} ${easing.default}`,
} as const;

// Export unified animation object
export const animationTokens = {
  duration,
  durationMs,
  easing,
  keyframes,
  animations,
  staggerDelays,
  reducedMotion,
  transitions,
  getStaggerDelay,
} as const;

export default animationTokens;
