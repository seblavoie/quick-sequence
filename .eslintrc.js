module.exports = {
  extends: ["@remotion/eslint-config-flat"],
  rules: {
    // Disable Remotion-specific warnings for web app components
    "@remotion/warn-native-media-tag": "off",
  },
  overrides: [
    {
      // Only apply Remotion rules to composition files
      files: ["**/Composition.tsx", "**/Root.tsx"],
      rules: {
        "@remotion/warn-native-media-tag": "error",
      },
    },
  ],
};
