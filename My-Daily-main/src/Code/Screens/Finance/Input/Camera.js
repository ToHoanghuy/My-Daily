import {View, Text, Pressable, StyleSheet} from 'react-native';
import React, {useCallback} from 'react';
import ModalComponent from '../../../CustomComponents/ModalComponent';
import {FONT_FAMILY, FONT_SIZE} from '../../../Assets/Constants/FontCustom';
import ImageCropPicker from 'react-native-image-crop-picker';
import {uuidv4} from '@firebase/util';
import ColorCustom from '../../../Assets/Constants/ColorCustom';
const Camera = ({open, setOpen, language, imagePicker, setImagePicker}) => {
  const openCamera = useCallback(() => {
    ImageCropPicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
      useFrontCamera: true,
      mediaType: 'photo',
    })
      .then(image => {
        setImagePicker([
          ...imagePicker,
          {
            base64: image.data,
            type: image.mime,
            size: image.size,
            imageID: uuidv4(),
          },
        ]);
        setOpen(false);
      })
      .catch(() => setOpen(false));
  }, [imagePicker]);
  const openLibrary = useCallback(() => {
    ImageCropPicker.openPicker({
      multiple: true,
      includeBase64: true,
      mediaType: 'photo',
    })
      .then(imageArray => {
        let tmp = [...imagePicker];
        imageArray.forEach(image => {
          tmp.push({
            base64: image.data,
            type: image.mime,
            size: image.size,
            imageID: uuidv4(),
          });
        });
        setImagePicker([...tmp]);
      })
      .catch(() => setOpen(false))
      .finally(() => setOpen(false));
  }, [imagePicker]);
  return (
    <ModalComponent visible={open}>
      <View style={styles.overview}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setOpen(!open)}
        />
        <View style={styles.pressableContainer}>
          <Pressable onPress={openCamera} style={styles.pressable}>
            <Text style={styles.txt}>{language.newPhoto}</Text>
          </Pressable>
          <Pressable onPress={openLibrary} style={styles.pressable}>
            <Text style={styles.txt}>{language.library}</Text>
          </Pressable>
          <Pressable onPress={() => setOpen(!open)} style={styles.pressable}>
            <Text
              style={[
                styles.txt,
                {
                  color: ColorCustom.red,
                },
              ]}>
              {language.cancel}
            </Text>
          </Pressable>
        </View>
      </View>
    </ModalComponent>
  );
};
const styles = StyleSheet.create({
  overview: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressableContainer: {
    backgroundColor: 'white',
    paddingVertical: 30,
    width: '80%',
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  pressable: {
    borderWidth: 1,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
  },
  txt: {
    color: ColorCustom.black,
    fontSize: FONT_SIZE.TXT_SIZE,
    fontFamily: FONT_FAMILY.Regular,
  },
});
export default React.memo(Camera);
