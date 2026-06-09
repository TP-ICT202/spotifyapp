/* eslint-env jest, node */
/* Mocks pour les modules natifs utilisés au montage de l'app. */

jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(key => Promise.resolve(key in store ? store[key] : null)),
      setItem: jest.fn((key, value) => {
        store[key] = value;
        return Promise.resolve(null);
      }),
      removeItem: jest.fn(key => {
        delete store[key];
        return Promise.resolve(null);
      }),
      clear: jest.fn(() => {
        store = {};
        return Promise.resolve(null);
      }),
      getAllKeys: jest.fn(() => Promise.resolve(Object.keys(store))),
      multiGet: jest.fn(keys =>
        Promise.resolve(keys.map(key => [key, key in store ? store[key] : null])),
      ),
      multiSet: jest.fn(pairs => {
        pairs.forEach(([key, value]) => {
          store[key] = value;
        });
        return Promise.resolve(null);
      }),
      multiRemove: jest.fn(keys => {
        keys.forEach(key => delete store[key]);
        return Promise.resolve(null);
      }),
    },
  };
});

jest.mock('react-native-video', () => 'Video');

jest.mock('@dr.pogodin/react-native-fs', () => ({
  __esModule: true,
  CachesDirectoryPath: '/tmp/caches',
  DocumentDirectoryPath: '/tmp/documents',
  exists: jest.fn(() => Promise.resolve(false)),
  mkdir: jest.fn(() => Promise.resolve()),
  unlink: jest.fn(() => Promise.resolve()),
  moveFile: jest.fn(() => Promise.resolve()),
  readDir: jest.fn(() => Promise.resolve([])),
  stopDownload: jest.fn(),
  downloadFile: jest.fn(() => ({
    jobId: 1,
    promise: Promise.resolve({ statusCode: 200, bytesWritten: 0 }),
  })),
}));
