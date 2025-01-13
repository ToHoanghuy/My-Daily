import {
  View,
  Text,
  Modal,
  FlatList,
  Dimensions,
  Pressable,
  StyleSheet,
} from 'react-native';
import React, {memo, useCallback, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {COLORS} from '../Assets/Data/Colors';
import ColorCustom from '../Assets/Constants/ColorCustom';
import {FONT_FAMILY, FONT_SIZE} from '../Assets/Constants/FontCustom';
const {width} = Dimensions.get('window');
const NUMBER_COLUMNS = Math.floor(width / 44);

const MoreColor = ({openModal, setOpenModal, setColorPicker}) => {
  const [color, setColor] = useState('');
  const renderColor = useCallback(
    ({item, index}) => {
      return (
        <Pressable
          onPress={() => setColor(item)}
          key={index}
          style={[styles.colorPress, {borderWidth: color === item ? 2 : 0}]}
          hitSlop={10}>
          <View
            style={[
              styles.colorItem,
              {
                backgroundColor: item,
              },
            ]}
          />
        </Pressable>
      );
    },
    [color],
  );
  return (
    <Modal
      visible={openModal}
      onRequestClose={() => {
        setOpenModal(!openModal);
      }}
      transparent
      statusBarTranslucent>
      <View
        style={{
          flex: 1,
        }}>
        <Pressable
          onPress={() => setOpenModal(!openModal)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(217,217,217,0.5)',
          }}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: '#ffffff',
          }}>
          <View style={styles.headerStyle}>
            <Feather
              name="x"
              size={30}
              color={ColorCustom.red}
              onPress={() => setOpenModal(!openModal)}
            />
            <Text style={styles.txtHeader}>Color</Text>
            <Feather
              name="check"
              size={30}
              color={ColorCustom.green}
              onPress={() => {
                setColorPicker(color);
                setOpenModal(!openModal);
              }}
            />
          </View>
          <FlatList
            data={COLORS}
            renderItem={renderColor}
            numColumns={NUMBER_COLUMNS}
            contentContainerStyle={{
              justifyContent: 'space-between',
              alignSelf: 'center',
            }}
            removeClippedSubviews={true}
            getItemLayout={(_, index) => ({
              length: 44 / NUMBER_COLUMNS,
              offset: (44 / NUMBER_COLUMNS) * index,
              index,
            })}
            renderToHardwareTextureAndroid
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  colorPress: {
    width: 24,
    height: 24,
    borderRadius: 20,
    marginHorizontal: 10,
    marginVertical: 20,
    borderColor: '#0578FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorItem: {
    width: 20,
    height: 20,
    borderRadius: 20,
  },
  headerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  txtHeader: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: FONT_SIZE.TXT_LARGE_SIZE,
    color: ColorCustom.black,
  },
});
export default memo(MoreColor);
