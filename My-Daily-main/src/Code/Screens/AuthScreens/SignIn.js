import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  StatusBar,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import {FONT_FAMILY, FONT_SIZE} from '../../Assets/Constants/FontCustom';
import ButtonSvg from '../../CustomComponents/ButtonSvg';
import {EN_LANGUAGE, VN_LANGUAGE} from '../../Assets/Data/Language';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TextInput} from 'react-native';
import ColorCustom from '../../Assets/Constants/ColorCustom';
import Feather from 'react-native-vector-icons/Feather';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {auth, db} from '../../../Firebase/Firebase';
import {signInWithEmailAndPassword} from 'firebase/auth/react-native';
import TouchID from 'react-native-touch-id';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlertComponent from '../../CustomComponents/AlertComponent';
import {useDispatch, useSelector} from 'react-redux';
import {changeData} from '../../../ReduxToolKit/Slices/UserSetting';
import {changeSignalPass} from '../../../ReduxToolKit/Slices/SignalSlice';
import {useNetInfo} from '@react-native-community/netinfo';
import {useEffect} from 'react';
const {width: WIDTH_SCREEN, height: HEIGHT_SCREEN} = Dimensions.get('screen');
export default function SignIn({navigation}) {
  const currentLanguage = useSelector(state => state.UserSetting.language);

  const [languageSetting, setLanguageSetting] = useState(EN_LANGUAGE);
  useEffect(() => {
    async function getLanguage() {
      try {
        const language = await AsyncStorage.getItem('Language');
        if (language === 'English') {
          setLanguageSetting(EN_LANGUAGE);
        } else setLanguageSetting(VN_LANGUAGE);
      } catch (error) {
        console.log(error);
      }
    }
    getLanguage();
  }, [currentLanguage]);
  const language = languageSetting.login;
  const languageFingerprint = languageSetting.fingerprint;
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [checkError, setCheckError] = useState();
  const [security, setSecurity] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [alertTouch, setAlertTouch] = useState(false);
  const netifo = useNetInfo();
  const Signal = useSelector(state => state.Signal.isChangePass);
  const Initial = () => {
    setUsername('');
    setPassword('');
  };
  const signIn = async () => {
    if (netifo.isConnected) {
      if (username === '' && password === '') {
        setCheckError(4);
      } else {
        if (username === '') {
          setCheckError(2);
        }
        if (password === '') {
          setCheckError(3);
        }
        if (password !== '' && username !== '') {
          setCheckError(null);
          setIsLoading(true);
          if (username.includes('@')) {
            await signInWithEmailAndPassword(auth, username, password)
              .then(async data => {
                if (data.user.emailVerified) {
                  const docRef = doc(db, 'USER', data.user.uid);
                  await updateDoc(docRef, {
                    time: Timestamp.fromDate(new Date()),
                  });
                  if (Signal) {
                    await updateDoc(docRef, {password});
                    dispatch(changeSignalPass(false));
                  }
                  const checkFirst = await getDoc(docRef);
                  if (checkFirst.data().isFirstVisit) {
                    navigation.navigate('OnBoarding');
                  } else {
                    await updateDoc(docRef, {
                      isFirstVisit: true,
                    }).then(() => {
                      Initial();
                      navigation.navigate('InitialSetting');
                    });
                  }
                  dispatch(
                    changeData({
                      id: data.user.uid,
                      ...checkFirst.data(),
                    }),
                  );
                } else {
                  ToastAndroid.showWithGravity(
                    language.verifyEmail,
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                  );
                }
              })
              .catch(() => {
                setCheckError(1);
              })
              .finally(() => setIsLoading(false));
          } else {
            const account = await getDocs(
              query(collection(db, 'USER'), where('userName', '==', username)),
            );
            if (account.size === 0) {
              setCheckError(1);
              setIsLoading(false);
            } else {
              account.forEach(async document => {
                await signInWithEmailAndPassword(
                  auth,
                  document.data().email,
                  password,
                )
                  .then(async data => {
                    if (data.user.emailVerified) {
                      const docRef = doc(db, 'USER', data.user.uid);
                      await updateDoc(docRef, {
                        time: Timestamp.fromDate(new Date()),
                      });
                      if (Signal) {
                        await updateDoc(docRef, {password});
                        dispatch(changeSignalPass(false));
                      }
                      const checkFirst = await getDoc(docRef);
                      if (checkFirst.data().isFirstVisit) {
                        navigation.navigate('OnBoarding');
                      } else {
                        await updateDoc(docRef, {
                          isFirstVisit: true,
                        }).then(() => {
                          Initial();
                          navigation.navigate('InitialSetting');
                        });
                      }
                      dispatch(
                        changeData({
                          id: data.user.uid,
                          ...checkFirst.data(),
                        }),
                      );
                    } else {
                      ToastAndroid.showWithGravity(
                        language.verifyEmail,
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                      );
                    }
                  })
                  .catch(() => {
                    setCheckError(1);
                  })
                  .finally(() => setIsLoading(false));
              });
            }
          }
        }
      }
    } else {
      ToastAndroid.show(
        currentLanguage === 'English'
          ? 'Your internet is occuring a problem'
          : 'Mất kết nối internet',
        ToastAndroid.LONG,
      );
    }
  };
  const optionalConfigObject = {
    title: languageFingerprint.title,
    imageColor: ColorCustom.blue,
    imageErrorColor: ColorCustom.red,
    sensorDescription: languageFingerprint.sensorDescription,
    sensorErrorDescription: languageFingerprint.sensorErrorDescription,
    cancelText: languageFingerprint.cancelText,
    fallbackLabel: languageFingerprint.fallbackLabel,
    unifiedErrors: false,
    passcodeFallback: false,
  };

  const touchID = async () => {
    setCheckError(null);
    setIsLoading(true);
    await TouchID.authenticate(
      languageFingerprint.signin_application,
      optionalConfigObject,
    )
      .then(async () => {
        const value = await AsyncStorage.getItem('UserID');
        if (value === null) {
          setAlertTouch(!alertTouch);
          setIsLoading(false);
        } else {
          const account = await getDoc(doc(db, 'USER', value));
          if (!account.exists()) {
            setAlertTouch(!alertTouch);
            setIsLoading(false);
          } else {
            await signInWithEmailAndPassword(
              auth,
              account.data().email,
              account.data().password,
            )
              .then(async data => {
                const docRef = doc(db, 'USER', data.user.uid);

                await updateDoc(docRef, {time: Timestamp.fromDate(new Date())});
                Initial();
                navigation.navigate('OnBoarding');
                dispatch(
                  changeData({
                    id: data.user.uid,
                    ...checkFirst.data(),
                  }),
                );
              })
              .catch(() => {
                setCheckError(1);
              })
              .finally(() => setIsLoading(false));
          }
        }
      })
      .catch(() => setIsLoading(false));
  };
  return (
    <KeyboardAwareScrollView>
      <View>
        <AlertComponent
          title={language.titleAlert}
          open={alertTouch}
          setOpen={setAlertTouch}
          type={'ALERT'}
          subtitle={language.subTitleAlert}
          buttonList={[{txt: 'OK', onPress: () => setAlertTouch(!alertTouch)}]}
        />
        <Pressable
          style={{
            marginTop: StatusBar.currentHeight + 10,
            marginLeft: 15,
          }}
          onPress={() => navigation.navigate('InitialScreen')}>
          <Feather
            name="arrow-left-circle"
            size={30}
            color={ColorCustom.green}
          />
        </Pressable>
        <Text style={styles.text_welcome}>{language.header}</Text>
        <Text style={styles.text_signin}>{language.subHeader}</Text>
        <View
          style={[
            styles.textInput,
            {
              borderColor:
                checkError === 2
                  ? ColorCustom.red
                  : checkError === 4
                  ? ColorCustom.red
                  : checkError === 1
                  ? ColorCustom.red
                  : ColorCustom.gray,
            },
          ]}>
          <AntDesign
            name="user"
            size={15}
            color={ColorCustom.gray}
            style={{
              marginHorizontal: 15,
            }}
          />
          <TextInput
            placeholder={`${language.inputUsername} or ${language.inputEmail}`}
            placeholderTextColor={ColorCustom.gray}
            fontFamily={FONT_FAMILY.Medium}
            style={styles.textinput_user}
            defaultValue={username}
            onChangeText={setUsername}
          />
        </View>
        {(checkError === 2 || checkError === 4 || checkError === 1) && (
          <View style={[styles.textInput, {marginTop: 2, borderWidth: 0}]}>
            <MaterialIcons
              name="error"
              size={15}
              color={ColorCustom.red}
              style={{marginRight: 5}}
            />
            <Text style={styles.errorTxt}>
              {checkError === 1 ? language.error_1 : language.error}
            </Text>
          </View>
        )}

        <View
          style={[
            styles.textInput,
            {
              marginTop: 20,
              borderColor:
                checkError === 2
                  ? ColorCustom.red
                  : checkError === 4
                  ? ColorCustom.red
                  : checkError === 1
                  ? ColorCustom.red
                  : ColorCustom.gray,
            },
          ]}>
          <AntDesign
            name="lock"
            size={15}
            color={ColorCustom.gray}
            style={{
              marginHorizontal: 15,
            }}
          />
          <TextInput
            placeholder={language.inputPassword}
            placeholderTextColor={ColorCustom.gray}
            fontFamily={FONT_FAMILY.Medium}
            style={styles.textinput_user}
            defaultValue={password}
            onChangeText={setPassword}
            secureTextEntry={security}
          />
          <Pressable onPress={() => setSecurity(!security)} hitSlop={10}>
            <Feather
              name={security ? 'eye-off' : 'eye'}
              size={15}
              color={ColorCustom.gray}
              style={{
                marginHorizontal: 15,
              }}
            />
          </Pressable>
        </View>
        {(checkError === 3 || checkError === 4 || checkError === 1) && (
          <View style={[styles.textInput, {marginTop: 2, borderWidth: 0}]}>
            <MaterialIcons
              name="error"
              size={15}
              color={ColorCustom.red}
              style={{marginRight: 5}}
            />
            <Text style={styles.errorTxt}>
              {checkError === 1 ? language.error_1 : language.error}
            </Text>
          </View>
        )}
      </View>
      {isLoading && (
        <ActivityIndicator
          size={'large'}
          color={ColorCustom.green}
          style={{
            marginTop: 10,
          }}
        />
      )}
      <View
        style={{
          marginTop: 50,
          paddingLeft: 56,
        }}>
        <ButtonSvg
          height={HEIGHT_SCREEN * 0.06}
          width={WIDTH_SCREEN * 0.7}
          title={language.btnSignIn}
          onPress={signIn}></ButtonSvg>
      </View>
      <View>
        <Text
          style={styles.buttonForgot}
          onPress={() => {
            navigation.navigate('ForgotPassword');
            setUsername('');
            setPassword('');
          }}>
          {language.btnForgotPassword}
        </Text>
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orTxt}>{language.or}</Text>
          <View style={styles.divider} />
        </View>
        <Text style={[styles.orTxt, {alignSelf: 'center', marginVertical: 20}]}>
          {language.txtExternalLogin}
        </Text>

        <Pressable style={styles.fingerButton} onPress={touchID}>
          <Ionicons name="finger-print" size={40} color={ColorCustom.white} />
        </Pressable>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  text_welcome: {
    fontFamily: FONT_FAMILY.Medium,
    color: ColorCustom.black,
    fontSize: 20,
    marginTop: 45,
    marginLeft: 40,
  },
  text_signin: {
    fontFamily: FONT_FAMILY.Medium,
    color: ColorCustom.gray,
    fontSize: FONT_SIZE.TXT_SIZE,
    marginTop: 4,
    marginLeft: 40,
  },
  textinput_user: {
    width: '72%',
    color: ColorCustom.black,
  },
  textInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    width: '85%',
    alignSelf: 'center',
    borderRadius: 10,
    borderColor: ColorCustom.gray,
    marginTop: 140,
  },
  buttonForgot: {
    fontFamily: FONT_FAMILY.Medium,
    color: ColorCustom.green,
    fontSize: FONT_SIZE.TXT_SIZE,
    marginVertical: 20,
    alignSelf: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    alignSelf: 'center',
    marginHorizontal: 25,
  },
  divider: {
    width: '40%',
    height: 1,
    backgroundColor: ColorCustom.black,
  },
  orTxt: {
    fontSize: FONT_SIZE.TXT_SIZE,
    fontFamily: FONT_FAMILY.Medium,
    color: ColorCustom.black,
  },
  fingerButton: {
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 100,
    backgroundColor: ColorCustom.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorTxt: {
    color: ColorCustom.red,
    fontFamily: FONT_FAMILY.Regular,
    fontSize: FONT_SIZE.TXT_SMALLEST_SIZE,
  },
});
