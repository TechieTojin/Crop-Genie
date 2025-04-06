/**
 * This file provides shims for modules that might cause issues
 * during the Metro bundling process.
 */

// Polyfill for window in SSR environment
if (typeof global !== 'undefined' && typeof window === 'undefined') {
  // Create minimal window object for SSR
  global.window = {
    localStorage: {
      getItem: () => null,
      setItem: () => null,
      removeItem: () => null
    },
    document: {
      createElement: () => ({}),
      head: { appendChild: () => null }
    },
    navigator: { userAgent: 'node' }
  };
}

// Polyfill for AsyncStorage in SSR environment
if (typeof global !== 'undefined') {
  // Create mock AsyncStorage for SSR
  global.AsyncStorageShim = {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
    multiGet: () => Promise.resolve([]),
    multiSet: () => Promise.resolve(),
    multiRemove: () => Promise.resolve(),
    getAllKeys: () => Promise.resolve([]),
    clear: () => Promise.resolve(),
    flushGetRequests: () => null,
    mergeItem: () => Promise.resolve(),
    multiMerge: () => Promise.resolve(),
  };

  // SVG shims
  global.resolveAssetUri = (href) => href;
  global.transformToUniqueIds = (id) => id ? `svg-${id}` : id;
  global.createSVGElement = (tag) => ({ tag });
  global.extractViewBox = (props) => props.viewBox || '0 0 100 100';
  global.transformStyle = (style) => style;
}

// Patch require function to provide mock for AsyncStorage
const originalRequire = module.require;
if (originalRequire && typeof global !== 'undefined') {
  module.require = function(id) {
    if (id === '@react-native-async-storage/async-storage' && typeof window === 'undefined') {
      return global.AsyncStorageShim;
    }
    return originalRequire.apply(this, arguments);
  };
}

// Export dummy values to avoid import errors
export const transformToUniqueIds = (id) => id ? `svg-${id}` : id;
export default {
  transformToUniqueIds
}; 