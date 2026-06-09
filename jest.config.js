module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(mp3|wav|ogg|m4a|png|jpg|jpeg|gif)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      [
        '@react-native',
        'react-native',
        '@react-native-async-storage',
        '@supabase',
        'react-native-video',
        'react-native-url-polyfill',
        'react-native-safe-area-context',
        'isows',
        'ws',
      ].join('|') +
      ')/)',
  ],
};
