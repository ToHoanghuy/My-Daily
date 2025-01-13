import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import InitialScreen from '../Screens/AuthScreens/InitialScreen';
import SignIn from '../Screens/AuthScreens/SignIn';
import SignUp from '../Screens/AuthScreens/SignUp';
import ForgotPassword from '../Screens/AuthScreens/ForgotPassword';
import InitialSetting from '../Screens/AuthScreens/InitialSetting';
import DrawerNavigation from './DrawerNavigation';
import OnBoarding from '../Screens/AuthScreens/OnBoarding';
import InsertOutcome from '../Screens/Finance/Input/InsertOutcome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from 'react';
import {useEffect} from 'react';
import {Linking} from 'react-native';
const MainStack = createNativeStackNavigator();
const RootStack = () => {
  const [isReady, setIsReady] = useState(false);
  const [stateNavigation, setStateNavigation] = useState(undefined);
  useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (Platform.OS !== 'web' && initialUrl == null) {
          // Only restore state if there's no deep link and we're not on web
          const savedStateString = await AsyncStorage.getItem(
            'PERSISTENCE_KEY',
          );
          const state = savedStateString
            ? JSON.parse(savedStateString)
            : undefined;

          if (state !== undefined) {
            setStateNavigation(state);
          }
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer
      initialState={stateNavigation}
      onStateChange={state =>
        AsyncStorage.setItem('PERSISTENCE_KEY', JSON.stringify(state))
      }>
      <MainStack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="InitialScreen">
        <MainStack.Group navigationKey={isReady ? 'ReHydrated' : 'SignIn'}>
          <MainStack.Screen name="InitialScreen" component={InitialScreen} />
          <MainStack.Screen name="SignIn" component={SignIn} />
          <MainStack.Screen name="SignUp" component={SignUp} />
          <MainStack.Screen name="ForgotPassword" component={ForgotPassword} />
          <MainStack.Screen name="InitialSetting" component={InitialSetting} />
          <MainStack.Screen name="OnBoarding" component={OnBoarding} />
        </MainStack.Group>

        <MainStack.Group>
          <MainStack.Screen
            name="OverViewScreen"
            component={DrawerNavigation}
          />
          <MainStack.Screen name="InsertOutcome" component={InsertOutcome} />
        </MainStack.Group>
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
