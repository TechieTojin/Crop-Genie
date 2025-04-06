import React from 'react';
import { View, Text, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import ErrorBoundary from './ErrorBoundary';

interface SafeChartProps {
  children: React.ReactNode;
  height?: number;
  width?: number | string;
  title?: string;
}

/**
 * A wrapper component for charts that catches and handles SVG-related errors
 */
const SafeChart = ({ children, height = 200, width = '100%', title }: SafeChartProps) => {
  const { isDark, primaryColor } = useThemeStore();

  // Create style with proper type handling
  const containerStyle: ViewStyle = {
    height,
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
  };
  
  // Set width with proper type assertion
  containerStyle.width = width as DimensionValue;

  // Custom fallback component specific for charts
  const ChartErrorFallback = () => (
    <View 
      style={[
        styles.container, 
        containerStyle
      ]}
    >
      {title && (
        <Text style={[
          styles.title,
          { color: isDark ? '#CCCCCC' : '#666666' }
        ]}>
          {title}
        </Text>
      )}
      <Text style={[
        styles.errorText,
        { color: isDark ? '#BBBBBB' : '#888888' }
      ]}>
        Unable to load chart
      </Text>
    </View>
  );

  return (
    <ErrorBoundary fallback={<ChartErrorFallback />}>
      {children}
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 12,
  }
});

export default SafeChart; 