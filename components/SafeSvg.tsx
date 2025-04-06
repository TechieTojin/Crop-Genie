import React from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import ErrorBoundary from './ErrorBoundary';

interface SafeSvgProps {
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  style?: ViewStyle;
  fallback?: React.ReactNode;
}

/**
 * A wrapper component for SVG elements that catches and handles rendering errors
 */
const SafeSvg: React.FC<SafeSvgProps> = ({ 
  children, 
  width = '100%', 
  height = 200, 
  style,
  fallback
}) => {
  // Create container style with proper type handling
  const containerStyle: ViewStyle = {
    ...style,
    width: width as DimensionValue,
    height: height as DimensionValue,
  };

  // Default fallback component
  const DefaultFallback = () => (
    <View style={[styles.container, containerStyle]} />
  );

  return (
    <ErrorBoundary fallback={fallback || <DefaultFallback />}>
      {children}
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default SafeSvg; 