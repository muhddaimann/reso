import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: process.env.EXPO_PUBLIC_APP_NAME ?? "",
  slug: "reso",
  version: process.env.EXPO_PUBLIC_APP_VERSION ?? "",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "reso",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  experiments: { typedRoutes: true },

  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.muhddaimann.reso",
    buildNumber: "1",
  },

  android: {
    package: "com.muhddaimann.reso",
    versionCode: 1,
    edgeToEdgeEnabled: true,
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptiveIcon.png",
      backgroundColor: "#ffffff",
    },
  },

  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/adaptiveIcon.png",
  },

  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
  ],

  runtimeVersion: { policy: "appVersion" },
  updates: {
    enabled: true,
    checkAutomatically: "ON_LOAD",
    fallbackToCacheTimeout: 0,
  },
};

export default config;
