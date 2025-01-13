import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Modal,
  Image,
  TextInput,
  ActivityIndicator,
  ToastAndroid,
  Button,
} from 'react-native';
import React, {useMemo} from 'react';
import {FONT_FAMILY} from '../../Assets/Constants/FontCustom';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import CaculatorComponent from '../../CustomComponents/CaculatorComponent';
import ColorCustom from '../../Assets/Constants/ColorCustom';
import CurrencyDropDown from '../../CustomComponents/CurrencyDropDown';
import Entypo from 'react-native-vector-icons/Entypo';
import dayjs from 'dayjs';
import Camera from './Input/Camera';
import {useRef} from 'react';
import {
  updateCurrentPlan,
  updateIO,
} from '../../Assets/FunctionCompute/UpdateData';
import {updateDataTransaction} from '../../../ReduxToolKit/Slices/TransactionsSlice';
import {
  changeStatisticDetail,
  updateDataMonth,
} from '../../../ReduxToolKit/Slices/StatisticSlice';
import AlertComponent from '../../CustomComponents/AlertComponent';
import {addWalletValue} from '../../../ReduxToolKit/Slices/WalletSlice';
import {updateDataExchange} from '../../../ReduxToolKit/Slices/ExchangeRecentSlice';
import {ConvertMoney, ConvertRate} from '../../CustomComponents/ConvertMoney';
import {updateCurrent} from '../../../ReduxToolKit/Slices/Plan_Data';
import {addNotification} from './Notification/NotificationFunction';
import {EN_LANGUAGE, VN_LANGUAGE} from '../../Assets/Data/Language';
import {addNotificationToRedux} from '../../../ReduxToolKit/Slices/NotificationSlice';
import {uuidv4} from '@firebase/util';
import {Timestamp} from 'firebase/firestore';
import {convertTimestamptToDate} from './Notification/Notification';
const ListCurrency = ['VND', 'USD', 'EUR', 'CNY', 'CAD', 'RUD', 'JPY'];
const EditInOutcome = ({
  openModalEdit,
  setOpenModalEdit,
  inout,
  walletName,
  language,
  setOpenModalDetail,
  setOpenDetail,
}) => {
  const userSetting = useSelector(state => state.UserSetting);
  const notification = useMemo(
    () =>
      userSetting.language === 'English'
        ? EN_LANGUAGE.notification
        : VN_LANGUAGE.notification,
    [userSetting],
  );
  const dispatch = useDispatch();
  const [focusInput, setFocusInput] = useState(null);
  const WALLET = useSelector(state => state.Wallet)[0].name;
  const PLAN = useSelector(state => state.PlanData);
  const type = useRef(inout.item.income).current;
  const inputColor = useMemo(
    () => (type === 'Outcome' ? ColorCustom.orange : ColorCustom.blue),
    [type],
  );
  const [openDropDown, setOpenDropDown] = useState(false);
  const [currency, setCurrency] = useState(walletName.currency);
  const [notConvertMoney, setNotConvertMoney] = useState(false);
  const [openCalculator, setOpenCalculator] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const uid = useSelector(state => state.UserSetting).id;
  const update = useRef(inout.item.item).current;
  const [note, setNote] = useState(inout.item.item.note);
  const [result, setResult] = useState(update.value);
  const [currentImage, setCurrentImage] = useState(inout.item.item.image);
  const [imagePicker, setImagePicker] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [tmp_Val, setTmp_Val] = useState(-1);
  const onDeleteImage = (type, index) => {
    if (type === 'new') {
      let tmp = imagePicker.filter((_, indexI) => indexI !== index);
      setImagePicker([...tmp]);
    } else {
      let tmp = currentImage.filter((_, indexI) => indexI !== index);
      setCurrentImage([...tmp]);
    }
  };
  const onCheck = () => {
    if (isNaN(+result)) {
      ToastAndroid.show(
        userSetting === 'English'
          ? "The amount of money don't have a number"
          : 'Số tiền phải là một con số',
        ToastAndroid.SHORT,
      );
      return;
    } else if (+result < 0) {
      ToastAndroid.show(
        userSetting === 'English'
          ? 'The amount of money must greather than 0'
          : 'Số tiền phải lớn hơn 0',
        ToastAndroid.SHORT,
      );
      return;
    } else {
      const convertValue = result.toString().replaceAll(/[.-]/g, '');
      ConvertMoney(currency, walletName.currency, convertValue).then(re => {
        if (isNaN(re)) {
          setNotConvertMoney(true);
          setCurrency(walletName.currency);
          return;
        } else {
          if (
            re - update.value >= walletName.value &&
            inout.item.income === 'Outcome'
          ) {
            setOpenAlert(true);
            setTmp_Val(update.value + walletName.value);
            return;
          } else {
            onDone(Math.round(re * 100) / 100);
          }
        }
      });
    }
  };
  const onDone = value => {
    // setLoading(true);

    let time = convertTimestamptToDate(update.time);
    let sumSize = imagePicker.reduce(
      (preValue, curValue) => preValue + curValue.size,
      0,
    );
    if (sumSize > 300000) {
      ToastAndroid.show(language.exceedImage, ToastAndroid.LONG);
      return;
    }
    let tmpPlan = [];

    if (PLAN.length === 0) {
      tmpPlan = [];
    } else {
      inout.item.item.plan.forEach((p, i) => {
        let index = PLAN.findIndex(value => value.planId === p);
        if (index !== -1) {
          tmpPlan.push(PLAN[index]);
        }
      });
    }
    let tmpCurrency = [
      ...new Set(tmpPlan.map(p => p.currency).filter(p => p !== currency)),
    ];
    let tmpMoney = [];
    new Promise(resolve => {
      if (tmpPlan?.length === 0) resolve([]);
      ConvertRate(tmpCurrency, currency).then(val => {
        if (val === undefined)
          resolve(tmpPlan?.filter(p => p.currency === walletName.currency));
        tmpPlan?.forEach(item => {
          if (val.hasOwnProperty(item.currency)) {
            tmpMoney.push(
              Math.round(val * 1000 * val[item.currency] * 100) / 100,
            );
          } else tmpMoney.push(value);
          if (tmpMoney.length === tmpPlan?.length) {
            resolve(tmpMoney);
          }
        });
      });
    }).then(async values => {
      if (isNaN(value) || values === undefined) {
        setNotConvertMoney(true);
        setLoading(false);
        return;
      }
      if (values.length !== 0) {
        tmpPlan?.forEach((p, index) => {
          updateCurrentPlan(
            uid,
            p.planId,
            inout.item.item.value,
            +values[index],
          );
          dispatch(
            updateCurrent({
              id: p.planId,
              old: inout.item.item.value,
              new: +values[index],
            }),
          );
          const currentValue =
            p.current - inout.item.item.value + Number(values[index]);
          if (p.budget < currentValue) {
            let IsIncome = inout.item.income === 'Outcome' ? false : true;
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
      dispatch(
        updateDataTransaction({
          value: +value - update.value,
          isIncome: inout.item.income,
          date: inout.date,
          walletName: walletName,
        }),
      );
      dispatch(
        changeStatisticDetail({
          wallet: walletName.name,
          date: time.getDate(),
          month: time.getMonth() + 1,
          year: time.getFullYear(),
          isIncome: inout.item.income,
          value: +value - update.value,
          name: inout.item.name,
        }),
      );
      dispatch(
        addWalletValue({
          name: walletName.name,
          value:
            inout.item.income === 'Outcome'
              ? -value + update.value
              : +value - update.value,
        }),
      );
      if (walletName.name === WALLET) {
        dispatch(
          updateDataMonth({
            isIncome: inout.item.income,
            name: inout.item.name,
            value: +value - update.value,
            year: time.getFullYear(),
            month: time.getMonth() + 1,
            update: 1,
          }),
        );
        dispatch(
          updateDataExchange({
            isIncome: inout.item.income,
            name: inout.item.name,
            money: +value - update.value,
          }),
        );
      }
      updateIO(
        uid,
        walletName,
        inout,
        note,
        +value,
        currency,
        imagePicker,
        currentImage,
      );
      setOpenModalEdit(false);
      setOpenModalDetail(false);
      setOpenDetail(null);
      setLoading(false);
      setTmp_Val(-1);
    });
  };
  const [loading, setLoading] = useState(false);
  return (
    <Modal visible={openModalEdit}>
      <View style={styles.overview}>
        <CaculatorComponent
          openModel={openCalculator}
          setOpenModel={setOpenCalculator}
          setResultCompute={setResult}
        />
        <AlertComponent
          title={null}
          open={notConvertMoney}
          setOpen={setNotConvertMoney}
          type={'FAILED'}
          subtitle={
            userSetting.language === 'English'
              ? 'Opps! Convert Currency has expired. Please try again next month! '
              : 'Tính năng đổi tiền đã hết hạn. Vui lòng thử lại vào tháng sau!'
          }
          buttonList={[
            {
              txt: 'OK',
              onPress: () => setNotConvertMoney(false),
            },
          ]}
        />
        <AlertComponent
          title={null}
          open={openAlert}
          setOpen={setOpenAlert}
          type={'ALERT'}
          subtitle={
            language === 'English'
              ? EN_LANGUAGE.insertOutcome.notEnoughAmount
              : VN_LANGUAGE.insertOutcome.notEnoughAmount
          }
          disableBackDrop={true}
          buttonList={[
            {
              txt: language === 'English' ? 'Cancel' : 'Hủy',
              onPress: () => {
                setOpenAlert(false);
                setTmp_Val(-1);
              },
            },
            {
              txt: 'OK',
              onPress: () => {
                onDone(tmp_Val);
                setOpenAlert(false);
              },
            },
          ]}
        />
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Pressable onPress={() => setOpenModalEdit(!openModalEdit)}>
                <Ionicons name={'ios-arrow-back'} size={30} color={'#000000'} />
              </Pressable>
              <View style={{paddingLeft: 10}}>
                <Text style={styles.txt}>
                  {userSetting.language === 'English' ? 'Edit' : 'Chỉnh Sửa'}
                </Text>
              </View>
            </View>
            <Pressable onPress={onCheck}>
              {loading ? (
                <ActivityIndicator color={ColorCustom.green} size={'large'} />
              ) : (
                <Ionicons
                  name={'checkmark-sharp'}
                  size={30}
                  color={ColorCustom.green}
                />
              )}
            </Pressable>
          </View>

          {/* CATEGORY */}

          <View style={styles.styleTextInput}>
            <Text style={styles.style_textinput}>{language.category}</Text>
            <View style={[styles.styleTextInput_amount]}>
              <Pressable>
                <View style={[styles.circle, {backgroundColor: update.color}]}>
                  <FontAwesome
                    name={update.iconName}
                    size={20}
                    color={ColorCustom.white}
                  />
                </View>
              </Pressable>
              <Text style={styles.small_textinput}>
                {language === 'English'
                  ? inout.item.name.EN
                  : inout.item.name.VN}
              </Text>
            </View>
          </View>
          {/* AMOUNT */}
          <View style={styles.styleTextInput}>
            <Text style={styles.style_textinput}>{language.amount}</Text>
            <View style={{zIndex: 99, alignItems: 'flex-end'}}>
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
                  style={[styles.textinput_amount, {width: '70%', zIndex: 999}]}
                  onFocus={() => setFocusInput(2)}
                  onBlur={() => setFocusInput(null)}
                  defaultValue={result.toString()}
                  onChangeText={setResult}
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
                  setOpen={setOpenDropDown}
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
            <View style={styles.styleTextInput_amount}>
              <Text style={styles.small_textinput}>
                {dayjs(convertTimestamptToDate(update.time)).format(
                  'DD/MM/YYYY hh:mm:ss',
                )}
              </Text>
            </View>
          </View>

          <View style={styles.styleTextInput}>
            <Text style={styles.style_textinput}>{language.wallet}</Text>
            <View style={styles.styleTextInput_amount}>
              <Text style={styles.small_textinput}>{walletName.name}</Text>
            </View>
          </View>
          <View style={styles.styleTextInput}>
            <Text style={styles.style_textinput}>{language.Note}</Text>

            <TextInput
              style={[
                styles.small_textinput,
                {
                  borderWidth: 1,
                  borderRadius: 10,

                  borderColor:
                    focusInput === 5 ? inputColor : ColorCustom.middleGrey,
                },
              ]}
              onFocus={() => setFocusInput(5)}
              onBlur={() => setFocusInput(null)}
              defaultValue={note}
              onChangeText={setNote}
            />
          </View>

          <ScrollView
            horizontal
            style={styles.imageScroll}
            showsHorizontalScrollIndicator={false}>
            {currentImage.map((uri, b) => {
              return (
                <View key={b} style={styles.imageContainer}>
                  <Pressable
                    onPress={() => onDeleteImage('old', b)}
                    style={styles.xPress}>
                    <Text
                      style={{
                        color: ColorCustom.white,
                        fontSize: 16,
                      }}>
                      X
                    </Text>
                  </Pressable>
                  <Image
                    style={styles.image}
                    source={{
                      uri: uri.url,
                    }}
                  />
                </View>
              );
            })}
            {imagePicker.map((uri, b) => {
              return (
                <View key={b} style={styles.imageContainer}>
                  <Pressable
                    onPress={() => onDeleteImage('new', b)}
                    style={styles.xPress}>
                    <Text
                      style={{
                        color: ColorCustom.white,
                        fontSize: 16,
                      }}>
                      X
                    </Text>
                  </Pressable>
                  <Image
                    style={styles.image}
                    source={{
                      uri: `data:${uri.type};base64,${uri.base64}`,
                    }}
                  />
                </View>
              );
            })}
          </ScrollView>
        </ScrollView>

        <Pressable
          style={{
            alignItems: 'center',
          }}
          onPress={() => {
            setOpenCamera(!openCamera);
          }}>
          <Ionicons
            name="ios-camera-sharp"
            size={45}
            color={ColorCustom.middleGrey}
          />
        </Pressable>
        <Camera
          open={openCamera}
          setOpen={setOpenCamera}
          language={language}
          imagePicker={imagePicker}
          setImagePicker={setImagePicker}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overview: {
    flex: 1,
    backgroundColor: ColorCustom.background,
  },
  scrollView: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
  },
  txt: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: 24,
    color: ColorCustom.black,
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 10,
    marginTop: 10,
  },
  imageScroll: {flex: 1, marginTop: 15, marginBottom: 10},
  imageContainer: {
    height: 160,
    width: 160,
    borderWidth: 1,
    borderColor: ColorCustom.middleGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  xPress: {
    width: 25,
    height: 25,
    backgroundColor: ColorCustom.middleGrey,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 99,
  },
  image: {
    height: 150,
    width: 150,
    resizeMode: 'contain',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  styleTextInput: {
    marginTop: 20,
    paddingHorizontal: 30,
  },
  style_textinput: {
    fontFamily: FONT_FAMILY.Medium,
    fontSize: 13,
    color: '#7A7A7A',
    marginBottom: 10,
  },
  styleTextInput_amount: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    width: '100%',
    borderRadius: 10,
    borderColor: '#7A7A7A',
    paddingHorizontal: 10,
  },
  circle: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textinput_amount: {
    width: '80%',
    color: '#000',
    fontFamily: FONT_FAMILY.Medium,
  },
  styleTextInput_amount: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    width: '100%',
    borderRadius: 10,
    borderColor: '#7A7A7A',
    paddingHorizontal: 10,
  },
  textinput_amount: {
    width: '80%',
    color: '#000',
    fontFamily: FONT_FAMILY.Medium,
  },

  small_textinput: {
    width: '100%',
    color: '#000',
    fontFamily: FONT_FAMILY.Medium,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
});
export default EditInOutcome;
