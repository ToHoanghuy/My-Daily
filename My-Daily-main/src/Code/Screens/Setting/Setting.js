import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Modal,
  TextInput,
  StyleSheet,
  ToastAndroid,
  Linking,
} from 'react-native';
import React, {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import HeaderDrawer from '../../CustomComponents/HeaderDrawer';
import ColorCustom from '../../Assets/Constants/ColorCustom';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FONT_FAMILY, FONT_SIZE} from '../../Assets/Constants/FontCustom';
import {EN_LANGUAGE, VN_LANGUAGE} from '../../Assets/Data/Language';
import SwitchComponent from '../../CustomComponents/SwitchComponent';
import ImageCropPicker from 'react-native-image-crop-picker';
import Feather from 'react-native-vector-icons/Feather';
import AlertComponent from '../../CustomComponents/AlertComponent';
import {useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {changeLanguage} from '../../../ReduxToolKit/Slices/UserSetting';
import {useEffect} from 'react';
import {doc, updateDoc} from 'firebase/firestore';
import {db, storage} from '../../../Firebase/Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCallback} from 'react';
import {useRef} from 'react';
import {getDownloadURL, ref, uploadString} from 'firebase/storage';
import {useNetInfo} from '@react-native-community/netinfo';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
const LIST_LANGUAGE = [
  {
    flagSource: require('../../Assets/Images/CoutriesFlag/vietnam.png'),
    nameVN: 'Tiếng Việt',
    nameEN: 'Vietnamese',
  },
  {
    flagSource: require('../../Assets/Images/CoutriesFlag/united-states-of-america.png'),
    nameVN: 'Tiếng Anh',
    nameEN: 'English',
  },
];
const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const Setting = ({navigation}) => {
  const curSetting = useSelector(state => state.UserSetting);
  const language = useMemo(
    () =>
      curSetting.language === 'English'
        ? EN_LANGUAGE.setting
        : VN_LANGUAGE.setting,
    [curSetting.language],
  );
  const uid = useSelector(state => state.UserSetting).id;
  const dispath = useDispatch();
  const [openNotification, setOpenNotification] = useState(
    curSetting.isNotification,
  );

  const [openTouch, setOpenTouch] = useState(curSetting.isTouch);
  const [openChangeModal, setOpenChangeModal] = useState(false);
  const [languageType, setLanguageType] = useState(curSetting.language);
  const [countryCurrency, setCountryCurrency] = useState(curSetting.currency);
  const [password, setPassword] = useState('');
  const [curState, setCurState] = useState();
  const [userName, setUserName] = useState(curSetting.userName);
  const email = useRef(curSetting.email).current;
  const netifo = useNetInfo();
  const [openAlert, setOpenAlert] = useState(false);
  const [typeModal, setTypeModal] = useState(null);
  useEffect(() => {
    setCurState({
      language: languageType,
      currency: countryCurrency,
      isNotification: openNotification,
      isTouch: openTouch,
      userName: userName,
      imagePicker: imagePicker,
    });
  }, []);
  const [imagePicker, setImagePicker] = useState({
    base64: curSetting.userImage
      ? curSetting.userImage
      : 'https://scontent.fsgn5-9.fna.fbcdn.net/v/t39.30808-6/279234842_1903916156663973_2273575611237880874_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=174925&_nc_ohc=ynlz0s3MAYEAX-4ujr-&_nc_ht=scontent.fsgn5-9.fna&oh=00_AfDl12aEA-JbAPRV6U3LFE67Dcb1g5XqGJEreXVsdw25tQ&oe=6445892F',
    type: '',
  });
  const openCameraPicker = useCallback(() => {
    ImageCropPicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
      useFrontCamera: true,
      mediaType: 'photo',
      freeStyleCropEnabled: true,
    })
      .then(image => {
        setImagePicker({
          base64: image.data,
          type: image.mime,
        });
      })
      .catch(e => console.log(e));
  }, []);
  const openLibrary = useCallback(() => {
    ImageCropPicker.openPicker({
      includeBase64: true,
      mediaType: 'photo',
    })
      .then(imageArray => {
        setImagePicker({
          base64: imageArray.data,
          type: imageArray.mime,
        });
      })
      .finally(() => setOpenCamera(!openCamera));
  }, []);
  const checkChangeInfor = useCallback(() => {
    setOpenAlert(!openAlert);
    setOpenChangeModal(!openChangeModal);
    setTypeModal(null);
    let name = userName;
    setUserName(name.replace(/\s/g, ''));
  }, [userName, openChangeModal]);
  const modal_2_Press = useCallback(() => {
    setOpenChangeModal(!openChangeModal);
    setTypeModal(null);
    dispath(changeLanguage(languageType));
  }, [typeModal, languageType]);
  const modal_4_Press = async () => {
    if (password !== '' && password !== curSetting.password) {
      ToastAndroid.show('Password incorrect!!!', ToastAndroid.LONG);
    }
    if (password !== '' && password === curSetting.password) {
      if (openTouch === true) await AsyncStorage.clear();
      else
        try {
          await AsyncStorage.setItem('UserID', uid);
        } catch (error) {
          console.log(error);
        }
      setOpenTouch(!openTouch);
      setOpenChangeModal(!openChangeModal);
      setPassword('');
    }
  };
  const [alertSave, setAlertSave] = useState(false);
  const outSidePress = () => {
    setOpenChangeModal(!openChangeModal);
    if (typeModal === 1) {
      setUserName(curState.userName);
    }
    if (typeModal === 2) {
      setLanguageType(curSetting.language);
    }
    if (typeModal === 3) {
      setCountryCurrency(curSetting.currency);
    }
    if (typeModal === 4) {
      setPassword('');
    }
  };
  const [openCamera, setOpenCamera] = useState(false);
  return (
    <View style={styles.container}>
      <HeaderDrawer
        title={language.header}
        onPressLeft={async () => {
          if (netifo.isConnected) {
            if (
              curState.language !== languageType ||
              curState.currency !== countryCurrency ||
              curState.isNotification !== openNotification ||
              curState.isTouch !== openTouch ||
              curState.imagePicker !== imagePicker
            ) {
              setAlertSave(!alertSave);
              if (curSetting.language !== language) {
                await AsyncStorage.setItem('Language', languageType);
              }
            } else {
              navigation.openDrawer();
            }
          } else {
            ToastAndroid.show(
              curSetting.language === 'English'
                ? 'Your internet is occuring a problem'
                : 'Mất kết nối internet',
              ToastAndroid.LONG,
            );
            navigation.openDrawer();
          }
        }}
      />

      <Modal
        visible={openCamera}
        onRequestClose={() => setOpenCamera(!openCamera)}
        transparent
        statusBarTranslucent>
        <View style={styles.overviewCamera}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setOpenCamera(!openCamera)}
          />
          <View style={styles.pressContainer}>
            <Pressable onPress={openCameraPicker} style={styles.pressable}>
              <Text style={styles.cameraTxt}>{language.newPhoto}</Text>
            </Pressable>
            <Pressable onPress={openLibrary} style={styles.pressable}>
              <Text style={styles.cameraTxt}>{language.library}</Text>
            </Pressable>
            <Pressable
              onPress={() => setOpenCamera(!openCamera)}
              style={styles.pressable}>
              <Text
                style={[
                  styles.cameraTxt,
                  {
                    color: ColorCustom.red,
                  },
                ]}>
                {language.cancel}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View
        style={{
          marginHorizontal: 15,
        }}>
        {/*Profile */}
        <AlertComponent
          open={openAlert}
          setOpen={setOpenAlert}
          title={'SUCCESS'}
          subtitle={'Your information has been changed'}
          type={'SUCCESS'}
          buttonList={[
            {
              txt: 'Done',
              onPress: async () => {
                setOpenAlert(!openAlert);
              },
            },
          ]}
        />
        {/*Alert Save */}
        <AlertComponent
          open={alertSave}
          setOpen={setAlertSave}
          title={'ALERT'}
          subtitle={'Do you want to store your change?'}
          type={'ALERT'}
          buttonList={[
            {
              txt: 'No',
              onPress: () => {
                navigation.openDrawer();
                setAlertSave(!alertSave);
              },
            },
            {
              txt: 'Yes',
              onPress: async () => {
                if (imagePicker.type !== '') {
                  const imageRef = ref(storage, `ImageUser/${uid}/userImage`);
                  if (typeof global.atob === 'undefined') {
                    global.atob = a =>
                      Buffer.from(a, 'base64').toString('binary');
                  }
                  const Blob = global.Blob;
                  delete global.Blob; // Blob must be undefined (setting it to null won't work)
                  await uploadString(imageRef, imagePicker.base64, 'base64', {
                    contentType: imagePicker.type,
                  })
                    .then(() => {
                      getDownloadURL(imageRef).then(async url => {
                        await updateDoc(doc(db, 'USER', uid), {
                          currency: countryCurrency,
                          isNotification: openNotification,
                          isTouch: openTouch,
                          language: languageType,
                          userName: userName,
                          userImage: url,
                        }).finally(() => {
                          setAlertSave(!alertSave);
                          setOpenAlert(!openAlert);
                        });
                      });
                    })
                    .then(() => (global.Blob = Blob));
                } else {
                  await updateDoc(doc(db, 'USER', uid), {
                    currency: countryCurrency,
                    isNotification: openNotification,
                    isTouch: openTouch,
                    language: languageType,
                    userName: userName,
                  }).finally(() => {
                    setAlertSave(!alertSave);
                    setOpenAlert(!openAlert);
                  });
                }
                setCurState({
                  language: languageType,
                  currency: countryCurrency,
                  isNotification: openNotification,
                  isTouch: openTouch,
                  userName: userName,
                  imagePicker: imagePicker,
                });
              },
            },
          ]}
        />
        <Modal
          visible={openChangeModal}
          onRequestClose={() => setOpenChangeModal(!openChangeModal)}
          transparent
          statusBarTranslucent>
          <View
            style={{
              flex: 1,
            }}>
            <Pressable
              onPress={outSidePress}
              style={{
                flex: 1,
                backgroundColor: 'rgba(217,217,217,0.5)',
              }}
            />
            {typeModal === 1 && (
              <View style={styles.modal_1}>
                <View style={styles.modal_1_container}>
                  <Feather
                    name="x"
                    size={30}
                    color={ColorCustom.red}
                    onPress={() => {
                      setOpenChangeModal(!openChangeModal);
                      setUserName('');
                    }}
                  />
                  <Text style={styles.modal_1_txt}>
                    {language.modal_1.title}
                  </Text>

                  <Pressable hitSlop={10} onPress={checkChangeInfor}>
                    <Feather name="check" size={30} color={ColorCustom.green} />
                  </Pressable>
                </View>
                <View style={styles.modal_1_header}>
                  <Ionicons
                    name="person"
                    size={25}
                    color={ColorCustom.black}
                    style={{marginHorizontal: 10, marginBottom: 15}}
                  />
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <Text
                      style={[
                        styles.modal_1_txt,
                        {
                          fontSize: FONT_SIZE.TXT_SMALLER_SIZE,
                        },
                      ]}>
                      {language.modal_1.titleInput}
                    </Text>
                    <TextInput
                      defaultValue={userName}
                      onChangeText={setUserName}
                      placeholder={language.modal_1.titleInput}
                      autoCapitalize="words"
                      placeholderTextColor={ColorCustom.gray}
                      autoComplete="name"
                      style={[styles.modal_1_txt, styles.modal_1_txtInput]}
                    />
                  </View>
                </View>
              </View>
            )}
            {typeModal === 2 && (
              <View style={styles.modal_2}>
                <View style={styles.modal_1_container}>
                  <Feather
                    name="x"
                    size={30}
                    color={ColorCustom.red}
                    onPress={() => {
                      setOpenChangeModal(!openChangeModal);
                      setLanguageType(curSetting.language);
                    }}
                  />
                  <Text style={styles.modal_1_txt}>
                    {language.modal_1.title}
                  </Text>

                  <Pressable hitSlop={10} onPress={modal_2_Press}>
                    <Feather name="check" size={30} color={ColorCustom.green} />
                  </Pressable>
                </View>
                <ScrollView>
                  {LIST_LANGUAGE.map((item, index) => {
                    return (
                      <Pressable
                        onPress={() => setLanguageType(item.nameEN)}
                        key={index}
                        style={[
                          styles.modal_1_container,
                          {
                            paddingVertical: 10,
                          },
                        ]}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Image
                            source={item.flagSource}
                            style={styles.modal_2_Image}
                          />
                          <Text
                            style={[
                              styles.modal_1_txt,
                              {
                                fontSize: FONT_SIZE.TXT_SIZE,
                              },
                            ]}>
                            {item.nameEN}
                          </Text>
                        </View>
                        {languageType === item.nameEN && (
                          <Ionicons
                            name="checkmark-circle"
                            size={25}
                            color={ColorCustom.green}
                          />
                        )}
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            )}
            {typeModal === 4 && (
              <View style={styles.modal_4}>
                <View style={styles.modal_1_container}>
                  <Feather
                    name="x"
                    size={30}
                    color={ColorCustom.red}
                    onPress={() => {
                      setOpenChangeModal(!openChangeModal);
                      setOpenTouch(false);
                      setPassword('');
                    }}
                  />
                  <Text style={styles.modal_1_txt}>
                    {language.modal_4.title}
                  </Text>

                  <Pressable hitSlop={10} onPress={modal_4_Press}>
                    <Feather name="check" size={30} color={ColorCustom.green} />
                  </Pressable>
                </View>
                <View style={styles.modal_1_header}>
                  <Feather
                    name="lock"
                    size={25}
                    color={ColorCustom.black}
                    style={{marginHorizontal: 10, marginBottom: 15}}
                  />
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <Text
                      style={[
                        styles.modal_1_txt,
                        {
                          fontSize: FONT_SIZE.TXT_SMALLER_SIZE,
                        },
                      ]}>
                      {language.modal_4.titleInput}
                    </Text>
                    <TextInput
                      defaultValue={password}
                      onChangeText={setPassword}
                      placeholder={language.modal_4.titleInput}
                      autoComplete="password"
                      placeholderTextColor={ColorCustom.gray}
                      style={[styles.modal_1_txt, styles.modal_1_txtInput]}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        </Modal>
        <View style={styles.profile}>
          <Pressable
            hitSlop={10}
            onPress={() => {
              setOpenChangeModal(!openChangeModal);
              setTypeModal(1);
            }}
            style={styles.icon}>
            <FontAwesome name="edit" size={25} color={'#7A7A7A'} />
          </Pressable>
          {/*Image */}
          <View>
            <Image
              source={{
                uri:
                  imagePicker.type === ''
                    ? imagePicker.base64
                    : `data:${imagePicker.type};base64,${imagePicker.base64}`,
              }}
              resizeMode="contain"
              style={{
                width: 120,
                height: 120,
                borderRadius: 100,
              }}
            />
            <Pressable
              onPress={() => setOpenCamera(!openCamera)}
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
              }}>
              <FontAwesome name="camera" size={25} color={'#7A7A7A'} />
            </Pressable>
          </View>
          <Text style={styles.txt}>{userName}</Text>
          <Text style={styles.subTxt}>{email}</Text>
        </View>

        {/*Features */}
        <Pressable
          onPress={() => {
            setOpenChangeModal(!openChangeModal);
            setTypeModal(2);
          }}
          style={styles.btn}>
          <Ionicons name="ios-language" size={25} color={'#7A7A7A'} />
          <Text style={styles.txtBtn}>{language.language}</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            Linking.openSettings();
          }}
          style={[
            styles.btn,
            {
              paddingVertical: 10,
            },
          ]}>
          <Ionicons name="notifications" size={25} color={'#7A7A7A'} />
          <Text style={styles.txtBtn}>{language.notification}</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setOpenChangeModal(!openChangeModal);
            setTypeModal(4);
          }}
          style={[
            styles.btn,
            {
              paddingVertical: 10,
            },
          ]}>
          <Ionicons name="finger-print-sharp" size={25} color={'#7A7A7A'} />
          <Text style={styles.txtBtn}>{language.signInTouch}</Text>
          <View
            style={{
              position: 'absolute',
              right: 0,
            }}>
            <SwitchComponent
              turnOn={openTouch}
              isEnglish={curSetting.language === 'English' ? true : false}
            />
          </View>
        </Pressable>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          alignSelf: 'center',
        }}>
        {netifo.isConnected === true && (
          <BannerAd
            unitId={adUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profile: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: ColorCustom.green,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 17,
    marginVertical: 15,
  },
  icon: {position: 'absolute', right: 10, top: 10},
  image: {width: 120, height: 120, borderRadius: 100},
  txt: {
    fontFamily: FONT_FAMILY.Medium,
    fontSize: FONT_SIZE.TXT_LARGE_SIZE,
    color: ColorCustom.green,
    textAlign: 'center',
    marginTop: 10,
  },
  txtBtn: {
    color: ColorCustom.black,
    fontFamily: FONT_FAMILY.Regular,
    fontSize: FONT_SIZE.TXT_SIZE,
    marginLeft: 20,
  },
  btn: {flexDirection: 'row', alignItems: 'center', marginVertical: 5},
  subTxt: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: FONT_SIZE.TXT_SMALL_SIZE,
    color: ColorCustom.green,
    textAlign: 'center',
  },
  modal_1: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 10,
    position: 'absolute',
    width: '90%',
    top: 100,
    alignSelf: 'center',
  },
  modal_1_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modal_1_txt: {
    fontSize: FONT_SIZE.TXT_LARGE_SIZE,
    fontFamily: FONT_FAMILY.Regular,
    color: ColorCustom.black,
  },
  modal_1_txtInput: {
    fontSize: FONT_SIZE.TXT_SIZE,
    borderBottomWidth: 1,
    borderBottomColor: ColorCustom.gray,
  },
  modal_1_header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  modal_2: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 10,
    flex: 1,
  },
  modal_2_Image: {
    width: 54,
    height: 36,
    resizeMode: 'contain',
  },
  modal_3_txt: {
    fontSize: FONT_SIZE.TXT_SIZE,
    fontFamily: FONT_FAMILY.Medium,
    color: ColorCustom.black,
  },
  modal_4: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 10,
    position: 'absolute',
    width: '90%',
    top: 100,
    alignSelf: 'center',
  },
  overviewCamera: {
    flex: 1,
    backgroundColor: 'rgba(217,217,217,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressContainer: {
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
  cameraTxt: {
    color: ColorCustom.black,
    fontSize: FONT_SIZE.TXT_SIZE,
    fontFamily: FONT_FAMILY.Regular,
  },
});
export default Setting;
