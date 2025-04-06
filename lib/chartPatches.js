/**
 * Patches and workarounds for chart-related components
 * 
 * This file contains fixes for issues related to react-native-chart-kit
 * and other visualization libraries in various environments.
 */

import { Platform } from 'react-native';

// Mock SVG components when needed
const mockSvgComponent = (Component) => {
  // Skip mocking in non-web environments
  if (Platform.OS !== 'web') {
    return Component;
  }

  // For web, check if component needs patching
  return Component;
};

// Patch TouchableProps if needed
const patchTouchableProps = (props) => {
  const patchedProps = { ...props };
  
  // Ensure touchable handlers exist
  if (!patchedProps.onStartShouldSetResponder) {
    patchedProps.onStartShouldSetResponder = () => false;
  }
  
  if (!patchedProps.onResponderTerminationRequest) {
    patchedProps.onResponderTerminationRequest = () => false;
  }
  
  if (!patchedProps.onResponderGrant) {
    patchedProps.onResponderGrant = () => {};
  }
  
  if (!patchedProps.onResponderMove) {
    patchedProps.onResponderMove = () => {};
  }
  
  if (!patchedProps.onResponderRelease) {
    patchedProps.onResponderRelease = () => {};
  }
  
  if (!patchedProps.onResponderTerminate) {
    patchedProps.onResponderTerminate = () => {};
  }
  
  return patchedProps;
};

// Safe wrapper for chart rendering
const SafeChartRenderer = (renderChart) => {
  // Return a wrapper function that handles exceptions
  return (...args) => {
    try {
      return renderChart(...args);
    } catch (error) {
      console.warn('Chart rendering error:', error.message);
      // Return a simple placeholder component when chart fails
      return null;
    }
  };
};

export { 
  mockSvgComponent,
  patchTouchableProps,
  SafeChartRenderer
}; 