// Modern, light color palette for CropGenies and Co

// Primary brand colors
export const PRIMARY = {
  LIGHT: '#5FBF80', // Soft green - primary brand color
  DEFAULT: '#38B000', // Vibrant green - main actions
  DARK: '#2E8C0A',   // Deep green - active states
  GRADIENT: ['#5FBF80', '#38B000'], // Gradient for buttons and highlights
};

// Secondary accent colors
export const SECONDARY = {
  TEAL: '#00B4D8',      // Teal blue - secondary actions
  PURPLE: '#9381FF',    // Soft purple - tertiary elements
  CORAL: '#FF7B67',     // Coral - warnings or special features
  AMBER: '#FFBB38',     // Amber - notifications or attention
};

// Neutral colors for backgrounds, text, and UI elements
export const NEUTRAL = {
  WHITE: '#FFFFFF',
  LIGHT_GRAY: '#F8F9FA',
  BACKGROUND: '#F3F8F5', // Very light mint/green tint for backgrounds
  BORDER: '#E0E8E4',     // Light border color
  INPUT: '#F0F5F2',      // Input field background
  PLACEHOLDER: '#A8B9B0', // Placeholder text
  TEXT: {
    PRIMARY: '#2D3A32',  // Almost black with green tint
    SECONDARY: '#5B6D63', // Medium dark gray
    TERTIARY: '#839088',  // Light gray
  },
};

// Semantic colors for status indicators
export const SEMANTIC = {
  SUCCESS: '#4CAF50',
  WARNING: '#FFAB00',
  ERROR: '#FF5252',
  INFO: '#00B4D8',
};

// Dark theme colors (for dark mode support)
export const DARK = {
  BACKGROUND: '#121A15',
  SURFACE: '#1E2720',
  CARD: '#2A342F',
  BORDER: '#34463B',
  TEXT: {
    PRIMARY: '#F3F8F5',
    SECONDARY: '#CBD5D0',
    TERTIARY: '#95A39C',
  },
  // Dark theme keeps the same accent colors as light theme for brand consistency
};

// Gradients for different UI elements
export const GRADIENTS = {
  // Header gradients
  HEADER: {
    LIGHT: ['#E9F5E1', '#F8FFEF'],
    DARK: ['#1A2421', '#0F3123'],
  },
  // Primary action button gradients
  PRIMARY: {
    LIGHT: ['#5FBF80', '#38B000'],
    DARK: ['#38B000', '#2A7F06'],
  },
  // Secondary action gradients
  SECONDARY: {
    LIGHT: ['#81D0E0', '#00B4D8'],
    DARK: ['#00A0C0', '#007A91'],
  },
  // Accent gradients
  ACCENT: {
    CORAL: ['#FF9B8F', '#FF7B67'],
    PURPLE: ['#ADA1FF', '#9381FF'],
    AMBER: ['#FFD175', '#FFBB38'],
  },
};

// Function to get theme-based colors
export const getThemeColors = (isDark: boolean) => {
  return {
    background: isDark ? DARK.BACKGROUND : NEUTRAL.BACKGROUND,
    surface: isDark ? DARK.SURFACE : NEUTRAL.WHITE,
    card: isDark ? DARK.CARD : NEUTRAL.WHITE,
    text: {
      primary: isDark ? DARK.TEXT.PRIMARY : NEUTRAL.TEXT.PRIMARY,
      secondary: isDark ? DARK.TEXT.SECONDARY : NEUTRAL.TEXT.SECONDARY,
      tertiary: isDark ? DARK.TEXT.TERTIARY : NEUTRAL.TEXT.TERTIARY,
    },
    border: isDark ? DARK.BORDER : NEUTRAL.BORDER,
    primary: PRIMARY,
    secondary: SECONDARY,
    semantic: SEMANTIC,
    gradients: GRADIENTS,
  };
};

// Default export for common use case
export default {
  PRIMARY,
  SECONDARY,
  NEUTRAL,
  SEMANTIC,
  DARK,
  GRADIENTS,
  getThemeColors,
}; 