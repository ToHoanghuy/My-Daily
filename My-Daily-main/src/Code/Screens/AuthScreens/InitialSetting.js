import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  StatusBar,
  Pressable,
  StyleSheet,
  TextInput,
  ToastAndroid,
} from 'react-native';
import {FONT_SIZE, FONT_FAMILY} from '../../Assets/Constants/FontCustom';
import React, {useState, useReducer, useMemo} from 'react';
import ColorCustom from '../../Assets/Constants/ColorCustom';
import Feather from 'react-native-vector-icons/Feather';
import {EN_LANGUAGE} from '../../Assets/Data/Language';
import DropdownImageComponent from '../../CustomComponents/DropdownImageComponent';
import ButtonSvg from '../../CustomComponents/ButtonSvg';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {addWallet} from '../../../ReduxToolKit/Slices/WalletSlice';
import AlertComponent from '../../CustomComponents/AlertComponent';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {onAddWallet} from '../../Assets/FunctionCompute/AddData';
import {VN_LANGUAGE} from '../../Assets/Data/Language';
const {width: WIDTH, height: HEIGHT} = Dimensions.get('screen');
const reducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_NAME':
      return state.map((input, index) => {
        if (action.payload.index === index) {
          return {...input, name: action.payload.value};
        } else return input;
      });
    case 'INPUT_BALANCE':
      return state.map((input, index) => {
        if (action.payload.index === index) {
          return {...input, balance: +action.payload.value};
        } else return input;
      });
    case 'ADD_ITEM':
      if (
        state[state.length - 1].name === '' ||
        state[state.length - 1].balance === 0
      ) {
        ToastAndroid.showWithGravity(
          action.language.error,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
        return [...state];
      }
      const newCatergory = {
        name: '',
        balance: 0,
        openDropDown: false,
        currency: {
          flagSource: '',
          vnName: 'Đồng đô la Mỹ',
          enName: 'United States Dollar',
          currencyCode: 'USD',
        },
      };
      return [...state, newCatergory];
    case 'DELETE_ITEM':
      return state.filter((_, index) => index !== action.payload.index);
    case 'OPEN_DROPDOWN':
      state[action.payload].openDropDown = !state[action.payload].openDropDown;
      return [...state];
    case 'ADD_CURRENCY':
      state[action.index].currency = action.currency;
      return [...state];
    default:
      break;
  }
};
const InitialSetting = ({navigation}) => {
  const uid = useSelector(state => state.UserSetting).id;
  const [state, dispatchReducer] = useReducer(reducer, [
    {
      name: '',
      balance: 0,
      openDropDown: false,
      currency: {
        flagSource: '',
        vnName: 'Đồng đô la Mỹ',
        enName: 'United States Dollar',
        currencyCode: 'USD',
      },
    },
  ]);
  const dispatch = useDispatch();
  const User = useSelector(state => state.UserSetting);
  const languageSetting = useMemo(
    () => (User.language === 'English' ? EN_LANGUAGE : VN_LANGUAGE),
    [User.language],
  );
  const {initialScreen: language} = languageSetting;
  const [openAlert, setOpenAlert] = useState(false);
  const onDone = async () => {
    if (state.length === 1) {
      if (state[0].name === '' || state[0].ballance === 0) {
        ToastAndroid.showWithGravity(
          language.noWallet,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
        return;
      }
    }
    const copyWallet = new Set(state.map(w => w.name));
    if (copyWallet.size !== state.length) {
      ToastAndroid.showWithGravity(
        language.duplicateWallet,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      return;
    }
    state.map(wallet => {
      if (wallet.name !== '') {
        dispatch(
          addWallet({
            name: wallet.name,
            value: +wallet.balance,
            currency: wallet.currency.currencyCode,
          }),
        );
        onAddWallet(
          uid,
          wallet.name,
          wallet.balance,
          wallet.currency.currencyCode,
        );
      }
    });
    setOpenAlert(true);
  };
  return (
    <KeyboardAvoidingView style={styles.view}>
      <ScrollView nestedScrollEnabled>
        <View style={styles.header}>
          <View style={styles.ellipse} />
          <View style={{marginLeft: 10}}>
            {/* <Pressable onPress={() => navigation.goBack()} hitSlop={20}>
              <Feather
                name="arrow-left-circle"
                size={40}
                color={ColorCustom.white}
              />
            </Pressable> */}
            <View style={styles.title_header}>
              <FontAwesome name={'cogs'} size={30} color={ColorCustom.white} />
              <Text
                style={styles.header_txt}
                adjustsFontSizeToFit
                numberOfLines={1}>
                {language.header}
              </Text>
            </View>
          </View>
        </View>
        {/* Wallet Screen */}
        <View style={[styles.screen_horizontal, {marginTop: 10}]}>
          {state.map((input, index) => {
            return (
              <View key={index} style={styles.wallet_container}>
                <View style={styles.wallet_header}>
                  <Text
                    style={[styles.text, {width: '90%', textAlign: 'center'}]}>
                    {`${language.txtWallet} ${index + 1}`}
                  </Text>
                  {index !== 0 && (
                    <Feather
                      name="x"
                      size={25}
                      color={ColorCustom.red}
                      onPress={() =>
                        dispatchReducer({
                          type: 'DELETE_ITEM',
                          payload: {index},
                        })
                      }
                    />
                  )}
                </View>

                <TextInput
                  style={styles.textInput}
                  defaultValue={input.name}
                  fontFamily={FONT_FAMILY.Medium}
                  onChangeText={value =>
                    dispatchReducer({
                      type: 'INPUT_NAME',
                      payload: {index, value},
                    })
                  }
                  placeholder={language.nameOfWallet}
                  placeholderTextColor={ColorCustom.gray}
                />
                <TextInput
                  style={[styles.textInput, {marginVertical: 20}]}
                  fontFamily={FONT_FAMILY.Medium}
                  defaultValue={input.balance}
                  onChangeText={value =>
                    dispatchReducer({
                      type: 'INPUT_BALANCE',
                      payload: {index, value},
                    })
                  }
                  keyboardType={'numeric'}
                  placeholder={language.ballance}
                  placeholderTextColor={ColorCustom.gray}
                />
                <View
                  style={{
                    marginTop: 5,
                    paddingBottom: input.openDropDown ? 160 : 0,
                    marginHorizontal: 10,
                  }}>
                  <DropdownImageComponent
                    width={WIDTH - 100}
                    height={50}
                    typeMoney={input.currency}
                    setTypeMoney={country =>
                      dispatchReducer({
                        type: 'ADD_CURRENCY',
                        index,
                        currency: country,
                      })
                    }
                    open={input.openDropDown}
                    setOpen={() =>
                      dispatchReducer({type: 'OPEN_DROPDOWN', payload: index})
                    }
                    placeHolder={'United States Dollar'}
                  />
                </View>
              </View>
            );
          })}
          <View style={[styles.btn_container, {zIndex: 1}]}>
            <Pressable
              style={styles.pressable}
              onPress={() => dispatchReducer({type: 'ADD_ITEM', language})}
              hitSlop={30}>
              <AntDesign
                name="pluscircle"
                size={40}
                color={ColorCustom.green}
              />
            </Pressable>
            <Text
              style={[styles.text, {color: ColorCustom.gray, fontSize: 15}]}>
              {language.addWallet}
            </Text>
          </View>
          <View style={{alignSelf: 'center'}}>
            <ButtonSvg
              height={HEIGHT * 0.06}
              width={WIDTH * 0.7}
              title={language.btnDone}
              onPress={onDone}
            />
          </View>
        </View>
      </ScrollView>
      <AlertComponent
        title={'SUCCESS'}
        open={openAlert}
        setOpen={setOpenAlert}
        type={'SUCCESS'}
        subtitle={language.settingSuccess}
        disableBackDrop={true}
        buttonList={[
          {
            txt: 'OK',
            onPress: () => {
              setOpenAlert(false);
              navigation.navigate('OverViewScreen');
            },
          },
        ]}
      />
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: ColorCustom.white,
  },
  text: {
    color: ColorCustom.black,
    fontSize: FONT_SIZE.TXT_SIZE,
    fontFamily: FONT_FAMILY.Medium,
    marginBottom: 5,
  },
  header_txt: {
    color: ColorCustom.white,
    fontSize: 20,
    fontFamily: FONT_FAMILY.Medium,
    marginLeft: 10,
    width: '55%',
  },
  ellipse: {
    position: 'absolute',
    bottom: 0,
    width: WIDTH,
    height: WIDTH,
    borderRadius: WIDTH,
    backgroundColor: ColorCustom.green,
    transform: [{translateX: -WIDTH * 0.4}, {scaleX: 1.25}],
  },
  header: {
    width: WIDTH,
    height: WIDTH * 0.55,
    paddingTop: StatusBar.currentHeight - 10,
  },
  title_header: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  screen_horizontal: {
    width: WIDTH,
    marginTop: 30,
    paddingHorizontal: 30,
  },
  textInput: {
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: ColorCustom.gray,
    paddingHorizontal: 10,
    color: ColorCustom.black,
    width: '95%',
    alignSelf: 'center',
  },
  pressable: {
    marginTop: 20,
    marginBottom: 10,
  },
  wallet_container: {
    width: '100%',
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
    borderStyle: 'dashed',
    borderRadius: 10,
    borderColor: ColorCustom.green,
    alignItems: 'flex-end',
  },
  wallet_header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 10,
  },
  btn_container: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
});
export default InitialSetting;
