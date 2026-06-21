export default ({ config }) => ({
  ...config,
  expo: {
    name: "hello sonu",
    slug: "hello-sonu-mobile",
    version: "9.0.0",
    orientation: "portrait",
    userIunterfaceStyle: "light",
    newArchEnabled: false,

    icon: "./src/assets/icon.jpeg",

    splash: {
      image: "./src/assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.mohit-56.hellosonumobile",
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "We need your location to show routes.",
      },
    },

    android: {
      package: "com.mohit_56.hellosonumobile",
      adaptiveIcon: {
        foregroundImage: "./src/assets/icon.jpeg",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      softwareKeyboardLayoutMode: "pan",

      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
      ],

      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_API,
        },
      },
    },

    plugins: [
      "expo-font",
      "expo-video",
      "expo-audio",

      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow Hello Sonu to use your location.",
        },
      ],

      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you share them with your friends.",
        },
      ],

      [
        "expo-build-properties",
        {
          android: {
            usesCleartextTraffic: true,
            ndkVersion: "26.1.10909125",
            abiFilters: ["arm64-v8a"],
          },
        },
      ],

      "expo-asset",
    ],

    extra: {
      eas: {
        projectId: "00a9d97f-dfdd-43fd-824c-31fc0d3eab23",
      },
      googleApiKey: process.env.EXPO_PUBLIC_GOOGLE_API,
    },
  },
});