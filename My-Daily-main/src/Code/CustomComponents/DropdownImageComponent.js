import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ColorCustom from '../Assets/Constants/ColorCustom';
import {LIST_COUNTRIES} from '../Assets/Data/ListCountries';
import {FONT_SIZE, FONT_FAMILY} from '../Assets/Constants/FontCustom';
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const DropdownImageComponent = ({
  width,
  height,
  typeMoney,
  setTypeMoney,
  open,
  setOpen,
  placeHolder,
  fontFamily = FONT_FAMILY.Medium,
  fontSize = FONT_SIZE.TXT_SIZE,
  animated = true,
  paddingLeft = 0,
}) => {
  const onPress = () => {
    if (animated) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setOpen(!open);
  };
  return (
    <View
      style={{
        width,
        height,
      }}>
      <View style={[{width}, styles.container]}>
        <Pressable
          onPress={onPress}
          style={[
            {
              width,
              height,
            },
            styles.pressIcon,
          ]}>
          {
            <Text
              style={[
                styles.txtName,
                {
                  fontSize,
                  fontFamily,
                  paddingLeft: paddingLeft,
                  color: ColorCustom.black,
                },
                typeMoney === '' && {
                  color: ColorCustom.gray,
                },
              ]}
              adjustsFontSizeToFit>
              {typeMoney === '' ? placeHolder : typeMoney.enName}
            </Text>
          }
          <Ionicons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={ColorCustom.gray}
            adjustsFontSizeToFit
          />
        </Pressable>
        {open && (
          <ScrollView
            style={{
              width: width - 2,
              height:
                (LIST_COUNTRIES.length > 3 ? 3 : LIST_COUNTRIES.length) *
                height,
            }}
            snapToInterval={height}
            removeClippedSubviews={true}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled>
            {LIST_COUNTRIES.map((country, index) => {
              return (
                <Pressable
                  onPress={() => {
                    setTypeMoney(country);
                    setOpen(!open);
                  }}
                  key={index}
                  style={[
                    {
                      height,
                    },
                    styles.pressItem,
                  ]}>
                  <Image
                    source={country.flagSource}
                    style={styles.image}
                    resizeMethod="auto"
                  />
                  <View
                    style={{
                      width: '70%',
                    }}>
                    <Text style={styles.txtName} adjustsFontSizeToFit>
                      {country.enName}
                    </Text>
                    <Text style={styles.txtCrypto} adjustsFontSizeToFit>
                      {country.currencyCode}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default DropdownImageComponent;
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: ColorCustom.gray,
    borderRadius: 10,
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    zIndex: 999,
    backgroundColor: ColorCustom.white,
  },
  pressIcon: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  pressItem: {
    borderTopWidth: 0.95,
    borderColor: ColorCustom.gray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  image: {
    width: 55,
    height: 36,
    resizeMode: 'contain',
  },
  txtName: {
    fontSize: FONT_SIZE.TXT_SIZE,
    fontFamily: FONT_FAMILY.Medium,
    color: ColorCustom.black,
  },
  txtCrypto: {
    fontSize: FONT_SIZE.TXT_SMALL_SIZE,
    fontFamily: FONT_FAMILY.Regular,
    color: ColorCustom.black,
  },
});
