import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
  KeyboardAvoidingView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {FONT_FAMILY, FONT_SIZE} from '../../Assets/Constants/FontCustom';
import {EN_LANGUAGE, VN_LANGUAGE} from '../../Assets/Data/Language';
import Feather from 'react-native-vector-icons/Feather';
import ButtonSvg from '../../CustomComponents/ButtonSvg';
import AlertComponent from '../../CustomComponents/AlertComponent';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ColorCustom from '../../Assets/Constants/ColorCustom';
import {useState, useEffect} from 'react';
import {sendPasswordResetEmail} from 'firebase/auth/react-native';
import {auth} from '../../../Firebase/Firebase';
import {useDispatch, useSelector} from 'react-redux';
import {changeSignalPass} from '../../../ReduxToolKit/Slices/SignalSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width: WIDTH_SCREEN, height: HEIGHT_SCREEN} = Dimensions.get('screen');
const ForgotPassword = ({navigation}) => {
  const [curLanguage, setCurLanguage] = useState(EN_LANGUAGE);
  const currentLanguage = useSelector(state => state.UserSetting.language);
  useEffect(() => {
    async function dataLanguage() {
      try {
        const value = await AsyncStorage.getItem('Language');

        if (value === 'English') {
          setCurLanguage(EN_LANGUAGE);
        } else setCurLanguage(VN_LANGUAGE);
      } catch (error) {
        console.log(error);
      }
    }
    dataLanguage();
  }, [currentLanguage]);
  const {forgotPassword: language} = curLanguage;
  const [openAlert, setOpenAlert] = useState(false);
  const [checkError, setCheckError] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resend, setResend] = useState(null);
  const [timer, setTimer] = useState(30);
  const dispatch = useDispatch();
  useEffect(() => {
    if (resend) {
      if (timer > 0) {
        setTimeout(() => {
          setTimer(timer - 1);
        }, 1000);
      } else {
        setResend(false);
        setTimer(30);
      }
    }
  });
  const onBack = () => {
    setEmail('');
    navigation.goBack();
  };
  const onSubmit = async () => {
    if (email === '') {
      setCheckError(1);
    } else {
      if (!email.includes('@')) {
        setCheckError(2);
      } else {
        setLoading(true);
        sendPasswordResetEmail(auth, email)
          .then(() => {
            dispatch(changeSignalPass(true));
            setCheckError(null);
            setOpenAlert(true);
            if (resend === null) {
              setResend(false);
            }
          })
          .catch(() => setCheckError(3))
          .finally(() => setLoading(false));
      }
    }
  };
  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: ColorCustom.white,
      }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header_container}>
          <Pressable style={styles.btn_left} onPress={onBack}>
            <Feather
              name="arrow-left-circle"
              size={40}
              color={ColorCustom.white}
            />
          </Pressable>
          <Image
            style={styles.image}
            source={require('../../Assets/Images/Woman_enters_the_password_from_her_account.png')}
            resizeMode="contain"
          />
          <View style={styles.txt_container}>
            <Text style={styles.style_text}>{language.header}</Text>
            <Text
              style={[
                styles.style_text,
                {fontSize: FONT_SIZE.TXT_SMALLER_SIZE, marginTop: 5},
              ]}>
              {language.subHeader}
            </Text>
          </View>
        </View>

        <View style={styles.horizontal_view}>
          <View
            style={[
              styles.textinput_container,
              {
                borderColor:
                  checkError === 1 || checkError === 2 || checkError === 3
                    ? ColorCustom.red
                    : ColorCustom.gray,
              },
            ]}>
            <MaterialIcons
              name="alternate-email"
              size={16}
              color={ColorCustom.gray}
              style={{marginHorizontal: 15}}
            />
            <TextInput
              placeholder={language.inputEmail}
              placeholderTextColor={ColorCustom.gray}
              fontFamily={FONT_FAMILY.Medium}
              style={styles.textinput}
              defaultValue={email}
              onChangeText={setEmail}
              editable={!resend}
            />
          </View>

          <View style={styles.error_container}>
            <View style={{flexDirection: 'row', width: '80%'}}>
              {checkError && (
                <>
                  <MaterialIcons
                    name="error"
                    size={15}
                    color={ColorCustom.red}
                    style={{marginRight: 5}}
                  />
                  <Text style={styles.txt_error} testID="error-txt">
                    {checkError === 1
                      ? language.errorEmail_2
                      : checkError === 2
                      ? language.errorEmail_1
                      : checkError === 3
                      ? language.errorEmail_3
                      : null}
                  </Text>
                </>
              )}
            </View>
            {resend !== null && checkError === null && (
              <Pressable
                style={styles.btn_resend}
                hitSlop={10}
                onPress={() => {
                  setResend(true);
                  onSubmit();
                }}
                disabled={resend}>
                <Text
                  style={[
                    styles.txt_error,
                    {
                      color: ColorCustom.middleGrey,
                      fontSize: FONT_SIZE.TXT_SMALLER_SIZE,
                    },
                  ]}
                  testID="resend-txt">
                  {resend ? `${timer} s` : language.resend}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
        <View
          style={{
            alignSelf: 'center',
          }}>
          {loading && (
            <ActivityIndicator
              size={'large'}
              color={ColorCustom.green}
              style={{
                marginTop: 10,
              }}
              testID="loading"
            />
          )}
        </View>

        <View style={styles.btn_bottom}>
          <ButtonSvg
            height={HEIGHT_SCREEN * 0.06}
            width={WIDTH_SCREEN * 0.7}
            title={language.btnSubmit}
            onPress={onSubmit}
          />
        </View>
        {/* Alert */}

        <AlertComponent
          title={language.titleSuccess}
          open={openAlert}
          setOpen={setOpenAlert}
          type={'SUCCESS'}
          subtitle={language.success_change}
          buttonList={[
            {
              txt: language.alert_btn,
              onPress: () => {
                setOpenAlert(false);
              },
            },
          ]}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  style_text: {
    fontFamily: FONT_FAMILY.Medium,
    fontSize: FONT_SIZE.TXT_LARGE_SIZE,
    color: ColorCustom.white,
  },
  textinput: {
    width: '80%',
    color: ColorCustom.black,
  },
  header_container: {
    backgroundColor: ColorCustom.green,
    paddingBottom: 20,
    paddingTop: StatusBar.currentHeight,
  },
  btn_left: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    zIndex: 999,
  },
  image: {
    width: WIDTH_SCREEN,
    height: HEIGHT_SCREEN * 0.4,
    marginTop: -30,
  },
  txt_container: {
    marginTop: -50,
    marginHorizontal: 20,
  },
  textinput_container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    width: '85%',
    alignSelf: 'center',
    borderRadius: 10,
  },
  btn_bottom: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt_error: {
    color: ColorCustom.red,
    fontFamily: FONT_FAMILY.Regular,
    fontSize: FONT_SIZE.TXT_SMALLEST_SIZE,
  },
  error_container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: '85%',
    marginTop: 3,
    justifyContent: 'space-between',
  },
  horizontal_view: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10,
  },
  btn_resend: {
    width: '20%',
    alignItems: 'flex-end',
  },
});

export default ForgotPassword;
