// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {
  CACHE_SIZE_UNLIMITED,
  enableIndexedDbPersistence,
  initializeFirestore,
} from 'firebase/firestore';
import {
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getStorage} from 'firebase/storage';
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCfAF0JhUBMHAUYOgLe40YUOnfqlU8P9mo',
  authDomain: 'mydaily-488ec.firebaseapp.com',
  projectId: 'mydaily-488ec',
  storageBucket: 'mydaily-488ec.appspot.com',
  messagingSenderId: '341491948159',
  appId: '1:341491948159:web:fb0b77a8002ac4273b7d4a',
  measurementId: 'G-DRPW0XZ2GN',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
// const auth = getAuth();
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});
if (process.browser) {
  enableIndexedDbPersistence(db, {
    experimentalForceOwningTab: true,
  });
}
const storage = getStorage(app);
export {db, auth, storage};
