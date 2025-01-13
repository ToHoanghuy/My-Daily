import {
  View,
  Text,
  Image,
  StatusBar,
  StyleSheet,
  TouchableHighlight,
  FlatList,
  Linking,
} from 'react-native';
import React from 'react';
import {FONT_FAMILY} from '../Assets/Constants/FontCustom';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {useMemo} from 'react';
import {EN_LANGUAGE, VN_LANGUAGE} from '../Assets/Data/Language';
import {auth} from '../../Firebase/Firebase';
import {signOut} from 'firebase/auth';
import ColorCustom from '../Assets/Constants/ColorCustom';
import {resetStore} from '../../ReduxToolKit/Actions/resetAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {DrawerActions} from '@react-navigation/native';
const CustomDrawer = props => {
  const currSetting = useSelector(state => state.UserSetting);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const language = useMemo(
    () =>
      currSetting.language === 'English'
        ? EN_LANGUAGE.drawer
        : VN_LANGUAGE.drawer,
    [currSetting.language],
  );
  const DataDrawer = useMemo(
    () => [
      {
        title: language.btnOverview,
        icon_name: 'home-outline',
        name: 'Overview',
      },
      {
        title: language.btnTransactions,
        icon_name: 'newspaper-outline',
        subheader: language.titleFinance,
        name: 'Transactions',
      },
      {
        title: language.btnStatistic,
        icon_name: 'bar-chart-outline',
        name: 'Statistic',
      },
      {
        title: language.btnPlanning,
        icon_name: 'reader-outline',
        name: 'Planning',
      },
      {title: language.btnSetting, icon_name: 'cog', name: 'Setting'},
      {
        title: language.btnIntroduction,
        icon_name: 'book-outline',
        name: 'Introduction',
      },
      {
        title: language.btnSupport,
        icon_name: 'mail-outline',
        name: 'Support',
      },
      {title: language.btnSignOut, icon_name: 'exit-outline', name: 'SignOut'},
    ],
    [language],
  );

  const handleOnPress = async (item, index) => {
    if (index === DataDrawer.length - 1) {
      if (auth.currentUser) {
        signOut(auth)
          .then(() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'InitialScreen'}],
              }),
            );
            dispatch(resetStore());
            AsyncStorage.multiRemove(['persist:root', 'PERSISTENCE_KEY']);
          })

          .catch(error => {
            console.log(error);
          });
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'InitialScreen'}],
          }),
        );
        dispatch(resetStore());
        AsyncStorage.multiRemove(['persist:root', 'PERSISTENCE_KEY']);
      }
    } else if (index === DataDrawer.length - 2) {
      navigation.dispatch(DrawerActions.closeDrawer());
      Linking.openURL('mailto:mydaily203@gmail.com?subject=Feedback My Daily');
    } else {
      props.navigation.navigate(item.name);
    }
  };
  const renderDrawerBtn = ({item, index}) => {
    return (
      <View key={index}>
        {index === 1 && (
          <Text
            style={[
              styles.text,
              {
                color: 'hsl(0,0%,70%)',
                alignSelf: 'center',
                marginTop: 5,
              },
            ]}>
            {item.subheader}
          </Text>
        )}
        <TouchableHighlight
          onPress={() => handleOnPress(item, index)}
          underlayColor="hsl(0,0%,90%)"
          style={{
            paddingVertical: 10,
            paddingHorizontal: 30,
            marginVertical: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
            }}>
            <Ionicons name={item.icon_name} size={30} color={'#000'} />
            <Text style={[styles.text, {color: '#000', marginLeft: 20}]}>
              {item.title}
            </Text>
          </View>
        </TouchableHighlight>
        {(index === 0 || index === 3) && (
          <View
            style={{
              width: '90%',
              height: 2,
              backgroundColor: 'hsl(0,0%,85%)',
              alignSelf: 'center',
            }}
          />
        )}
      </View>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.view}>
        <Image
          source={
            currSetting.userImage
              ? {uri: currSetting.userImage}
              : require('../Assets/Images/user.png')
          }
          style={{
            width: 60,
            height: 60,
            borderRadius: 100,
            resizeMode: 'contain',
            marginRight: 10,
          }}
        />
        <View
          style={{
            marginLeft: 0,
          }}>
          <Text style={styles.text}>{currSetting.userName}</Text>
          <Text
            style={[styles.text, {fontSize: 13, width: '90%'}]}
            numberOfLines={1}
            adjustsFontSizeToFit>
            {currSetting.email}
          </Text>
        </View>
      </View>
      <View style={{marginTop: 10}}>
        <FlatList
          data={DataDrawer}
          renderItem={renderDrawerBtn}
          keyExtractor={item => item.title}
          removeClippedSubviews
          renderToHardwareTextureAndroid
          initialNumToRender={6}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  view: {
    width: '100%',
    // height: StatusBar.currentHeight + 15,
    paddingTop: StatusBar.currentHeight + 15,
    paddingBottom: 10,
    backgroundColor: ColorCustom.green,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontFamily: FONT_FAMILY.Medium,
  },
});
export default CustomDrawer;
