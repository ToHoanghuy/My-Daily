import {View, Text, Image} from 'react-native';
import React from 'react';
import {FONT_FAMILY} from '../Assets/Constants/FontCustom';
import ColorCustom from '../Assets/Constants/ColorCustom';

const NoDataFond = ({widthImage = 120, heightImage = 120, fontSize}) => {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <Image
        source={require('../Assets/Images/corrupted-file.png')}
        style={{
          width: widthImage,
          height: heightImage,
          resizeMode: 'contain',
        }}
      />
      <Text
        style={{
          fontFamily: FONT_FAMILY.Regular,
          color: ColorCustom.gray,
          fontSize,
        }}>
        No Data Found!
      </Text>
    </View>
  );
};

export default NoDataFond;
