import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Dimensions,
} from 'react-native';
import React from 'react';
import {FONT_FAMILY} from '../Assets/Constants/FontCustom';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useCallback, useEffect} from 'react';
import ModalComponent from './ModalComponent';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  FlatList,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import ColorCustom from '../Assets/Constants/ColorCustom';
const {height: HEIGHT_SCREEN} = Dimensions.get('screen');
const DropDownSuggestion = ({
  openModal,
  setOpenModal,
  Data,
  setSelectedItem,
  onNavigatePress,
  onBackDrop,
  language = 'English',
}) => {
  const y_AnimatedValue = useSharedValue(HEIGHT_SCREEN * 0.8);
  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <Pressable
          style={({pressed}) => [
            styles.item_row,
            {
              borderBottomWidth: index !== Data.length - 1 ? 1.5 : 0,
              borderColor: 'hsl(0,0%,90%)',
              backgroundColor: pressed ? 'hsl(0,0%,90%)' : ColorCustom.white,
            },
          ]}
          key={index}
          onPress={() => {
            setSelectedItem(item), setOpenModal(false);
            onBackDrop();
          }}>
          <View
            style={[
              styles.icon_container,
              {
                backgroundColor: item.color,
              },
            ]}>
            <FontAwesome
              name={item.icon_name}
              size={25}
              color={ColorCustom.white}
            />
          </View>
          <Text style={[styles.text, {fontSize: 16, marginLeft: 20}]}>
            {language === 'English' ? item.name.EN : item.name.VN}
          </Text>
        </Pressable>
      );
    },
    [language],
  );
  const panHandler = useAnimatedGestureHandler({
    onStart: (e, ctx) => {
      ctx.startY = y_AnimatedValue.value;
    },
    onActive: (e, ctx) => {
      if (ctx.startY + e.translationY < 0) {
        y_AnimatedValue.value = withTiming(0);
      } else if (ctx.startY + e.translationY > HEIGHT_SCREEN * 0.8) {
        y_AnimatedValue.value = withTiming(HEIGHT_SCREEN * 0.8);
      } else {
        y_AnimatedValue.value = ctx.startY + e.translationY;
      }
    },
    onEnd: (e, ctx) => {
      if (e.translationY < 0) {
        y_AnimatedValue.value = withTiming(0);
      } else {
        if (y_AnimatedValue.value < HEIGHT_SCREEN * 0.5) {
          y_AnimatedValue.value = withSpring(HEIGHT_SCREEN * 0.5);
        } else if (
          y_AnimatedValue.value <= HEIGHT_SCREEN &&
          y_AnimatedValue.value >= HEIGHT_SCREEN * 0.5
        ) {
          y_AnimatedValue.value = withSpring(HEIGHT_SCREEN * 0.8);
        }
      }
    },
  });
  const modal_position = useAnimatedStyle(() => {
    return {
      transform: [{translateY: y_AnimatedValue.value}],
    };
  });
  useEffect(() => {
    if (openModal === true) {
      y_AnimatedValue.value = HEIGHT_SCREEN * 0.8;
      y_AnimatedValue.value = withTiming(HEIGHT_SCREEN * 0.5);
    } else {
      y_AnimatedValue.value = HEIGHT_SCREEN;
    }
  }, [openModal]);
  return (
    <ModalComponent visible={openModal} animationType="fade">
      <GestureHandlerRootView style={{flex: 1, backgroundColor: 'transparent'}}>
        <View
          style={{
            justifyContent: 'flex-end',
            flex: 1,
          }}>
          <Pressable
            style={styles.back_view}
            onPress={() => {
              setOpenModal(!openModal), onBackDrop();
            }}
          />
          <PanGestureHandler onGestureEvent={panHandler}>
            <Animated.View style={[styles.modal_container, modal_position]}>
              <View style={styles.header}>
                <Pressable onPress={() => setOpenModal(!openModal)}>
                  <Feather name="x" size={34} color="#DF2828" />
                </Pressable>
                <Text style={styles.text}>
                  {language === 'English' ? 'Category' : 'Danh mục'}
                </Text>
                <Pressable onPress={onNavigatePress}>
                  <Ionicons name="add" size={34} color="#AB77FF" />
                </Pressable>
              </View>
              <FlatList
                data={Data}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                renderToHardwareTextureAndroid
              />
            </Animated.View>
          </PanGestureHandler>
        </View>
      </GestureHandlerRootView>
    </ModalComponent>
  );
};
const styles = StyleSheet.create({
  back_view: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#00000099',
  },
  text: {
    color: ColorCustom.black,
    fontSize: 20,
    fontFamily: FONT_FAMILY.Medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: StatusBar.currentHeight,
  },
  modal_container: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: ColorCustom.white,
    height: '100%',
    zIndex: 99,
  },
  item_row: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: 'hsl(0,0%,90%)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon_container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
    borderRadius: 100,
  },
});
export default React.memo(DropDownSuggestion);
