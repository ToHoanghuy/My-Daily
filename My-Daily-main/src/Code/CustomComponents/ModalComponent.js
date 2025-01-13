import {StyleSheet} from 'react-native';
import React from 'react';
import Animated, {FadeIn, SlideInDown} from 'react-native-reanimated';
const ModalComponent = ({
  visible,
  children,
  zIndex = 1000,
  backgroundColor = 'transparent',
  animationType = 'null',
}) => {
  return (
    <>
      {visible && (
        <Animated.View
          entering={
            animationType === 'fade'
              ? FadeIn
              : animationType === 'slide'
              ? SlideInDown
              : null
          }
          style={[StyleSheet.absoluteFill, {backgroundColor, flex: 1, zIndex}]}>
          {children}
        </Animated.View>
      )}
    </>
  );
};

export default ModalComponent;
