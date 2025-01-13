import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';
import '@react-native-async-storage/async-storage/jest/async-storage-mock';
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);
jest.mock('react-native-image-crop-picker', () => {
  const {NativeModules} = require('react-native');
  return {
    openPicker: jest.fn(),
    openCamera: jest.fn(),
    ...NativeModules.ImageCropPicker,
  };
});
jest.mock('@notifee/react-native', () => ({
  createChannel: jest.fn(),
  displayNotification: jest.fn(),
}));
const mock = jest.requireMock('react-native-reanimated/mock');
jest.mock('react-native-reanimated', () => {
  return {
    ...mock,
    useSharedValue: jest.fn,
    useAnimatedStyle: jest.fn,
  };
});
