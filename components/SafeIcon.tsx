import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import ErrorBoundary from './ErrorBoundary';

interface SafeIconProps {
  children: React.ReactNode;
  size?: number;
  fallbackColor?: string;
}

/**
 * A wrapper for icon components that may use SVG under the hood
 * This catches errors and prevents them from crashing the app
 */
const SafeIcon: React.FC<SafeIconProps> = memo(({ 
  children, 
  size = 24, 
  fallbackColor = 'transparent' 
}) => {
  // Simple colored square as fallback
  const IconFallback = () => (
    <View 
      style={[
        styles.fallback, 
        { 
          width: size, 
          height: size,
          backgroundColor: fallbackColor
        }
      ]} 
    />
  );

  return (
    <ErrorBoundary fallback={<IconFallback />}>
      {children}
    </ErrorBoundary>
  );
});

const styles = StyleSheet.create({
  fallback: {
    borderRadius: 4,
  }
});

export default SafeIcon; 