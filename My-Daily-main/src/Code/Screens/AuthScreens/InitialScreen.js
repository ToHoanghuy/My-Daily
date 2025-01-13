import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  StatusBar,
  Pressable,
} from 'react-native';
import React from 'react';
import ButtonSvg from '../../CustomComponents/ButtonSvg';
import {FONT_FAMILY, FONT_SIZE} from '../../Assets/Constants/FontCustom';
import {EN_LANGUAGE, VN_LANGUAGE} from '../../Assets/Data/Language';
import ColorCustom from '../../Assets/Constants/ColorCustom';
import {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useState} from 'react';
import {useSelector} from 'react-redux';

const {width: WIDTH_SCREEN, height: HEIGHT_SCREEN} = Dimensions.get('screen');
const InitialScreen = ({navigation}) => {
  const currentLanguage = useSelector(state => state.UserSetting.language);

  const [language, setLanguage] = useState(EN_LANGUAGE.initialSetting);
  useEffect(() => {
    async function dataLanguage() {
      try {
        const value = await AsyncStorage.getItem('Language');
        if (!value) {
          await AsyncStorage.setItem('Language', 'English');
          setLanguage(EN_LANGUAGE.initialSetting);
        } else {
          if (value === 'English') {
            setLanguage(EN_LANGUAGE.initialSetting);
          } else setLanguage(VN_LANGUAGE.initialSetting);
        }
      } catch (error) {
        console.log(error);
      }
      // }
    }
    dataLanguage();
  }, [currentLanguage]);

  return (
    <ScrollView style={styles.view}>
      <Image
        source={require('../../Assets/Images/Logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Image
        source={require('../../Assets/Images/initial-setting.png')}
        style={{alignSelf: 'center'}}
      />

      <Text style={[styles.text, {textAlign: 'center', marginTop: 50}]}>
        {language.title}
      </Text>
      <View style={[styles.container, {marginTop: 30}]}>
        <ButtonSvg
          height={HEIGHT_SCREEN * 0.06}
          width={WIDTH_SCREEN * 0.7}
          title={language.btnSignIn}
          onPress={() => navigation.navigate('SignIn')}
        />
      </View>

      <View style={[styles.container, {marginTop: 20}]}>
        <Pressable
          style={[styles.container, styles.pressable]}
          onPress={() => navigation.navigate('SignUp')}>
          <Text style={[styles.text, {fontSize: FONT_SIZE.TXT_MIDDLE_SIZE}]}>
            {language.btnSignUp}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: ColorCustom.background,
    paddingTop: StatusBar.currentHeight + 10,
  },
  logo: {
    width: 150,
    height: 84,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  text: {
    fontFamily: FONT_FAMILY.Medium,
    fontSize: FONT_SIZE.TXT_LARGE_SIZE,
    color: ColorCustom.black,
  },
  pressable: {
    width: WIDTH_SCREEN * 0.7,
    paddingVertical: 8,
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 10,
    height: HEIGHT_SCREEN * 0.06,
  },
});

export default InitialScreen;
