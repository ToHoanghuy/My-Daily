import React, {useMemo} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Text,
  KeyboardAvoidingView,
  StatusBar,
  Image,
  ToastAndroid,
  ActivityIndicator,
  Button,
} from 'react-native';
import {Pressable} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FONT_FAMILY, FONT_SIZE} from '../../../Assets/Constants/FontCustom';
import ColorCustom from '../../../Assets/Constants/ColorCustom';
import {TextInput} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {EN_LANGUAGE, VN_LANGUAGE} from '../../../Assets/Data/Language';
import {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import CurrencyDropDown from '../../../CustomComponents/CurrencyDropDown';
import CaculatorComponent from '../../../CustomComponents/CaculatorComponent';
import DropDownSuggestion from '../../../CustomComponents/DropDownSuggestion';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ModalWallet from './ModalWallet';
import {addNotificationToRedux} from '../../../../ReduxToolKit/Slices/NotificationSlice';
import {addNotification} from '../Notification/NotificationFunction';
import {SUGGEST_IN, SUGGEST_OUT} from '../../../Assets/Data/Suggestion';
import Calendar from '../../../CustomComponents/CalendarComponent/Calendar';
import dayjs from 'dayjs';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import NewCategory from './NewCategory';
import DropDownPlan from './DropDownPlan';
import {onAddStatistic_Detail} from '../../../Assets/FunctionCompute/AddData';
import Camera from './Camera';
import Feather from 'react-native-vector-icons/Feather';
import AlertComponent from '../../../CustomComponents/AlertComponent';
import {
  ConvertMoney,
  ConvertRate,
} from '../../../CustomComponents/ConvertMoney';
import {storage} from '../../../../Firebase/Firebase';
import {getDownloadURL, uploadString, ref} from 'firebase/storage';
import {uuidv4} from '@firebase/util';
import {addWallet} from '../../../../ReduxToolKit/Slices/WalletSlice';
import {updateCurrent} from '../../../../ReduxToolKit/Slices/Plan_Data';
import {updateCurrentPlan} from '../../../Assets/FunctionCompute/UpdateData';
import {addWalletValue} from '../../../../ReduxToolKit/Slices/WalletSlice';
import {
  changeStatistic,
  updateDataMonth,
} from '../../../../ReduxToolKit/Slices/StatisticSlice';
import {insertDataExchange} from '../../../../ReduxToolKit/Slices/ExchangeRecentSlice';
import {addTransaction} from '../../../../ReduxToolKit/Slices/TransactionsSlice';
import {memo} from 'react';
import {Timestamp} from 'firebase/firestore';
import {useNetInfo} from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width: WIDTH_SCREEN} = Dimensions.get('screen');

const ListCurrency = ['VND', 'USD', 'EUR', 'CNY', 'CAD', 'RUD', 'JPY'];
const InsertOutcome = ({navigation}) => {
  const userSetting = useSelector(state => state.UserSetting.language);
  const netInfo = useNetInfo();
  const languageSetting = useMemo(
    () => (userSetting === 'English' ? EN_LANGUAGE : VN_LANGUAGE),
    [userSetting],
  );
  const WALLET = useSelector(state => state.Wallet);
  const PLAN = useSelector(state => state.PlanData)?.filter(
    plan => !plan.isIncomePlan && plan.current < plan.budget,
  );
  const uid = useSelector(state => state.UserSetting).id;
  const dispatch = useDispatch();
  const PLAN_INCOME = useSelector(state => state.PlanData).filter(
    plan => plan.isIncomePlan && plan.current < plan.budget,
  );
  const STATISTIC_MONTH = useSelector(state => state.Statistics).month;
  const {insertOutcome: language} = languageSetting;
  const {notification} = languageSetting;
  const [ListPlan, setListPlan] = useState([]);
  const [IsIncome, setIsIncome] = useState(false);
  const [value, setValue] = useState('');
  const [time, setTime] = useState(new Date());
  const [note, setNote] = useState('');
  const [focusInput, setFocusInput] = useState(null);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [currency, setCurrency] = useState(WALLET[0].currency);
  const [openCalculator, setOpenCalculator] = useState(false);
  const [openWallet, setOpenWallet] = useState(false);
  const [wallet, setWallet] = useState(WALLET[0]);
  const [openSuggest, setOpenSuggest] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openPlan, setOpenPlan] = useState(false);
  const [selectPlan, setSelectPlan] = useState([]);
  const [openCamera, setOpenCamera] = useState(false);
  const [imagePicker, setImagePicker] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notConvertMoney, setNotConvertMoney] = useState(false);
  const [tmp_Val, setTmp_Val] = useState(-1);
  const [errPlan, setErrPlan] = useState(false);
  useEffect(() => {
    const asyncDB = async () => {
      let listInsert = JSON.parse(
        await AsyncStorage.getItem('insertNotInternet'),
      );
      if (netInfo.isConnected && listInsert) {
        listInsert.map(async (insert, index) => {
          if (insert.imagePicker.length !== 0) {
            let tmpURL = [];
            await new Promise(resolve => {
              insert.imagePicker.forEach(async (image, index) => {
                const storageRef = ref(
                  storage,
                  `InOutImage/${insert.uid}/${id}/${image.imageID}`,
                );
                if (typeof global.atob === 'undefined') {
                  global.atob = value =>
                    Buffer.from(value, 'base64').toString();
                }
                const Blob = global.Blob;
                delete global.Blob;
                await uploadString(storageRef, image.base64, 'base64', {
                  contentType: image.type,
                })
                  .then(() => {
                    getDownloadURL(storageRef).then(url => {
                      tmpURL.push({url: url, imageID: image.imageID});
                      if (index === insert.imagePicker.length - 1) {
                        resolve(tmpURL);
                      }
                    });
                  })
                  .then(() => (global.Blob = Blob));
              });
            }).then(imageURL => {
              onAddStatistic_Detail(
                insert.uid,
                insert.category.name,
                Number(insert.value),
                insert.IsIncome,
                new Date(insert.time),
                insert.category.icon_name,
                insert.category.color,
                insert.note,
                insert.wallet,
                imageURL,
                insert.id,
                [],
              );
            });
          } else {
            onAddStatistic_Detail(
              insert.uid,
              insert.category.name,
              insert.value,
              insert.IsIncome,
              new Date(insert.time),
              insert.category.icon_name,
              insert.category.color,
              insert.note,
              insert.wallet,
              [],
              insert.id,
              [],
            );
          }
        });

        AsyncStorage.removeItem('insertNotInternet');
      }
    };
    asyncDB();
  }, [netInfo.isConnected]);
  const inputColor = useMemo(
    () => (IsIncome === false ? ColorCustom.orange : ColorCustom.blue),
    [IsIncome],
  );
  const [category, setCategory] = useState({
    name: '',
    color: ColorCustom.gray,
    icon_name: 'cutlery',
  });
  const scrollX = useSharedValue(0);
  const translateXAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: scrollX.value}],
    };
  });
  useEffect(() => {
    if (openPlan && selectPlan.length === 0) {
      if (IsIncome) {
        setListPlan([...PLAN_INCOME]);
      } else setListPlan([...PLAN]);
    }
  }, [openPlan]);
  const onFinalCheck = () => {
    let sumSize = 0;
    let convertValue = value !== '' ? value.replaceAll(/[.-]/g, '') : 0;
    imagePicker.forEach(image => {
      sumSize += image.size;
    });
    if (sumSize > 300000) {
      ToastAndroid.showWithGravity(
        language.exceedImage,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      return;
    } else if (+convertValue <= 0) {
      ToastAndroid.show(
        userSetting === 'English'
          ? 'The amount of money must be greather than 0'
          : 'Số tiền phải lớn hơn 0',
        ToastAndroid.SHORT,
      );
      return;
    } else if (category.name === '') {
      setFocusInput(1);
      ToastAndroid.showWithGravity(
        language.error,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      return;
    } else {
      setLoading(true);
      ConvertMoney(currency, wallet.currency, convertValue)
        .then(result => {
          if (isNaN(result)) {
            setNotConvertMoney(true);
            return;
          } else {
            if (result >= wallet.value && !IsIncome) {
              setOpenAlert(true);
              setTmp_Val(wallet.value);
              return;
            } else {
              onFinish(Math.round(result * 100) / 100);
            }
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const onFinish = async value => {
    setLoading(true);
    const id = uuidv4();
    let tmpPlan = [];
    if (!errPlan) {
      if (selectPlan.length !== 0) {
        tmpPlan = selectPlan;
      } else {
        if (IsIncome) {
          if (PLAN_INCOME)
            tmpPlan = PLAN_INCOME.filter(
              p =>
                new Date(p.dateStart).getTime() < new Date(time).getTime() &&
                new Date(p.dateFinish).getTime() > new Date(time).getTime() &&
                new Date(p.dateFinish).toDateString() ===
                  new Date(p.dateFinish).toDateString(),
            );
        } else {
          if (PLAN)
            tmpPlan = PLAN.filter(
              p =>
                new Date(p.dateStart).getTime() < new Date(time).getTime() &&
                new Date(p.dateFinish).getTime() > new Date(time).getTime() &&
                new Date(p.dateFinish).toDateString() ===
                  new Date(p.dateFinish).toDateString(),
            );
        }
      }
    } else {
      tmpPlan = IsIncome
        ? PLAN_INCOME.filter(p => p.currency === WALLET[0].currency)
        : PLAN.filter(p => p.currency === WALLET[0].currency);
    }

    let tmpCurrency = [
      ...new Set(tmpPlan.map(p => p.currency).filter(p => p !== currency)),
    ];
    let tmpMoney = [];
    new Promise(resolve => {
      if (netInfo.isConnected !== true) resolve([]);
      if (tmpPlan.length === 0) resolve([]);
      ConvertRate(tmpCurrency, currency).then(result => {
        if (result === undefined) {
          resolve(undefined);
        }
        tmpPlan.forEach((item, i) => {
          if (result?.hasOwnProperty(item.currency)) {
            tmpMoney.push(
              Math.round(value * 1000 * result[item.currency] * 100) / 100,
            );
          } else tmpMoney.push(value);
          if (tmpMoney.length === tmpPlan.length) {
            resolve(tmpMoney);
          }
        });
      });
    })
      .then(async values => {
        let PlanToDB = tmpPlan.map(tmp => tmp.planId);
        if (isNaN(value) || values === undefined) {
          setErrPlan(true);
          setNotConvertMoney(true);
          setLoading(false);
          return;
        }
        if (netInfo.isConnected === true) {
          if (values.length !== 0) {
            tmpPlan.forEach((p, index) => {
              updateCurrentPlan(uid, p.planId, 0, +values[index]);
              dispatch(
                updateCurrent({id: p.planId, old: 0, new: +values[index]}),
              );
              const currentValue = p.current + Number(values[index]);
              if (p.budget < currentValue) {
                let NotifyID = uuidv4();
                const title = IsIncome
                  ? `${notification.txtIncome}: ${p.planName}`
                  : `${notification.txtOutcome}: ${p.planName}`;
                const subTitle = `${notification.subTitle} ${
                  currentValue - p.budget
                } ${p.currency}`;
                addNotification(
                  uid,
                  'PlanNotification',
                  'Plan Notification',
                  title,
                  subTitle,
                  4,
                  Timestamp.fromDate(new Date()),
                  IsIncome,
                  NotifyID,
                );
                dispatch(
                  addNotificationToRedux({
                    id: NotifyID,
                    value: {
                      date: Timestamp.fromDate(new Date()),
                      title: title,
                      subTitle: subTitle,
                    },
                  }),
                );
              }
            });
          }
          if (imagePicker.length !== 0) {
            let tmpURL = [];
            await new Promise(resolve => {
              imagePicker.forEach(async (image, index) => {
                const storageRef = ref(
                  storage,
                  `InOutImage/${uid}/${id}/${image.imageID}`,
                );
                if (typeof global.atob === 'undefined') {
                  global.atob = value =>
                    Buffer.from(value, 'base64').toString();
                }
                const Blob = global.Blob;
                delete global.Blob;
                await uploadString(storageRef, image.base64, 'base64', {
                  contentType: image.type,
                })
                  .then(() => {
                    getDownloadURL(storageRef).then(url => {
                      tmpURL.push({url: url, imageID: image.imageID});
                      if (index === imagePicker.length - 1) {
                        resolve(tmpURL);
                      }
                    });
                  })
                  .then(() => (global.Blob = Blob));
              });
            }).then(imageURL => {
              onAddStatistic_Detail(
                uid,
                category.name,
                value,
                IsIncome,
                time,
                category.icon_name,
                category.color,
                note,
                wallet,
                imageURL,
                id,
                PlanToDB,
              );
            });
          } else {
            onAddStatistic_Detail(
              uid,
              category.name,
              value,
              IsIncome,
              time,
              category.icon_name,
              category.color,
              note,
              wallet,
              [],
              id,
              PlanToDB,
            );
          }
        }
        let isIncome = IsIncome ? 'Income' : 'Outcome';
        if (!WALLET.some(w => w.name === wallet.name)) {
          dispatch(
            addWallet({
              name: wallet.name,
              value: wallet.value + (IsIncome ? +value : -value),
              currency: wallet.currency,
            }),
          );
        } else {
          dispatch(
            addWalletValue({
              name: wallet.name,
              value: IsIncome ? +value : -value,
            }),
          );
        }
        dispatch(
          updateDataMonth({
            iconName: category.icon_name,
            color: category.color,
            isIncome: isIncome,
            name: category.name,
            value: +value,
            year: time.getFullYear(),
            month: time.getMonth() + 1,
            reset: 1,
          }),
        );
        if (
          STATISTIC_MONTH.year &&
          STATISTIC_MONTH.month &&
          time.getFullYear() == STATISTIC_MONTH.year &&
          time.getMonth() + 1 == STATISTIC_MONTH.month
        ) {
          dispatch(
            insertDataExchange({
              iconName: category.icon_name,
              color: category.color,
              isIncome: isIncome,
              name: category.name,
              value: +value,
            }),
          );
        } else {
          dispatch(
            insertDataExchange({
              iconName: category.icon_name,
              color: category.color,
              isIncome: isIncome,
              name: category.name,
              value: +value,
              reset: 1,
            }),
          );
        }
        dispatch(
          addTransaction({
            wallet: wallet.name,
            date: time.getDate(),
            month: time.getMonth() + 1,
            year: time.getFullYear(),
            isIncome: isIncome,
            value: +value,
          }),
        );
        dispatch(
          changeStatistic({
            wallet: wallet.name,
            date: time.getDate(),
            month: time.getMonth() + 1,
            year: time.getFullYear(),
            isIncome: isIncome,
            value: +value,
            iconName: category.icon_name,
            color: category.color,
            name: category.name,
          }),
        );

        if (!netInfo.isConnected) {
          try {
            const list = await AsyncStorage.getItem('insertNotInternet');
            let listInsert = JSON.parse(list);
            if (listInsert)
              listInsert.push({
                IsIncome: IsIncome,
                uid: uid,
                tmpPlan: [],
                imagePicker: imagePicker,
                category: category,
                value: value,
                time: time,
                note: note,
                wallet: wallet,
                date: new Date(),
                id: id,
              });
            else
              listInsert = [
                {
                  IsIncome: IsIncome,
                  uid: uid,
                  tmpPlan: [],
                  imagePicker: imagePicker,
                  category: category,
                  value: value,
                  time: time,
                  note: note,
                  wallet: wallet,
                  date: new Date(),
                  id: id,
                },
              ];
            AsyncStorage.setItem(
              'insertNotInternet',
              JSON.stringify(listInsert),
            );
          } catch (error) {
            console.log(error);
          }
        }
      })
      .finally(() => {
        onClear();
        setWallet(WALLET[0]);
        setLoading(false);
        ToastAndroid.show(
          userSetting === 'English'
            ? 'Your information has been added'
            : 'Thông tin của bạn đã được thêm vào',
          ToastAndroid.LONG,
        );
      });
  };
  const onRemoveImage = index => {
    const tmp = [...imagePicker];
    tmp.splice(index, 1);
    setImagePicker([...tmp]);
  };
  const onClear = () => {
    setCategory({
      name: '',
      color: ColorCustom.gray,
      icon_name: 'cutlery',
    });
    setValue('');
    setCurrency(WALLET[0].currency);
    setTime(new Date());
    setNote('');
    setImagePicker([]);
    setFocusInput(null);
    setSelectPlan([]);
    setOpenPlan(false);
    setTmp_Val(-1);
    setErrPlan(false);
  };
  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: ColorCustom.white,
      }}>
      <CaculatorComponent
        openModel={openCalculator}
        setOpenModel={setOpenCalculator}
        setResultCompute={setValue}
      />
      <AlertComponent
        title={null}
        open={openAlert}
        setOpen={setOpenAlert}
        type={'ALERT'}
        subtitle={language.notEnoughAmount}
        disableBackDrop={true}
        buttonList={[
          {
            txt: language.btnCancel,
            onPress: () => {
              setOpenAlert(false);
              setTmp_Val(-1);
            },
          },
          {
            txt: language.btnOK,
            onPress: () => {
              onFinish(tmp_Val);
              setOpenAlert(false);
            },
          },
        ]}
      />
      <AlertComponent
        title={null}
        open={notConvertMoney}
        setOpen={setNotConvertMoney}
        type={'FAILED'}
        disableBackDrop={true}
        subtitle={
          userSetting === 'English'
            ? 'Opps! Convert Currency has expired. Please check currency of wallet and plan if they are similar to the currency of category or not! '
            : 'Tính năng đổi tiền đã hết hạn. Vui lòng kiểm tra đơn vị tiền tệ của ví, danh mục và các kế hoạch phải giống nhau!'
        }
        buttonList={[
          {
            txt: 'OK',
            onPress: () => {
              setNotConvertMoney(false);
              setCurrency(WALLET[0].currency);
            },
          },
        ]}
      />
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            width: WIDTH_SCREEN * 2,
            alignItems: 'flex-start',
          },
          translateXAnimatedStyle,
        ]}>
        {/* INPUT */}
        <View style={{flex: 1}}>
          <ScrollView renderToHardwareTextureAndroid scrollEnabled={!openPlan}>
            {/* HEADER */}
            <View style={[styles.header, {marginTop: StatusBar.currentHeight}]}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Pressable
                  hitSlop={20}
                  onPress={() => {
                    onClear();
                    navigation.goBack();
                  }}>
                  <AntDesign
                    name="arrowleft"
                    size={25}
                    color={ColorCustom.black}
                  />
                </Pressable>
                <Text style={styles.text} adjustsFontSizeToFit>
                  {IsIncome === false ? language.header : language.headerIncome}
                </Text>
              </View>
              {loading ? (
                <ActivityIndicator size="large" color={ColorCustom.green} />
              ) : (
                <Pressable onPress={onFinalCheck} hitSlop={20}>
                  <AntDesign name="check" size={30} color={ColorCustom.green} />
                </Pressable>
              )}
            </View>
            <View
              style={[styles.header, {marginTop: 22, marginHorizontal: 50}]}>
              <Pressable
                style={[
                  styles.press,
                  {
                    borderColor:
                      IsIncome === false
                        ? ColorCustom.orange
                        : ColorCustom.middleGrey,
                  },
                ]}
                onPress={() => {
                  setIsIncome(false), onClear();
                }}>
                <Text
                  style={[
                    styles.text_button,
                    {
                      color:
                        IsIncome === false
                          ? ColorCustom.orange
                          : ColorCustom.middleGrey,
                    },
                  ]}>
                  {language.btnOutcome}
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.press,
                  {
                    borderColor:
                      IsIncome === true
                        ? ColorCustom.blue
                        : ColorCustom.middleGrey,
                  },
                ]}
                onPress={() => {
                  setIsIncome(true);
                  onClear();
                }}>
                <Text
                  style={[
                    styles.text_button,
                    {
                      color:
                        IsIncome === true
                          ? ColorCustom.blue
                          : ColorCustom.middleGrey,
                    },
                  ]}>
                  {language.btnIncome}
                </Text>
              </Pressable>
            </View>

            {/* CATEGORY */}
            <View style={styles.styleTextInput}>
              <Text style={styles.style_textinput}>{language.category}</Text>
              <Pressable
                style={[
                  styles.styleTextInput_amount,
                  {
                    borderColor:
                      focusInput === 1 ? inputColor : ColorCustom.middleGrey,
                  },
                ]}
                onPress={() => {
                  setFocusInput(1);
                  setOpenSuggest(true);
                }}>
                <View
                  style={[styles.circle, {backgroundColor: category.color}]}>
                  <FontAwesome
                    name={category.icon_name}
                    color={ColorCustom.white}
                    size={24}
                  />
                </View>
                <Text style={[styles.textinput_amount, {paddingVertical: 12}]}>
                  {userSetting === 'English'
                    ? category.name.EN
                    : category.name.VN}
                </Text>
              </Pressable>
            </View>
            {/* AMOUNT */}
            <View style={styles.styleTextInput}>
              <Text style={styles.style_textinput}>{language.amount}</Text>
              <View
                style={{
                  zIndex: 99,
                  alignItems: 'flex-end',
                }}>
                <View
                  style={[
                    styles.styleTextInput_amount,
                    {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      borderColor:
                        focusInput === 2 ? inputColor : ColorCustom.middleGrey,
                      zIndex: 1,
                    },
                  ]}>
                  <TextInput
                    style={[
                      styles.textinput_amount,
                      {width: '70%', zIndex: 999},
                    ]}
                    onFocus={() => setFocusInput(2)}
                    onBlur={() => setFocusInput(null)}
                    defaultValue={value}
                    onChangeText={setValue}
                    placeholder="0"
                    placeholderTextColor={ColorCustom.middleGrey}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.dropdown}>
                  <CurrencyDropDown
                    width={50}
                    height={30}
                    open={openDropDown}
                    setOpen={netInfo.isConnected ? setOpenDropDown : () => {}}
                    data={ListCurrency}
                    currency={currency}
                    setCurrency={setCurrency}
                  />
                  <Entypo
                    name="calculator"
                    size={30}
                    style={{marginLeft: 5}}
                    onPress={() => setOpenCalculator(true)}
                    color={ColorCustom.middleGrey}
                  />
                </View>
              </View>
            </View>

            {/* DATE */}
            <View
              style={[
                styles.styleTextInput,
                {marginTop: openDropDown ? -90 : 0, paddingTop: 30},
              ]}>
              <Text style={styles.style_textinput}>{language.date}</Text>
              <Pressable
                style={[
                  styles.styleTextInput_amount,
                  {
                    justifyContent: 'space-between',
                    borderColor:
                      focusInput === 3 ? inputColor : ColorCustom.middleGrey,
                  },
                ]}
                onPress={() => {
                  setFocusInput(3);
                  setOpenCalendar(true);
                }}>
                <Text
                  style={[
                    styles.small_textinput,
                    {
                      width: '90%',
                      paddingVertical: 10,
                      paddingHorizontal: 0,
                    },
                  ]}>
                  {dayjs(time).format('DD/MM/YYYY')}
                </Text>
                <Pressable onPress={() => setOpenCalendar(true)} hitSlop={20}>
                  <AntDesign
                    name="calendar"
                    size={20}
                    color={ColorCustom.middleGrey}
                  />
                </Pressable>
              </Pressable>
            </View>
            {/* WALLET */}
            <Pressable
              style={[
                styles.styleTextInput,
                {
                  borderColor:
                    focusInput === 4 ? inputColor : ColorCustom.middleGrey,
                },
              ]}
              onPress={() => {
                setFocusInput(4);
                if (netInfo.isConnected) {
                  setOpenWallet(true);
                } else {
                  ToastAndroid.showWithGravity(
                    language.notInternetWallet,
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                  );
                }
              }}>
              <Text style={styles.style_textinput}>{language.wallet}</Text>
              <View
                style={[
                  styles.styleInput,
                  {
                    paddingVertical: 10,
                    width: '100%',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  },
                ]}>
                <Text style={styles.small_textinput}>{wallet?.name}</Text>
                <Text style={styles.small_textinput}>{wallet?.currency}</Text>
              </View>
            </Pressable>
            {/* PLAN */}
            <View style={[styles.styleTextInput, {zIndex: 2}]}>
              <Text style={styles.style_textinput}>{language.plan}</Text>
              {(IsIncome && PLAN_INCOME.length === 0) ||
              (!IsIncome && PLAN.length === 0) ||
              !netInfo.isConnected ? (
                <View
                  style={[styles.styleTextInput_amount, {paddingVertical: 10}]}>
                  <Text
                    style={[
                      styles.style_textinput,
                      {marginBottom: 0, fontSize: 15},
                    ]}>
                    {netInfo.isConnected
                      ? language.noPlan
                      : language.notInternetPlan}
                  </Text>
                </View>
              ) : (
                <DropDownPlan
                  width={WIDTH_SCREEN - 60}
                  height={50}
                  data={ListPlan}
                  setData={setListPlan}
                  select={selectPlan}
                  setSelect={setSelectPlan}
                  open={openPlan}
                  setOpen={netInfo ? setOpenPlan : () => {}}
                  color={inputColor}
                  language={userSetting}
                />
              )}
            </View>
            {/* NOTE */}
            <View style={[styles.styleTextInput, {zIndex: 1}]}>
              <Text style={styles.style_textinput}>{language.Note}</Text>
              <TextInput
                style={[
                  styles.styleInput,
                  styles.small_textinput,
                  {
                    borderColor:
                      focusInput === 5 ? inputColor : ColorCustom.middleGrey,
                    width: '100%',
                  },
                ]}
                onFocus={() => setFocusInput(5)}
                onBlur={() => setFocusInput(null)}
                defaultValue={note}
                onChangeText={setNote}
              />
            </View>

            {/* Image */}
            <View
              style={[
                styles.styleTextInput,
                {
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                },
              ]}>
              {imagePicker?.map((image, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      width: (WIDTH_SCREEN - 80) / 2,
                      borderWidth: 1,
                      marginVertical: index === 0 || index === 1 ? 10 : 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingVertical: 5,
                    }}>
                    <Image
                      source={{
                        uri:
                          image.type === ''
                            ? image.base64
                            : `data:${image.type};base64,${image.base64}`,
                      }}
                      style={{width: (WIDTH_SCREEN - 150) / 2, height: 100}}
                      resizeMode="contain"
                    />
                    <Pressable
                      style={{
                        position: 'absolute',
                        right: -12,
                        top: -12,
                        width: 30,
                        height: 30,
                        borderWidth: 1,
                        backgroundColor: ColorCustom.gray,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => onRemoveImage(index)}>
                      <Feather name="x" size={20} color={ColorCustom.black} />
                    </Pressable>
                  </View>
                );
              })}
            </View>
            <Pressable
              style={styles.press_camera}
              onPress={() => setOpenCamera(true)}>
              <Ionicons
                name="ios-camera-sharp"
                size={45}
                color={ColorCustom.middleGrey}
              />
            </Pressable>
          </ScrollView>
        </View>
        {/* New Category */}
        <View
          style={{
            backgroundColor: ColorCustom.white,
            flex: 1,
          }}>
          <NewCategory
            onPressBack={() => {
              scrollX.value = withTiming(0);
              setFocusInput(null);
            }}
            setCategory={setCategory}
            language={userSetting}
            animatedValue={scrollX}
          />
        </View>
      </Animated.View>
      {/* Modal Wallet */}
      <ModalWallet
        openWallet={openWallet}
        setOpenWallet={setOpenWallet}
        setFocusInput={() => setFocusInput(null)}
        language={language}
        wallet={wallet}
        setWallet={setWallet}
      />
      <DropDownSuggestion
        openModal={openSuggest}
        setOpenModal={setOpenSuggest}
        Data={IsIncome ? SUGGEST_IN : SUGGEST_OUT}
        setSelectedItem={setCategory}
        onNavigatePress={() => {
          setOpenSuggest(false);
          scrollX.value = withTiming(-WIDTH_SCREEN);
        }}
        onBackDrop={() => setFocusInput(null)}
        language={userSetting}
      />
      <Calendar
        open={openCalendar}
        setOpen={setOpenCalendar}
        setDatePicker={setTime}
        language={userSetting}
        enablePast={true}
        FromDate={new Date()}
      />
      <Camera
        open={openCamera}
        setOpen={setOpenCamera}
        language={language}
        imagePicker={imagePicker}
        setImagePicker={setImagePicker}
      />
    </KeyboardAvoidingView>
  );
};

export const styles = StyleSheet.create({
  text: {
    fontFamily: FONT_FAMILY.Medium,
    fontSize: FONT_SIZE.TXT_LARGE_SIZE,
    color: ColorCustom.black,
    marginLeft: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  text_button: {
    color: ColorCustom.middleGrey,
    fontFamily: FONT_FAMILY.Medium,
    fontSize: 15,
  },
  press: {
    borderRadius: 10,
    borderWidth: 1.5,
    width: WIDTH_SCREEN * 0.32,
    paddingVertical: 3,
    alignItems: 'center',
  },
  styleInput: {
    borderWidth: 1,
    width: '100%',
    borderRadius: 10,
    borderColor: ColorCustom.middleGrey,
  },
  style_textinput: {
    fontFamily: FONT_FAMILY.Medium,
    fontSize: 13,
    color: ColorCustom.middleGrey,
    marginBottom: 10,
  },
  styleTextInput: {
    marginTop: 20,
    paddingHorizontal: 30,
  },
  styleTextInput_amount: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    width: '100%',
    borderRadius: 10,
    borderColor: ColorCustom.middleGrey,
    paddingHorizontal: 10,
  },
  textinput_amount: {
    width: '80%',
    color: ColorCustom.black,
    fontFamily: FONT_FAMILY.Medium,
  },
  icon: {
    marginHorizontal: 15,
  },
  vnd: {
    borderRadius: 5,
    borderWidth: 1.5,
    padding: 5,
    alignItems: 'center',
    borderColor: ColorCustom.middleGrey,
  },
  text_vnd: {
    color: ColorCustom.middleGrey,
    fontFamily: FONT_FAMILY.Medium,
    fontSize: FONT_SIZE.TXT_SMALLER_SIZE,
  },
  press_camera: {
    alignItems: 'center',
    marginTop: 20,
  },
  circle: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    zIndex: 10,
  },
  small_textinput: {
    color: ColorCustom.black,
    fontFamily: FONT_FAMILY.Medium,
    paddingHorizontal: 10,
  },
  back_drop: {
    flex: 1,
    backgroundColor: 'rgba(217,217,217,0.5)',
  },
  headerModal: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pressable_wallet: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: ColorCustom.gray,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modal_container: {
    width: WIDTH_SCREEN,
    backgroundColor: ColorCustom.white,
    paddingVertical: 20,
  },
});

export default memo(InsertOutcome);
