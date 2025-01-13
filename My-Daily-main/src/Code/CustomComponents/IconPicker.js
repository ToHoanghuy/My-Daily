import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import {FONTAWESOME_ICONS} from '../Assets/Data/Icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {FONT_FAMILY} from '../Assets/Constants/FontCustom';
import Feather from 'react-native-vector-icons/Feather';
const {width: WIDTH} = Dimensions.get('screen');

const IconPicker = ({open, setOpen, setIconPicker}) => {
  const Number_Of_Columns = Math.floor(WIDTH / 60);
  const [icon, setIcon] = useState('glass');
  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <View style={styles.icon_container} key={index}>
          <Pressable
            style={[styles.pressable, {borderWidth: item.en === icon ? 2 : 0}]}
            onPress={() => {
              setIcon(item.en);
            }}
            testID={`PressItem${index}`}>
            <FontAwesome name={item.en} size={20} color={'#8C8C8C'} />
          </Pressable>
        </View>
      );
    },
    [icon],
  );

  return (
    <Modal
      visible={open}
      onRequestClose={() => setOpen(false)}
      transparent
      statusBarTranslucent>
      <View style={{flex: 1}}>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(217,217,217,0.5)',
          }}
          onPress={() => setOpen(false)}
        />
        <View style={styles.container}>
          <View
            style={[
              {paddingHorizontal: (WIDTH - Number_Of_Columns * 60) / 2 + 8},
              styles.header,
            ]}>
            <Pressable onPress={() => setOpen(!open)} testID="Close">
              <Feather name="x" size={34} color="#DF2828" />
            </Pressable>
            <Text style={styles.text} testID="Title">
              Category
            </Text>
            <Pressable
              onPress={() => {
                setIconPicker(icon);
                setOpen(false);
              }}
              testID="Choose">
              <Feather name="check" size={34} color="#25A90F" />
            </Pressable>
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={FONTAWESOME_ICONS}
            renderItem={renderItem}
            numColumns={Number_Of_Columns}
            removeClippedSubviews={true}
            getItemLayout={(item, index) => ({
              length: 60,
              offset: 60 * index,
              index,
            })}
            initialNumToRender={6}
            renderToHardwareTextureAndroid
          />
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    flex: 1,
  },
  pressable: {
    width: 40,
    height: 40,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DEDEDE',
    borderColor: 'hsl(0,0%,50%)',
  },
  icon_container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
  },
  text: {
    color: '#000',
    fontSize: 20,
    fontFamily: FONT_FAMILY.Medium,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
});
export default React.memo(IconPicker);
