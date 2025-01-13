import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
  UIManager,
  Modal,
  LayoutAnimation,
} from 'react-native';
import React from 'react';

import ColorCustom from '../Assets/Constants/ColorCustom';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useState} from 'react';
import {useRef} from 'react';
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const DropdownTxtComponent = ({
  width,
  height,
  data,
  choose,
  setChoose,
  fontSize,
  fontFamily,
  color,
  open,
  setOpen,
  placeHolder,
  isIcon = true,
  additional = 0,
}) => {
  const [onLayout, setOnLayout] = useState({pageX: 0, pageY: 0});

  const viewRef = useRef(null);
  return (
    <View
      style={{
        width,
        height,
      }}
      ref={viewRef}
      onLayout={() => {
        viewRef.current.measure((x, y, width, height, pageX, pageY) => {
          setOnLayout({
            pageX,
            pageY,
          });
        });
      }}>
      <Modal visible={open} transparent>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <Pressable
            style={StyleSheet.absoluteFillObject}
            onPress={() => setOpen(!open)}
          />
          <ScrollView
            style={{
              width: width - 2,
              height:
                data.length > 3
                  ? 3 * height - data.length
                  : (data.length + 1) * height - data.length,

              position: 'absolute',
              zIndex: 999,
              left: onLayout.pageX + 1,
              top: onLayout.pageY - additional + height,
            }}
            showsVerticalScrollIndicator={false}
            snapToInterval={height}>
            {data.map((item, index) => {
              return (
                <Pressable
                  onPress={() => {
                    setChoose(item);
                    setOpen(!open);
                  }}
                  key={index}
                  style={[
                    {
                      height,
                    },
                    styles.pressItem,
                    data.length < 3
                      ? index === data.length - 1 && {
                          borderBottomLeftRadius: 10,
                          borderBottomRightRadius: 10,
                        }
                      : index % 3 === 0 && {
                          borderBottomLeftRadius: 10,
                          borderBottomRightRadius: 10,
                        },
                  ]}>
                  <Text
                    style={{fontSize, fontFamily, color}}
                    adjustsFontSizeToFit>
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
      <View
        style={[
          {
            width,
            borderRadius: 10,
            borderWidth: 1,
            backgroundColor: 'white',
            position: 'relative',
          },
          open && {
            height:
              data.length > 3 ? 4 * height + 2 : (data.length + 1) * height + 2,
          },
        ]}>
        <Pressable
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut,
            );
            setOpen(!open);
          }}
          style={[
            {
              width,
              height,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
            },
          ]}>
          {
            <Text
              style={[
                {fontFamily, fontSize, color},
                choose === '' && {color: ColorCustom.gray},
              ]}
              adjustsFontSizeToFit>
              {choose === '' ? placeHolder : choose}
            </Text>
          }
          {isIcon && (
            <Ionicons name="chevron-down" size={24} color={ColorCustom.black} />
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default DropdownTxtComponent;
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: ColorCustom.gray,
    borderRadius: 10,
    flexDirection: 'column',
    backgroundColor: 'white',
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

    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});
