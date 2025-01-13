import {View, Text, Modal, Pressable, StyleSheet, Image} from 'react-native';
import React from 'react';
import {FONT_FAMILY} from '../Assets/Constants/FontCustom';
import AntDesign from 'react-native-vector-icons/AntDesign';

const AlertComponent = ({
  open,
  setOpen,
  title,
  subtitle,
  buttonList,
  type,
  disableBackDrop = false,
}) => {
  // 3 types of alert: "SUCCESS", "FAILED", "ALERT"
  return (
    <Modal
      visible={open}
      onRequestClose={() => setOpen(false)}
      transparent
      statusBarTranslucent
      animationType="fade">
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}>
        <Pressable
          style={styles.pressable_style}
          onPress={() => setOpen(false)}
          disabled={disableBackDrop}
        />
        <View style={styles.container}>
          {type === 'FAILED' ? (
            <Image
              style={{
                height: 100,
                width: 100,
              }}
              resizeMode="stretch"
              source={require('../Assets/Images/error.png')}
            />
          ) : (
            <View
              style={[
                styles.icon,
                {
                  backgroundColor:
                    type === 'SUCCESS' ? '#75f94c' : 'hsl(47,100%,51%)',
                },
              ]}>
              <AntDesign
                name={type === 'SUCCESS' ? 'check' : 'exclamation'}
                color="#fff"
                size={60}
              />
            </View>
          )}
          {title && (
            <Text style={[styles.text, {marginTop: 10}]} adjustsFontSizeToFit>
              {title}
            </Text>
          )}

          <Text
            style={[
              styles.text,
              {fontSize: 14, textAlign: 'center', marginHorizontal: 20},
            ]}>
            {subtitle}
          </Text>
          <View
            style={[
              styles.btn_container,
              {
                justifyContent:
                  buttonList.length === 1 ? 'center' : 'space-between',
              },
            ]}>
            {buttonList?.map((item, index) => {
              return (
                <Pressable
                  key={index}
                  style={{
                    width: buttonList.length === 1 ? '80%' : '40%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:
                      buttonList?.length === 2
                        ? index === 0
                          ? 'hsl(5,83%,53%)'
                          : 'hsl(47,100%,51%)'
                        : type === 'SUCCESS'
                        ? '#3cda5e'
                        : 'hsl(5,83%,53%)',
                    borderRadius: 10,
                  }}
                  onPress={item.onPress}>
                  <Text
                    style={[styles.text, {color: '#fff', fontSize: 16}]}
                    adjustsFontSizeToFit>
                    {item.txt}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  pressable_style: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000099',
  },
  container: {
    width: '80%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: 'hsl(0,0%,70%)',
    alignItems: 'center',
    paddingVertical: 50,
  },
  text: {
    fontFamily: FONT_FAMILY.Medium,
    color: '#000',
    fontSize: 18,
  },
  icon: {
    height: 100,
    width: 100,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn_container: {
    position: 'absolute',
    bottom: -20,
    width: '70%',
    height: 45,
    alignItems: 'center',
    flexDirection: 'row',
  },
});
export default AlertComponent;
