import 'dotenv/config';

export default {
  name: "CropGenies",
  slug: "cropgenies",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.kisanai"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.kisanai",
    versionCode: 1,
    permissions: [
      "ACCESS_COARSE_LOCATION",
      "ACCESS_FINE_LOCATION",
      "CAMERA",
      "INTERNET",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE"
    ]
  },
  web: {
    bundler: "metro",
    favicon: "./assets/favicon.png",
    output: "static"
  },
  plugins: ["expo-router", "expo-secure-store"],
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true
  },
  scheme: "kisanai",
  extra: {
    // Put all environment variables here
    eas: {
      projectId: "0faeb882-3597-4569-892d-1851f81477b0"
    },
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    openWeatherApiKey: process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY,
    weatherApiKey: process.env.EXPO_PUBLIC_WEATHERAPI_KEY,
    plantIdApiKey: process.env.EXPO_PUBLIC_PLANTID_API_KEY
  }
}; 