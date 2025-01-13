import {View, Text, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import {FONT_FAMILY, FONT_SIZE} from '../Assets/Constants/FontCustom';
import ModalComponent from './ModalComponent';
const Menu = ({open, setOpen, drawerHeight, btnList}) => {
  const handleOnPress = item => {
    item.onPress();
    setOpen(false);
  };
  return (
    <ModalComponent visible={open}>
      <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
        <View style={[{top: drawerHeight - 5}, styles.container]}>
          {btnList?.map((btn, index) => {
            return (
              <Pressable
                key={index}
                underlayColor="hsl(0,0%,90%)"
                style={[
                  {borderBottomWidth: index === btnList.length - 1 ? 0 : 1},
                  styles.touchable,
                ]}
                onPress={() => handleOnPress(btn)}>
                <Text style={styles.text}>{btn.title}</Text>
              </Pressable>
            );
          })}
        </View>
      </Pressable>
    </ModalComponent>
  );
};
const styles = StyleSheet.create({
  text: {
    color: '#7A7A7A',
    fontFamily: FONT_FAMILY.Regular,
    fontSize: FONT_SIZE.TXT_SIZE,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    position: 'absolute',
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 5,
    elevation: 20,
  },
  touchable: {
    paddingLeft: 10,
    paddingRight: 50,
    paddingVertical: 7,
    borderColor: 'hsl(0,0%,70%)',
  },
});
export default React.memo(Menu);
