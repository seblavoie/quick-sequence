import { config } from "@remotion/eslint-config-flat";

export default [
  ...config,
  {
    rules: {
      // Disable Remotion-specific warnings for most files since this is a web app
      "@remotion/warn-native-media-tag": "off",
    },
  },
  {
    // Only apply strict Remotion rules to composition files
    files: ["**/Composition.tsx", "**/Root.tsx"],
    rules: {
      "@remotion/warn-native-media-tag": "error",
    },
  },
];
