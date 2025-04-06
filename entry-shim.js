// Load core shims first
if (typeof window === 'undefined') {
  // Create minimal browser environment for SSR
  global.window = {
    localStorage: {
      getItem: () => null,
      setItem: () => null,
      removeItem: () => null,
      clear: () => null,
      length: 0,
      key: () => null
    },
    document: {
      createElement: (tag) => ({ tagName: tag }),
      head: { appendChild: () => null },
      body: { appendChild: () => null },
      addEventListener: () => null,
      removeEventListener: () => null
    },
    navigator: { userAgent: 'node' },
    location: { href: 'https://example.com' },
    fetch: () => Promise.resolve({ json: () => Promise.resolve({}) }),
    addEventListener: () => null,
    removeEventListener: () => null
  };
  
  // Provide basic Web API that might be accessed by libraries
  global.fetch = () => Promise.resolve({ json: () => Promise.resolve({}) });
  global.XMLHttpRequest = function() { 
    return {
      open: () => null,
      send: () => null,
      setRequestHeader: () => null,
      onload: () => null,
      onerror: () => null
    };
  };
  
  // Create memory storage for AsyncStorage
  const memoryStorage = new Map();
  global.AsyncStorageShim = {
    getItem: (key) => Promise.resolve(memoryStorage.get(key) || null),
    setItem: (key, value) => {
      memoryStorage.set(key, value);
      return Promise.resolve();
    },
    removeItem: (key) => {
      memoryStorage.delete(key);
      return Promise.resolve();
    },
    multiGet: (keys) => Promise.resolve(keys.map(key => [key, memoryStorage.get(key) || null])),
    multiSet: (keyValuePairs) => {
      keyValuePairs.forEach(([key, value]) => memoryStorage.set(key, value));
      return Promise.resolve();
    },
    multiRemove: (keys) => {
      keys.forEach(key => memoryStorage.delete(key));
      return Promise.resolve();
    },
    getAllKeys: () => Promise.resolve(Array.from(memoryStorage.keys())),
    clear: () => {
      memoryStorage.clear();
      return Promise.resolve();
    }
  };
  
  // SVG-related functions
  global.resolveAssetUri = (href) => href;
  global.transformToUniqueIds = (id) => id ? `svg-${id}` : id;
  global.createSVGElement = (tag) => ({ tag });
  global.extractViewBox = (props) => props.viewBox || '0 0 100 100';
  global.transformStyle = (style) => style;
  
  // Module mocking system
  const originalRequire = module.constructor.prototype.require;
  if (originalRequire) {
    module.constructor.prototype.require = function(id) {
      // Mock AsyncStorage
      if (id === '@react-native-async-storage/async-storage') {
        return global.AsyncStorageShim;
      }
      
      // Let normal require proceed
      return originalRequire.call(this, id);
    };
  }
}

// Load shims file
require('./shim');

// Then load the actual Expo Router entry point
module.exports = require('./node_modules/expo-router/entry'); 