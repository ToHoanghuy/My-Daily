import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  ActivityIndicator,
  TextInput,
  Animated,
} from 'react-native';
import React, {useState} from 'react';
import {FONT_FAMILY, FONT_SIZE} from '../../Assets/Constants/FontCustom';
import {EN_LANGUAGE, VN_LANGUAGE} from '../../Assets/Data/Language';
import {Pressable} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import ColorCustom from '../../Assets/Constants/ColorCustom';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ButtonSvg from '../../CustomComponents/ButtonSvg';
import AlertComponent from '../../CustomComponents/AlertComponent';
import CurrencyDropDown from '../../CustomComponents/CurrencyDropDown';
import DropdownImageComponent from '../../CustomComponents/DropdownImageComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth/react-native';
import {
  collection,
  setDoc,
  doc,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import {auth, db} from '../../../Firebase/Firebase';
import {useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
const {width: WIDTH_SCREEN, height: HEIGHT_SCREEN} = Dimensions.get('screen');
const SignUp = ({navigation}) => {
  const [security, setSecurity] = useState(true);
  const [securityConfirm, setSecurityConfirm] = useState(true);
  const currentLanguage = useSelector(state => state.UserSetting.language);

  const [language, setLanguage] = useState(EN_LANGUAGE.signUp);
  const [languageAlert, setLanguageAlert] = useState(EN_LANGUAGE.alert_signup);
  useEffect(() => {
    async function getLanguage() {
      try {
        const language = await AsyncStorage.getItem('Language');
        if (language === 'English') {
          setLanguage(EN_LANGUAGE.signUp);
          setLanguageAlert(EN_LANGUAGE.alert_signup);
        } else {
          setLanguage(VN_LANGUAGE.signUp);
          setLanguageAlert(VN_LANGUAGE.alert_signup);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getLanguage();
  }, [currentLanguage]);
  const [openAlert, setOpenAlert] = useState(false);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState(null);
  const [errorName, setErrorName] = useState(null);
  const [errorMail, setErrorMail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertType, setAlertType] = useState();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [openCurrency, setOpenCurrency] = useState(false);
  const [currency, setCurrency] = useState('');
  const [languageType, setLanguageType] = useState('');
  const [openLanguage, setOpenLanguage] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const onCheck = async () => {
    if (userName === '') {
      setErrorName(1);
    } else if (userName.includes(' ')) {
      setErrorName(2);
    } else setErrorName(null);
    if (email === '') {
      setErrorMail(1);
    } else {
      if (!email.includes('@')) {
        setErrorMail(2);
      } else setErrorMail(null);
    }
    if (password === '' && confirmPassword === '') {
      setErrorPassword(1);
    } else {
      if (password === '') {
        setErrorPassword(2);
      }
      if (confirmPassword === '') {
        setErrorPassword(3);
      }
      if (password !== '' && confirmPassword !== '') {
        if (password !== confirmPassword) {
          setErrorPassword(4);
        } else if (password.length <= 6) {
          setErrorPassword(5);
        } else setErrorPassword(null);
      }
    }
  };
  const onSignUp = async () => {
    const result = await getDocs(
      query(collection(db, 'USER'), where('userName', '==', userName)),
    );
    if (result.size !== 0) {
      setErrorName(3);
      return;
    }
    setLoading(true);
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async userCredential => {
        await sendEmailVerification(userCredential.user).then(async () => {
          setOpenAlert(true);
          const newData = {
            userName,
            email,
            password,
            language: languageType || 'English',
            currency: currency === '' ? 'USD' : currency.currencyCode,
            userImage:
              'https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png',
            isTouch: false,
            isNotification: false,
            isFirstVisit: false,
            time: Timestamp.fromDate(new Date()),
          };
          setDoc(doc(collection(db, 'USER'), userCredential.user.uid), newData);
          AsyncStorage.setItem('Language', languageType || 'English');
        });
      })
      .catch(() => {
        setAlertType(2);
        setOpenAlert(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (
      errorName === null &&
      errorMail === null &&
      errorPassword === null &&
      alertType === 1
    ) {
      onSignUp();
    }
  }, [errorName, errorMail, errorPassword, alertType]);
  const onCloseAlert = () => {
    setOpenAlert(false);
    setAlertType(null);
    navigation.navigate('SignIn');
  };
  const imageScale = scrollY.interpolate({
    inputRange: [-1, 0, headerHeight],
    outputRange: [1, 1, 0],
  });
  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: ColorCustom.white,
      }}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
        snapToOffsets={[headerHeight]}
        nestedScrollEnabled>
        {/* Header */}

        <View
          style={{backgroundColor: ColorCustom.green}}
          onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}>
          <View
            style={{marginTop: StatusBar.currentHeight, marginHorizontal: 20}}>
            <AnimatedPressable
              onPress={() => navigation.goBack()}
              hitSlop={20}
              style={{
                alignSelf: 'flex-start',
                opacity: scrollY.interpolate({
                  inputRange: [-1, 0, 30, 40],
                  outputRange: [1, 1, 0.5, 0],
                }),
              }}>
              <Feather
                name="arrow-left-circle"
                size={40}
                color={ColorCustom.white}
              />
            </AnimatedPressable>
          </View>
          <View
            style={{
              justifyContent: 'flex-end',
              flexDirection: 'row',
              marginRight: 10,
            }}>
            <Animated.Text
              style={[
                styles.text,
                {
                  marginTop: 50,
                  marginRight: -HEIGHT_SCREEN * 0.1,
                  opacity: scrollY.interpolate({
                    inputRange: [-1, 0, 300 / 4, 300 / 2],
                    outputRange: [1, 1, 0.5, 0],
                  }),
                },
              ]}>
              {language.header}
            </Animated.Text>
            <Animated.Image
              style={[styles.image, {transform: [{scale: imageScale}]}]}
              source={require('../../Assets/Images/SignUp.png')}
              resizeMode={'contain'}
            />
          </View>
        </View>
        {/* Body */}
        <Animated.View
          style={{
            paddingHorizontal: 20,
            paddingTop: StatusBar.currentHeight,
          }}>
          <AnimatedPressable
            onPress={() => navigation.goBack()}
            hitSlop={20}
            style={{
              alignSelf: 'flex-start',
              transform: [
                {
                  scale: scrollY.interpolate({
                    inputRange: [-1, 0, headerHeight],
                    outputRange: [0, 0, 1],
                    extrapolate: 'clamp',
                  }),
                },
              ],
              opacity: scrollY.interpolate({
                inputRange: [-1, 0, 280, 300],
                outputRange: [0, 0, 0.5, 1],
                extrapolate: 'clamp',
              }),
            }}>
            <Feather
              name="arrow-left-circle"
              size={40}
              color={ColorCustom.middleGrey}
            />
          </AnimatedPressable>
        </Animated.View>
        <View
          style={[
            styles.styleTextInput,
            {
              borderColor:
                errorName === 1 || errorName === 2 || errorName === 3
                  ? ColorCustom.red
                  : ColorCustom.gray,
            },
          ]}>
          <AntDesign
            name="user"
            size={15}
            color={ColorCustom.gray}
            style={styles.icon}
          />
          <TextInput
            placeholder={language.inputUsername}
            placeholderTextColor={ColorCustom.gray}
            fontFamily={FONT_FAMILY.Medium}
            style={styles.textinput}
            defaultValue={userName}
            onChangeText={setUserName}
          />
        </View>
        {errorName && (
          <View style={[styles.styleTextInput, {borderWidth: 0, marginTop: 2}]}>
            <MaterialIcons
              name="error"
              size={15}
              color={ColorCustom.red}
              style={{marginRight: 5}}
            />
            <Text style={styles.txt_error}>
              {errorName === 1
                ? language.errorUsername
                : errorName === 2
                ? language.errorUsername_1
                : language.errorUsername_2}
            </Text>
          </View>
        )}
        <View
          style={[
            styles.styleTextInput,
            {
              borderColor:
                errorMail === 1 || errorMail === 2
                  ? ColorCustom.red
                  : ColorCustom.gray,
            },
          ]}>
          <MaterialIcons
            name="alternate-email"
            size={16}
            color={ColorCustom.gray}
            style={styles.icon}
          />
          <TextInput
            placeholder={language.inputEmail}
            placeholderTextColor={'#BABABA'}
            fontFamily={FONT_FAMILY.Medium}
            style={[styles.textinput, {width: '80%'}]}
            defaultValue={email}
            onChangeText={setEmail}
          />
        </View>
        {(errorMail === 1 || errorMail === 2) && (
          <View style={[styles.styleTextInput, {borderWidth: 0, marginTop: 2}]}>
            <MaterialIcons
              name="error"
              size={15}
              color={ColorCustom.red}
              style={{marginRight: 5}}
            />
            <Text style={styles.txt_error}>
              {errorMail === 1 ? language.errorEmail_2 : language.errorEmail_1}
            </Text>
          </View>
        )}
        <View
          style={[
            styles.styleTextInput,
            {
              borderColor:
                errorPassword === 1 ||
                errorPassword === 2 ||
                errorPassword === 4 ||
                errorPassword === 5
                  ? ColorCustom.red
                  : ColorCustom.gray,
            },
          ]}>
          <AntDesign
            name="lock"
            size={15}
            color={ColorCustom.gray}
            style={styles.icon}
          />
          <TextInput
            placeholder={language.inputPassword}
            placeholderTextColor={ColorCustom.gray}
            fontFamily={FONT_FAMILY.Medium}
            style={styles.textinput}
            defaultValue={password}
            onChangeText={setPassword}
            secureTextEntry={security}
          />
          <Pressable onPress={() => setSecurity(!security)} hitSlop={10}>
            <Feather
              name={security ? 'eye-off' : 'eye'}
              size={16}
              color={ColorCustom.gray}
              style={styles.icon}
            />
          </Pressable>
        </View>
        {(errorPassword === 1 ||
          errorPassword === 2 ||
          errorPassword === 4 ||
          errorPassword === 5) && (
          <View
            style={[
              styles.styleTextInput,
              {borderWidth: 0, marginTop: 2, alignItems: 'flex-start'},
            ]}>
            <MaterialIcons
              name="error"
              size={15}
              color={ColorCustom.red}
              style={{marginRight: 5}}
            />
            <Text style={styles.txt_error}>
              {errorPassword === 1 || errorPassword === 2
                ? language.errorPassword
                : errorPassword === 4
                ? language.errorPasswordAgain_2
                : language.errorPasswordLength}
            </Text>
          </View>
        )}

        <View
          style={[
            styles.styleTextInput,
            {
              borderColor:
                errorPassword === 1 ||
                errorPassword === 3 ||
                errorPassword === 4
                  ? ColorCustom.red
                  : ColorCustom.gray,
            },
          ]}>
          <AntDesign
            name="lock"
            size={15}
            color={ColorCustom.gray}
            style={styles.icon}
          />
          <TextInput
            placeholder={language.inputPasswordAgain}
            placeholderTextColor={ColorCustom.gray}
            fontFamily={FONT_FAMILY.Medium}
            style={styles.textinput}
            defaultValue={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={securityConfirm}
          />
          <Pressable
            onPress={() => setSecurityConfirm(!securityConfirm)}
            hitSlop={10}>
            <Feather
              name={securityConfirm ? 'eye-off' : 'eye'}
              size={15}
              color={ColorCustom.gray}
              style={styles.icon}
            />
          </Pressable>
        </View>
        {(errorPassword === 1 ||
          errorPassword === 3 ||
          errorPassword === 4) && (
          <View
            style={[
              styles.styleTextInput,
              {borderWidth: 0, marginTop: 2, alignItems: 'flex-start'},
            ]}>
            <MaterialIcons
              name="error"
              size={15}
              color={ColorCustom.red}
              style={{marginRight: 5}}
            />
            <Text style={styles.txt_error}>
              {errorPassword === 1 || errorPassword === 3
                ? language.errorPassword
                : language.errorPasswordAgain_2}
            </Text>
          </View>
        )}
        {/* DropDown */}

        <View style={{marginTop: 20, alignSelf: 'center'}}>
          <DropdownImageComponent
            width={WIDTH_SCREEN * 0.85}
            height={50}
            typeMoney={currency}
            setTypeMoney={setCurrency}
            open={openCurrency}
            setOpen={setOpenCurrency}
            placeHolder={'Currency'}
            fontSize={15}
            fontFamily={FONT_FAMILY.Regular}
            animated={false}
          />
          <View
            style={{
              marginTop: 20,
              zIndex: 99,
            }}>
            <CurrencyDropDown
              width={WIDTH_SCREEN * 0.85}
              height={50}
              open={openLanguage}
              setOpen={setOpenLanguage}
              data={['English', 'Vienamese']}
              currency={languageType}
              setCurrency={setLanguageType}
              placeHolder={'Language'}
              animated={false}
              align={'flex-start'}
              borderRadius={10}
              paddingHorizontal={10}
            />
          </View>
        </View>
        {/* Footer */}
        {loading && (
          <View style={styles.btn_container}>
            <ActivityIndicator size="large" color={ColorCustom.green} />
          </View>
        )}

        <View
          style={[styles.btn_container, {marginTop: openLanguage ? -90 : 10}]}>
          <ButtonSvg
            height={HEIGHT_SCREEN * 0.06}
            width={WIDTH_SCREEN * 0.7}
            title={language.btnSignUp}
            onPress={() => {
              onCheck();
              setAlertType(1);
            }}
          />
        </View>
        <View style={styles.txt_container}>
          <Text style={[{color: ColorCustom.gray}, styles.txt_footer]}>
            {language.txtBottom}
          </Text>
          <Pressable
            onPress={() => {
              navigation.navigate('SignIn');
            }}>
            <Text
              style={[
                styles.txt_footer,
                {color: ColorCustom.green, marginLeft: 10},
              ]}>
              {language.btnSignIn}
            </Text>
          </Pressable>
        </View>
        <View
          style={{
            width: '100%',
            height: headerHeight - 120,
          }}
        />
        {/* Alert */}
        {alertType === 1 ? (
          <AlertComponent
            title={languageAlert.success.title}
            open={openAlert}
            setOpen={setOpenAlert}
            type={'SUCCESS'}
            subtitle={languageAlert.success.content}
            disableBackDrop={true}
            buttonList={[
              {
                txt: languageAlert.success.btn,
                onPress: onCloseAlert,
              },
            ]}
          />
        ) : (
          <AlertComponent
            title={languageAlert.fail.title}
            open={openAlert}
            setOpen={setOpenAlert}
            type={'FAILED'}
            subtitle={languageAlert.fail.content}
            buttonList={[
              {
                txt: languageAlert.fail.btn,
                onPress: () => {
                  setOpenAlert(false);
                },
              },
            ]}
          />
        )}
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: FONT_FAMILY.Medium,
    fontSize: 25,
    color: ColorCustom.white,
  },
  textinput: {
    width: '72%',
    color: ColorCustom.black,
  },
  styleTextInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    width: '85%',
    alignSelf: 'center',
    borderRadius: 10,
    borderColor: ColorCustom.gray,
    marginTop: 20,
  },
  icon: {
    marginHorizontal: 15,
  },
  image: {
    width: 300,
    height: 300,
  },
  btn_container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  txt_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  txt_footer: {
    fontSize: 15,
    fontFamily: FONT_FAMILY.Medium,
  },
  txt_error: {
    color: ColorCustom.red,
    fontFamily: FONT_FAMILY.Regular,
    fontSize: FONT_SIZE.TXT_SMALLER_SIZE,
  },
});

export default SignUp;
