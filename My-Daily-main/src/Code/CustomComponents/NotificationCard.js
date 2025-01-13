import {View, Text, StyleSheet, Pressable} from 'react-native';
import React, {useState, useRef} from 'react';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import {FONT_FAMILY} from '../Assets/Constants/FontCustom';
import FONT_COLORS from '../Assets/Constants/ColorCustom';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dayjs from 'dayjs';
const NotificationCard = ({
  width,
  onPress,
  marginVertical = 10,
  isSwipe = true,
  dateNotice,
  title,
  subtitle,
}) => {
  const [heightSwiper, setHeightSwiper] = useState(50);
  const Ref = useRef(null);

  const renderRightActions = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <Pressable
          style={[
            styles.item_press,
            {
              height: heightSwiper,
              backgroundColor: '#DF2828',
            },
          ]}
          onPress={() => {
            Ref.current?.close();
            onPress();
          }}>
          <Ionicons name={'trash-outline'} size={30} color={'#fff'} />
        </Pressable>
      </View>
    );
  };
  return (
    <GestureHandlerRootView>
      <View style={{width, marginVertical}}>
        <Swipeable
          enabled={isSwipe}
          ref={Ref}
          renderRightActions={renderRightActions}
          childrenContainerStyle={{paddingLeft: 10}}
          containerStyle={{marginRight: 10}}>
          <View
            style={styles.card_container}
            onLayout={e => setHeightSwiper(e.nativeEvent.layout.height)}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '5%',
              }}>
              <View style={styles.circle} />
            </View>
            <View style={styles.content}>
              <Text style={styles.text}>
                {dayjs(dateNotice).format('DD/MM/YYYY')}
              </Text>
              <Text
                style={[
                  styles.text,
                  {
                    fontFamily: FONT_FAMILY.Bold,
                    fontSize: 14,
                    maxWidth: '100%',
                  },
                ]}
                adjustsFontSizeToFit
                numberOfLines={1}>
                {title}
              </Text>
              <Text style={[styles.text, {fontSize: 13, marginBottom: 6}]}>
                {subtitle}
              </Text>
            </View>
          </View>
        </Swipeable>
      </View>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  text: {
    color: '#000',
    fontSize: 12,
    fontFamily: FONT_FAMILY.Medium,
    marginVertical: 3,
  },
  card_container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    paddingHorizontal: 1.5,
    paddingTop: 0.8,
    paddingBottom: 1,
    backgroundColor: FONT_COLORS.green,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 100,
    backgroundColor: '#fff',
  },
  content: {
    backgroundColor: '#fff',
    width: '95%',
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
  item_press: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default NotificationCard;
