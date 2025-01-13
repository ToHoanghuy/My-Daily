/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {decode, encode} from 'base-64';
import {useEffect} from 'react';
import notifee, {EventType} from '@notifee/react-native';
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}
notifee.onBackgroundEvent(async ({type, detail}) => {});
const trackBackground = async () => {
  return notifee.onBackgroundEvent(({type, detail}) => {});
};
AppRegistry.registerHeadlessTask('track', trackBackground);
AppRegistry.registerComponent(appName, () => App);
