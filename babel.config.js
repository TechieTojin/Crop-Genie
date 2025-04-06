module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Required for expo-router (no longer needs separate babel plugin in SDK 50)
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@/components': './components',
            '@/app': './app',
            '@': './'
          }
        }
      ]
    ]
  };
}; 