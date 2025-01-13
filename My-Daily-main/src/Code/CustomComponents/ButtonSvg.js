import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Svg, {LinearGradient, Rect, Defs, Stop} from 'react-native-svg';
import {FONT_FAMILY} from '../Assets/Constants/FontCustom';
import ColorCustom from '../Assets/Constants/ColorCustom';

const ButtonSvg = ({width, height, title, onPress}) => {
  return (
    <View>
      <View style={{position: 'absolute'}}>
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
              <Stop
                offset="0.1"
                stopColor={ColorCustom.green}
                stopOpacity="1"
              />
              <Stop offset="1" stopColor="#4DC66E" stopOpacity="0.3" />
            </LinearGradient>
          </Defs>
          <Rect
            x="0"
            y="0"
            rx="14"
            ry="14"
            width={width}
            height={height}
            fill="url(#grad)"
          />
        </Svg>
      </View>
      <TouchableOpacity
        style={{
          width: width,
          alignItems: 'center',
          justifyContent: 'center',
          height: height,
          zIndex: 2,
        }}
        onPress={onPress}
        testID="button-svg">
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  text: {
    color: ColorCustom.white,
    fontFamily: FONT_FAMILY.Medium,
    fontSize: 18,
  },
});
export default ButtonSvg;
