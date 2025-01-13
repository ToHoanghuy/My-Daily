import {View, Text, StyleSheet, Pressable, Dimensions} from 'react-native';
import React, {useState, useEffect} from 'react';
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
const TestSwiperCard = ({
  width,
  isIncome,
  status,
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
}) => {
  const [heightSwiper, setHeightSwiper] = useState(50);
  const animatedWidth = useSharedValue(0);
  const animatedWidthStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedWidth.value}%`,
    };
  });
  useEffect(() => {
    if (percent > 100) {
      animatedWidth.value = withTiming(100, {duration: 1000});
    } else {
      animatedWidth.value = withTiming(percent, {duration: 1000});
    }
  }, [percent]);
  updateRef = ref => {
    this._swipeableRow = ref;
  };
  close = () => {
    this._swipeableRow.close();
  };
  renderItemRight = (icon, color, {type}) => {
    const handleOnPress = () => {
      this.close();
      setPressType(type);
      onPress();
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
        onPress={handleOnPress}>
        <Ionicons name={icon} size={30} color={'#fff'} />
      </Pressable>
    );
  };
  renderRightActions = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderWidth:1,
          marginRight:width/2,
          marginLeft:-width/2
        }}>
        {this.renderItemRight('ios-document-text', '#FF5FDC', {
          type: 'details',
        })}
        {this.renderItemRight('pencil-sharp', '#AB77FF', {type: 'update'})}
        {this.renderItemRight('trash-outline', '#DF2828', {type: 'remove'})}
      </View>
    );
  };
  const {width:WD}=Dimensions.get("screen");
  return (
    <GestureHandlerRootView>
      <View
        style={{
      
          marginVertical,
        }}>
         
        <Swipeable
          enabled={isSwipe}
          ref={this.updateRef}
          renderRightActions={this.renderRightActions}>
            
          <View style={{
            flexDirection:'row',
            alignItems:'center',
          }}>
          <View style={{width:width/2}}/>
          <View
            style={[
              styles.card_container,{width:WD-width},
              {
                borderColor: isIncome ? FONT_COLORS.blue : FONT_COLORS.orange,
                backgroundColor: isIncome
                  ? FONT_COLORS.blue
                  : FONT_COLORS.orange,
              },
            ]}
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
                      (isIncome === true && status === true) ||
                      (isIncome === false && status === false)
                        ? 'emoji-happy'
                        : 'emoji-sad'
                    }
                    size={25}
                    color={
                      (isIncome === true && status === true) ||
                      (isIncome === false && status === false)
                        ? '#25A90F'
                        : '#DF2828'
                    }
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
                      (isIncome === true && status === true) ||
                      (isIncome === false && status === false)
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
                        (isIncome === true && status === true) ||
                        (isIncome === false && status === false)
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
              {(isIncome === true && status === true) ||
              (isIncome === false && status === false) ? (
                <Text style={styles.regular_text}></Text>
              ) : (
                <View style={{width: '95%'}}>
                  <Text style={styles.regular_text}>
                    {language}
                    {': '}
                    {isIncome
                      ? Number(budget) - Number(current)
                      : Number(current) - Number(budget)}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View style={{width:width/2}}/>
          </View>
        </Swipeable>
      
      </View>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  text: {
    color: '#000',
    fontSize: 11,
    fontFamily: FONT_FAMILY.Medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  card_container: {
    //width: '90%',
  
    flexDirection: 'row',
    borderWidth: 1,
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    paddingHorizontal: 1.5,
    paddingTop: 0.5,
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
    backgroundColor: '#fff',
  },
  content: {
    backgroundColor: '#fff',
    width: '95%',
    alignItems: 'center',
    padding: 3,
  },
});
export default TestSwiperCard;
