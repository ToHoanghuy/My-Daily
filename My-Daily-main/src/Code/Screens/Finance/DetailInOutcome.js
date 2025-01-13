import {
  View,
  Text,
  Pressable,
  Modal,
  Image,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useMemo} from 'react';
import {FONT_FAMILY} from '../../Assets/Constants/FontCustom';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import EditInOutcome from './EditInOutcome';
import ColorCustom from '../../Assets/Constants/ColorCustom';
import {EN_LANGUAGE, VN_LANGUAGE} from '../../Assets/Data/Language';
import {
  deleteAddition,
  deleteIO,
} from '../../Assets/FunctionCompute/DeleteData';
import {updateDataTransaction} from '../../../ReduxToolKit/Slices/TransactionsSlice';
import {addWalletValue} from '../../../ReduxToolKit/Slices/WalletSlice';
import {
  changeStatisticDetail,
  updateDataMonth,
} from '../../../ReduxToolKit/Slices/StatisticSlice';
import {updateDataExchange} from '../../../ReduxToolKit/Slices/ExchangeRecentSlice';
import {updateCurrent} from '../../../ReduxToolKit/Slices/Plan_Data';
import {updateCurrentPlan} from '../../Assets/FunctionCompute/UpdateData';
import {store} from '../../../ReduxToolKit/Store';
import {Timestamp} from '@firebase/firestore';
import {convertTimestamptToDate} from './Notification/Notification';
const DetailInOutcome = ({
  openModalDetail,
  setOpenModalDetail,
  inout,
  walletName,
  setOpenDetail,
}) => {
  const currencySetting = useSelector(state => state.UserSetting);
  const uid = useSelector(state => state.UserSetting).id;
  const WALLET = useSelector(state => state.Wallet)[0].name;
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const language = useMemo(
    () =>
      currencySetting.language === 'English'
        ? EN_LANGUAGE.modal.detailIO
        : VN_LANGUAGE.modal.detailIO,

    [currencySetting.language],
  );

  if (inout === null) {
    return <></>;
  } else {
    //console.log(inout);
    //return <></>;
    return (
      <Modal
        visible={openModalDetail}
        onRequestClose={() => setOpenModalDetail(!openModalDetail)}>
        <View style={styles.overView}>
          <EditInOutcome
            openModalEdit={openEdit}
            setOpenModalEdit={setOpenEdit}
            inout={inout}
            walletName={walletName}
            language={currencySetting.language}
            setOpenModalDetail={setOpenModalDetail}
            setOpenDetail={setOpenDetail}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Pressable onPress={() => setOpenModalDetail(false)}>
                <Ionicons name={'ios-arrow-back'} size={30} color={'#000000'} />
              </Pressable>
              <View style={{paddingLeft: 10}}>
                <Text style={styles.txt}>{language.header}</Text>
              </View>
            </View>
            <View style={styles.container}>
              <Pressable
                onPress={() => {
                  setOpenEdit(!openEdit);
                }}>
                <Ionicons name={'ios-pencil'} size={30} color={'#AB77FF'} />
              </Pressable>

              <Pressable
                onPress={() => {
                  setLoading(!loading);
                  dispatch(
                    updateDataTransaction({
                      walletName: walletName,
                      value: -inout.item.item.value,
                      date: inout.date,
                      isIncome: inout.item.income,
                    }),
                  );
                  dispatch(
                    addWalletValue({
                      name: walletName.name,
                      value:
                        inout.item.income === 'Income'
                          ? -inout.item.item.value
                          : inout.item.item.value,
                    }),
                  );
                  dispatch(
                    changeStatisticDetail({
                      wallet: walletName.name,
                      date: convertTimestamptToDate(
                        inout.item.item.time,
                      ).getDate(),
                      month:
                        convertTimestamptToDate(
                          inout.item.item.time,
                        ).getMonth() + 1,
                      year: convertTimestamptToDate(
                        inout.item.item.time,
                      ).getFullYear(),
                      isIncome: inout.item.income,
                      value: -inout.item.item.value,
                      name: inout.item.name,
                    }),
                  );
                  inout.item.item.plan.map(plan => {
                    updateCurrentPlan(uid, plan, 0, -inout.item.item.value);
                    store.dispatch(
                      updateCurrent({
                        id: plan,
                        old: 0,
                        new: -inout.item.item.value,
                      }),
                    );
                  });
                  if (walletName.name === WALLET) {
                    dispatch(
                      updateDataMonth({
                        isIncome: inout.item.income,
                        name: inout.item.name,
                        value: -inout.item.item.value,
                        year: convertTimestamptToDate(
                          inout.item.item.time,
                        ).getFullYear(),
                        month:
                          convertTimestamptToDate(
                            inout.item.item.time,
                          ).getMonth() + 1,
                        update: 1,
                      }),
                    );
                    dispatch(
                      updateDataExchange({
                        isIncome: inout.item.income,
                        name: inout.item.name,
                        money: -inout.item.item.value,
                      }),
                    );
                  }
                  setOpenModalDetail(false);
                  setOpenDetail(null);
                  setLoading(false);
                  ToastAndroid.show(
                    currencySetting.language === 'English'
                      ? 'Your information has been changed'
                      : 'Thông tin của bạn đã được thay đổi',
                    ToastAndroid.LONG,
                  );
                  deleteIO(uid, walletName, inout).then(() => {
                    deleteAddition(uid, walletName, inout);
                  });
                }}>
                {loading ? (
                  <ActivityIndicator color={ColorCustom.green} size={'large'} />
                ) : (
                  <Ionicons name={'ios-trash'} size={30} color={'#FF0000'} />
                )}
              </Pressable>
            </View>
          </View>

          {/* phần chi tiết của income/outcome */}
          <View style={ColorCustom.white}>
            <View>
              <View style={styles.detailContainer}>
                <View style={{width: 80}}>
                  <Text style={styles.detailTxt}>{language.category}</Text>
                </View>

                <View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={[
                        styles.icon,
                        {backgroundColor: inout.item.item.color},
                      ]}>
                      <FontAwesome
                        name={inout.item.item.iconName}
                        size={20}
                        color={'#FFFFFF'}
                      />
                    </View>

                    <Text style={styles.itemName}>
                      {currencySetting.language === 'English'
                        ? inout.item.name.EN
                        : inout.item.name.VN}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailContainer}>
                <View style={{width: 80}}>
                  <Text style={styles.detailTxt}>{language.amount}</Text>
                </View>

                <View>
                  <Text style={styles.itemName}>
                    {inout.item.item.value} {walletName.currency}
                  </Text>
                </View>
              </View>

              <View style={styles.detailContainer}>
                <View style={{width: 80}}>
                  <Text style={styles.detailTxt}>{language.date}</Text>
                </View>

                <View>
                  <Text style={styles.itemName}>
                    {`${inout.date}/${inout.month}/${inout.year}`}
                  </Text>
                </View>
              </View>

              <View style={styles.detailContainer}>
                <View style={{width: 80}}>
                  <Text style={styles.detailTxt}>{language.wallet}</Text>
                </View>

                <View>
                  <Text style={styles.itemName}>{walletName.name}</Text>
                </View>
              </View>

              <View style={styles.detailContainer}>
                <View style={{width: 80}}>
                  <Text style={styles.detailTxt}>{language.Note}</Text>
                </View>

                <View>
                  <Text style={styles.itemName}>{inout.item.item.note}</Text>
                </View>
              </View>
            </View>

            <View style={styles.overImage}>
              {inout.item.item.image.map((uri, b) => {
                return (
                  <View
                    key={b}
                    style={{
                      height: 160,
                      width: 160,
                      borderWidth: 1,
                      borderColor: '#7A7A7A',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={styles.image}
                      source={{
                        uri: uri.url,
                      }}
                    />
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  overView: {
    backgroundColor: ColorCustom.background,
    paddingTop: 30,
    paddingHorizontal: 20,
    flex: 1,
  },
  txt: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: 24,
    color: ColorCustom.black,
  },
  container: {
    flexDirection: 'row',
    width: 70,
    justifyContent: 'space-between',
  },
  detail: {
    backgroundColor: ColorCustom.white,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
  },
  detailTxt: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: 12,
    color: ColorCustom.middleGrey,
  },
  icon: {
    height: 40,
    width: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  itemName: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: 14,
    color: ColorCustom.black,
  },
  overImage: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  imageContainer: {
    height: 160,
    width: 160,
    borderWidth: 1,
    borderColor: ColorCustom.middleGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 150,
    width: 150,
    resizeMode: 'contain',
  },
});
export default DetailInOutcome;
