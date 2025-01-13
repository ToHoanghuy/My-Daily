import {View, Text, StatusBar, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {FONT_FAMILY} from '../Assets/Constants/FontCustom';
import ColorCustom from '../Assets/Constants/ColorCustom';
const HeaderDrawer = ({
  onPressLeft,
  onPressRight,
  title,
  numberOfNotice = 0,
  isNotice = false,
  buttonList,
  isSetting = false,
  setDrawerHeight,
}) => {
  const onGetDrawerHeight = e => {
    if (isSetting === false) return;
    else {
      setDrawerHeight(e.nativeEvent.layout.height);
    }
  };
  return (
    <View style={{backgroundColor: ColorCustom.white}}>
      <View style={styles.view} onLayout={onGetDrawerHeight}>
        <View
          style={{
            width: '15%',
          }}>
          <Pressable
            onPress={onPressLeft}
            hitSlop={20}
            testID="header-left-press">
            <Entypo name="menu" size={30} color={ColorCustom.white} />
          </Pressable>
        </View>

        <Text
          style={[
            styles.text,
            {width: buttonList === 1 ? '70%' : '67%', textAlign: 'center'},
          ]}>
          {title}
        </Text>
        <View
          style={{
            width: buttonList === 1 ? '15%' : '18%',
            justifyContent: 'flex-end',
            flexDirection: 'row',
          }}>
          {isNotice ? (
            <Pressable onPress={onPressRight} hitSlop={10}>
              <Fontisto name="bell-alt" size={25} color={ColorCustom.white} />
              {isNotice ? (
                <View style={styles.notification_box}>
                  <Text
                    style={[styles.text, {fontSize: 8, textAlign: 'center'}]}>
                    {numberOfNotice}
                  </Text>
                </View>
              ) : null}
            </Pressable>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent:
                  buttonList?.length === 1 ? 'flex-end' : 'space-between',
                width: '100%',
              }}>
              {buttonList?.map((item, index) => {
                return (
                  <Pressable
                    key={index}
                    onPress={item.onPress}
                    hitSlop={10}
                    testID={`header-right-${title}-${index}`}>
                    <item.icon_type
                      name={item.icon_name}
                      size={25}
                      color={ColorCustom.white}
                    />
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  view: {
    width: '100%',
    paddingTop: StatusBar.currentHeight + 15,
    paddingBottom: 10,
    backgroundColor: ColorCustom.green,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontFamily: FONT_FAMILY.Bold,
  },
  notification_box: {
    position: 'absolute',
    right: -5,
    top: -3,
    backgroundColor: '#FF0000',
    height: 15,
    width: 15,
    borderRadius: 100,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default HeaderDrawer;
