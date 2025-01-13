import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ToastAndroid,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FONT_FAMILY} from '../../../Assets/Constants/FontCustom';
import MoreColor from '../../../CustomComponents/MoreColor';
import IconPicker from '../../../CustomComponents/IconPicker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {withTiming} from 'react-native-reanimated';
import {useCallback} from 'react';
import ColorCustom from '../../../Assets/Constants/ColorCustom';
const colorData = [
  '#F44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#03A9F4',
  '#00BCD4',
  '#C62828',
  '#AD1457',
  '#6A1B9A',
  '#4527A0',
  '#283593',
  '#1565C0',
  '#0277BD',
  '#00838F',
  '#009688',
  '#4CAF50',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#FFC107',
  '#FF9800',
  '#FF5722',
  '#00695C',
  '#2E7D32',
  '#558B2F',
  '#9E9D24',
  '#F9A825',
  '#FF8F00',
  '#EF6C00',
];

const iconData = [
  {en: 'glass', vi: 'ly nước'},
  {en: 'music', vi: 'âm nhạc'},
  {en: 'film', vi: 'phim'},
  {en: 'road', vi: 'giao thông'},
  {en: 'headphones', vi: 'tai nghe'},
  {en: 'camera', vi: 'máy ảnh/chụp hình'},
  {en: 'pencil', vi: 'bút chì/dụng cụ học tập'},
  {en: 'gift', vi: 'quà tặng'},
  {en: 'plane', vi: 'máy bay/du lịch'},
  {en: 'phone-square', vi: 'điện thoại/liên lạc'},
  {en: 'credit-card', vi: 'thẻ tín dụng/ngân hàng'},
  {en: 'feed', vi: 'wifi/internet/mạng'},
  {en: 'wrench', vi: 'cờ lê/sửa chữa'},
  {en: 'truck', vi: 'xe tải/vận chuyển'},
  {en: 'suitcase', vi: 'vali/du lịch'},
  {en: 'bell-o', vi: 'chuông'},
  {en: 'coffee', vi: 'cà phê/ăn uống'},
  {en: 'cutlery', vi: 'dao nĩa/ ăn uống'},
  {en: 'file-text-o', vi: 'file/làm việc'},
  {en: 'building-o', vi: 'tòa nhà/chỗ ở/biệt thự/chung cư/căn hộ'},
  {en: 'hospital-o', vi: 'bệnh viện'},
  {en: 'laptop', vi: 'laptop/công nghệ'},
  {en: 'gamepad', vi: 'game/giải trí'},
  {en: 'car', vi: 'xe hơi'},
  {en: 'soccer-ball-o', vi: 'bóng đá/thể thao'},
  {en: 'newspaper-o', vi: 'báo chí'},
  {en: 'motorcycle', vi: 'xe máy'},
  {en: 'bathtub', vi: 'bồn tắm'},
  {en: 'ticket', vi: 'vé/ vé số'},
];
const {width} = Dimensions.get('screen');
const circleSize = 25;
const circleRingSize = 2;
const ITEM_SIZE = (width - 64) / 7;
const ICON_SIZE = (width - 64) / 6;
const NewCategory = ({onPressBack, setCategory, language, animatedValue}) => {
  const [openModal, setOpenModal] = useState(false);
  const [openIcon, setOpenIcon] = useState(false);
  const [colorPicker, setColorPicker] = useState('#7A7A7A');
  const [iconPicker, setIconPicker] = useState('ticket');
  const [name, setName] = useState('');
  const onChoose = useCallback(() => {
    if (name === '') {
      if (language === 'English') {
        ToastAndroid.showWithGravity(
          'Please fill in the field!',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      } else {
        ToastAndroid.showWithGravity(
          'Vui lòng nhập tên danh mục!',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      }
    } else {
      setCategory({
        name: {
          EN: name,
          VN: name,
        },
        icon_name: iconPicker,
        color: colorPicker,
      });
      animatedValue.value = withTiming(0);
    }
  }, [name, iconPicker, colorPicker, language]);
  const listColor = useCallback(() => {
    return colorData.map((item, index) => {
      return (
        <Pressable
          key={index}
          style={styles.item}
          onPress={() => {
            setColorPicker(item);
          }}>
          <View
            style={[
              styles.circle,
              {
                borderColor:
                  colorPicker === item ? '#0578FF' : ColorCustom.white,
              },
            ]}>
            <View style={[styles.circleInside, {backgroundColor: item}]} />
          </View>
        </Pressable>
      );
    });
  }, [colorPicker]);

  const listIcon = useCallback(() => {
    return iconData.map((item, index) => {
      return (
        <Pressable
          key={index}
          style={styles.icon}
          onPress={() => {
            setIconPicker(item.en);
          }}>
          <View
            style={[
              styles.circleIcon,
              {
                borderWidth: item.en === iconPicker ? 2 : 0,
                borderColor: ColorCustom.black,
              },
            ]}>
            <FontAwesome name={item.en} size={20} color={'#8C8C8C'} />
          </View>
        </Pressable>
      );
    });
  }, [iconPicker]);

  return (
    <ScrollView style={styles.container}>
      {/* MoreIcon */}
      <IconPicker
        open={openIcon}
        setOpen={setOpenIcon}
        setIconPicker={setIconPicker}
      />
      {/* MoreColor */}
      <MoreColor
        openModal={openModal}
        setOpenModal={setOpenModal}
        setColorPicker={setColorPicker}
      />

      <View style={styles.header}>
        <Pressable onPress={onPressBack}>
          <Ionicons name="ios-arrow-back" size={30} color={ColorCustom.black} />
        </Pressable>

        <Text style={styles.textHeader}>
          {language === 'English' ? `New Category` : `Danh mục mới`}
        </Text>

        <Pressable onPress={onChoose}>
          <Ionicons
            name="ios-checkmark-sharp"
            size={30}
            color={ColorCustom.green}
          />
        </Pressable>
      </View>

      <View style={styles.second}>
        <View style={[styles.category, {backgroundColor: colorPicker}]}>
          <FontAwesome name={iconPicker} size={24} color={ColorCustom.white} />
        </View>
        {/* TextInput */}
        <View style={styles.textInputView}>
          <TextInput
            style={styles.textInputStyle}
            defaultValue={name}
            onChangeText={setName}
          />
        </View>
      </View>

      <View style={styles.colorIcon}>
        <View style={styles.titleColorIcon}>
          <Ionicons
            name="ios-color-palette-outline"
            size={26}
            color={'#0578FF'}
          />
          <Text style={styles.textColorIcon}>
            {language === 'English' ? `Color` : `Màu sắc`}
          </Text>
        </View>

        <View>
          <View style={styles.containerList}>
            {listColor()}
            <Pressable style={styles.item} onPress={() => setOpenModal(true)}>
              <Ionicons name="ios-add-circle" size={31} color={'#B4B8B5'} />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.colorIcon}>
        <View style={styles.titleColorIcon}>
          <Ionicons name="cafe-outline" size={26} color={'#ED5805'} />
          <Text style={styles.textColorIcon}>Icon</Text>
        </View>

        <View>
          <View style={styles.containerList}>
            {listIcon()}
            <Pressable style={styles.icon} onPress={() => setOpenIcon(true)}>
              <Ionicons name="ios-add-circle" size={40} color={'#B4B8B5'} />
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textHeader: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: 24,
    color: 'black',
  },
  containerList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  second: {
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  category: {
    width: 50,
    height: 50,
    backgroundColor: 'black',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputView: {
    borderBottomWidth: 1,
    width: 150,
    height: 50,
  },
  textInputStyle: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: 16,
    paddingLeft: 10,
    color: '#000',
  },
  colorIcon: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  titleColorIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textColorIcon: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: 14,
    color: 'black',
    paddingLeft: 20,
  },
  circle: {
    width: circleSize + circleRingSize * 4,
    height: circleSize + circleRingSize * 4,
    borderRadius: 99,
    backgroundColor: 'white',
    borderWidth: circleRingSize,
    borderColor: 'transparent',
  },
  circleInside: {
    width: circleSize,
    height: circleSize,
    borderRadius: 9999,
    position: 'absolute',
    top: circleRingSize,
    left: circleRingSize,
  },
  circleIcon: {
    width: 35,
    height: 35,
    borderRadius: 999,
    backgroundColor: '#DEDEDE',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default React.memo(NewCategory);
