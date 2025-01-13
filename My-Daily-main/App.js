import {View, StatusBar, ActivityIndicator, LogBox, Text} from 'react-native';
import React, {useState} from 'react';
import {Provider} from 'react-redux';
import {persistor, store} from './src/ReduxToolKit/Store';
import RootStack from './src/Code/RootNavigation/RootStack';
import {PersistGate} from 'redux-persist/integration/react';
import ColorCustom from './src/Code/Assets/Constants/ColorCustom';
import AsyncStorage from '@react-native-async-storage/async-storage';
const App = () => {
  LogBox.ignoreAllLogs();
  return (
    <Provider store={store}>
      <PersistGate
        loading={<ActivityIndicator color={ColorCustom.green} size={'large'} />}
        persistor={persistor}>
        <View style={{flex: 1}}>
          <StatusBar
            barStyle={'dark-content'}
            backgroundColor={'transparent'}
            translucent
          />
          <RootStack />
        </View>
      </PersistGate>
    </Provider>
    // <Test_Memo />
  );
};
export default App;
