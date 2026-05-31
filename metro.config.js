const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    // Add .mp3 to the asset extensions so Metro can bundle local audio files
    assetExts: [...defaultConfig.resolver.assetExts, 'mp3'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
