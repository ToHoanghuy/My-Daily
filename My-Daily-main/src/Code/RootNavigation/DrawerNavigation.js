import {Text} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Overview from '../Screens/Finance/Overview';
// const Overview = lazy(() => import('../Screens/Finance/Overview'));
// import Overview_Suspense from '../Screens/Finance/Overview';
import Setting from '../Screens/Setting/Setting';
import CustomDrawer from './CustomDrawer';
import Notification from '../Screens/Finance/Notification/Notification';
import Transactions from '../Screens/Finance/Transaction/Transactions';
import InsertOutcome from '../Screens/Finance/Input/InsertOutcome';
import Introduction from '../Screens/Introduction/Introduction';
const Drawer = createDrawerNavigator();
import Statistic from '../Screens/Finance/Statistics/Statistic';
import Planning from '../Screens/Finance/Plannings/Planning';
import {lazy} from 'react';
import {Suspense} from 'react';

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      initialRouteName="InsertOutcome"
      screenOptions={{headerShown: false}}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen name="Overview" component={Overview} />
      <Drawer.Screen name="Transactions" component={Transactions} />
      <Drawer.Screen name="Statistic" component={Statistic} />
      <Drawer.Screen name="Planning" component={Planning} />
      <Drawer.Screen name="Setting" component={Setting} />
      <Drawer.Screen name="Notification" component={Notification} />
      <Drawer.Screen name="InsertOutcome" component={InsertOutcome} />
      <Drawer.Screen name="Introduction" component={Introduction} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
