import {
  View,
  Text,
  Pressable,
  LayoutAnimation,
  UIManager,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {FONT_FAMILY} from '../Assets/Constants/FontCustom';
import ColorCustom from '../Assets/Constants/ColorCustom';
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const CurrencyDropDown = ({
  currency,
  setCurrency,
  width,
  height,
  fontFamily = FONT_FAMILY.Regular,
  fontSize = 15,
  data,
  open,
  setOpen,
  placeHolder = '',
  align = 'center',
  borderRadius = 5,
  paddingHorizontal = 5,
  paddingLeft = 0,
  animated = true,
}) => {
  const onPress = () => {
    if (animated) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setOpen(!open);
  };
  return (
    <View style={[{width, borderRadius}, styles.view]}>
      <Pressable
        style={{
          height,
          paddingHorizontal: paddingHorizontal,
          alignItems: align,
          justifyContent: 'center',
        }}
        onPress={onPress}>
        <Text
          style={[
            {
              fontFamily,
              fontSize,
              color: ColorCustom.black,
              paddingLeft: paddingLeft,
            },
            currency === '' && {
              color: ColorCustom.gray,
            },
          ]}
          adjustsFontSizeToFit>
          {currency === '' ? placeHolder : currency}
        </Text>
      </Pressable>
      {open && (
        <ScrollView
          style={{height: (data.length > 3 ? 3 : data.length) * height}}
          removeClippedSubviews={true}
          snapToInterval={height}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}>
          {data?.map((item, index) => {
            return (
              <Pressable
                style={[
                  {
                    height,
                    width,
                  },
                  styles.pressable,
                ]}
                onPress={() => {
                  setCurrency(item);
                  setOpen(!open);
                }}
                key={index}>
                <Text
                  style={{fontFamily, fontSize, color: ColorCustom.black}}
                  adjustsFontSizeToFit>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  view: {
    zIndex: 999,
    borderColor: ColorCustom.gray,
    borderWidth: 1,
    backgroundColor: ColorCustom.white,
  },
  pressable: {
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: ColorCustom.gray,
  },
});
export default CurrencyDropDown;
