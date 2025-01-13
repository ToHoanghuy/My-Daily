import {View, Text, StyleSheet, Pressable} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import {FONT_FAMILY} from '../Assets/Constants/FontCustom';
import FONT_COLORS from '../Assets/Constants/ColorCustom';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import dayjs from 'dayjs';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import ColorCustom from '../Assets/Constants/ColorCustom';
const SwiperCard = ({
  width,
  isIncome,
  dateStart,
  dateEnd,
  percent,
  title,
  setPressType,
  onPress,
  current,
  budget,
  currency,
  language,
  isSwipe = true,
  marginVertical = 10,
  navigation,
}) => {
  const [heightSwiper, setHeightSwiper] = useState(50);
  const animatedWidth = useSharedValue(0);
  const Ref = useRef(null);
  const animatedWidthStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedWidth.value}%`,
    };
  });
  useEffect(() => {
    if (percent > 100) {
      animatedWidth.value = withTiming(100);
    } else {
      if (percent === 0) {
        animatedWidth.value = 0;
      } else {
        animatedWidth.value = withTiming(percent);
      }
    }
  }, [percent]);
  useEffect(() => {
    if (isSwipe) {
      const unsubscribe = navigation.addListener('blur', () => {
        Ref?.current?.close();
      });
      unsubscribe;
    }
  }, [navigation]);
  const renderItemRight = (icon, color, {type}) => {
    const handleOnPress = () => {
      setPressType(type);
      onPress();
      Ref?.current.close();
    };
    return (
      <Pressable
        style={[
          styles.item_press,
          {
            height: heightSwiper,
            backgroundColor: color,
          },
        ]}
        onPress={handleOnPress}
        testID="right-action-item-press">
        <Ionicons name={icon} size={30} color={ColorCustom.white} />
      </Pressable>
    );
  };
  const renderRightActions = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: ColorCustom.white,
        }}>
        {renderItemRight('ios-document-text', '#FF5FDC', {
          type: 'Details',
        })}
        {renderItemRight('pencil-sharp', '#AB77FF', {type: 'Edit'})}
        {renderItemRight('trash-outline', '#DF2828', {type: 'Remove'})}
      </View>
    );
  };
  return (
    <GestureHandlerRootView>
      <View
        style={{
          width,
          marginVertical,
        }}>
        <Swipeable
          testID="swipeable"
          enabled={isSwipe}
          ref={Ref}
          renderRightActions={renderRightActions}
          childrenContainerStyle={{paddingLeft: 10}}
          containerStyle={{marginRight: 10}}>
          <View
            style={[
              styles.card_container,
              {
                borderColor: isIncome ? FONT_COLORS.blue : FONT_COLORS.orange,
                backgroundColor: isIncome
                  ? FONT_COLORS.blue
                  : FONT_COLORS.orange,
              },
            ]}
            testID="border-color"
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
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={[
                    styles.text,
                    {
                      fontSize: 13,
                      width: '90%',
                      textAlign: 'center',
                    },
                  ]}
                  numberOfLines={1}>
                  {title}
                </Text>
                <View
                  style={{
                    width: '10%',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}>
                  <Entypo
                    name={
                      (isIncome === true && percent >= 100) ||
                      (isIncome === false && percent <= 100)
                        ? 'emoji-happy'
                        : 'emoji-sad'
                    }
                    size={25}
                    color={
                      (isIncome === true && percent >= 100) ||
                      (isIncome === false && percent <= 100)
                        ? '#25A90F'
                        : '#DF2828'
                    }
                    testID="emoji-icon"
                  />
                </View>
              </View>
              <View style={[styles.row, {width: '95%'}]}>
                <Text style={[styles.text, {color: '#7A7A7A'}]}>
                  {dayjs(dateStart).format('DD/MM/YYYY')}
                </Text>
                <Text
                  style={{
                    color:
                      (isIncome === true && percent >= 100) ||
                      (isIncome === false && percent <= 100)
                        ? '#25A90F'
                        : '#DF2828',
                    fontSize: 13,
                    fontFamily: FONT_FAMILY.Bold,
                  }}>
                  {`${percent}%`}
                </Text>
                <Text style={[styles.text, {color: '#7A7A7A'}]}>
                  {dayjs(dateEnd).format('DD/MM/YYYY')}
                </Text>
              </View>
              {/* process bar */}
              <View
                testID={'current-color'}
                style={[
                  styles.process_container,
                  {
                    borderColor: isIncome
                      ? FONT_COLORS.blue
                      : FONT_COLORS.orange,
                  },
                ]}>
                <Animated.View
                  style={[
                    {
                      backgroundColor:
                        (isIncome === true && percent >= 100) ||
                        (isIncome === false && percent <= 100)
                          ? '#25A90F'
                          : '#DF2828',
                    },
                    animatedWidthStyle,
                    styles.process_bar,
                  ]}
                />
              </View>
              <View style={[styles.row, {width: '95%'}]}>
                <Text style={styles.text}>
                  {current} {currency}
                </Text>
                <Text style={styles.text}>
                  {budget} {currency}
                </Text>
              </View>
              {(isIncome === true && percent >= 100) ||
              (isIncome === false && percent <= 100) ? (
                <Text style={styles.regular_text}></Text>
              ) : (
                <View style={{width: '95%'}}>
                  <Text style={styles.regular_text} testID="alarm-txt">
                    {language}
                    {': '}
                    {isIncome
                      ? Number(budget) - Number(current)
                      : Number(current) - Number(budget)}{' '}
                    {currency}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Swipeable>
      </View>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  text: {
    color: ColorCustom.black,
    fontSize: 11,
    fontFamily: FONT_FAMILY.Medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  card_container: {
    width: '100%',
    flexDirection: 'row',
    borderWidth: 1,
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    paddingHorizontal: 1.5,
    paddingTop: 1,
    paddingBottom: 1,
  },
  item_press: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  process_container: {
    width: '95%',
    height: 12,
    borderRadius: 100,
    borderWidth: 1,
  },
  process_bar: {
    position: 'absolute',
    top: 0,
    height: 10,
    borderRadius: 100,
  },
  regular_text: {
    fontFamily: FONT_FAMILY.Regular,
    color: '#DF2828',
    textAlign: 'center',
    fontSize: 12,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 100,
    backgroundColor: ColorCustom.white,
  },
  content: {
    backgroundColor: ColorCustom.white,
    width: '95%',
    alignItems: 'center',
    padding: 3,
  },
});
export default React.memo(SwiperCard);
