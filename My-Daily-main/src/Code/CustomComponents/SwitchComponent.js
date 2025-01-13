import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import ColorCustom from '../Assets/Constants/ColorCustom';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const SwitchComponent = ({turnOn, isEnglish}) => {
  const language = isEnglish ? {on: 'On', off: 'Off'} : {on: 'Bật', off: 'Tắt'};
  const translateXValue = useSharedValue(0);
  const viewAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: interpolate(translateXValue.value, [0, 1], [0, 40])},
      ],
    };
  });
  useEffect(() => {
    translateXValue.value = withTiming(turnOn ? 1 : 0);
  }, [turnOn]);
  return (
    <View
      style={{
        width: 70,
        height: 30,
        borderRadius: 100,
        justifyContent: 'center',
        paddingHorizontal: 2,
        backgroundColor: turnOn ? ColorCustom.green : ColorCustom.gray,
      }}>
      <Text
        style={[
          {
            position: 'absolute',
            zIndex: -1,
            color: turnOn ? 'white' : '#656565',
          },
          turnOn ? {left: 10} : {right: 10},
        ]}>
        {turnOn ? language.on : language.off}
      </Text>
      <Animated.View
        style={[
          {
            width: 25,
            height: 25,
            borderRadius: 30,
            backgroundColor: 'white',
          },
          viewAnimatedStyle,
        ]}
      />
    </View>
  );
};

export default SwitchComponent;
