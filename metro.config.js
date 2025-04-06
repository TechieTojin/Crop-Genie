// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for importing SVG files
const { assetExts, sourceExts } = config.resolver;
config.resolver.assetExts = [...assetExts, 'db', 'sqlite', 'pem', 'cjs', 'bin'];
config.resolver.sourceExts = [...sourceExts, 'mjs', 'svg', 'cjs', 'jsx', 'tsx'];

// Setup module resolver for path aliases
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@/components': path.resolve(__dirname, 'components'),
  '@/app': path.resolve(__dirname, 'app'),
  '@': path.resolve(__dirname, './')
};

// Performance optimizations
config.maxWorkers = 4;
config.transformer.minifierConfig = {
  compress: {
    drop_console: false,
  },
};

// Handle SVG-related issues
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: false,
  },
});

module.exports = config;
