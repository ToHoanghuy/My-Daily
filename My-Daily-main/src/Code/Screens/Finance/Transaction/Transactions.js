import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import React from 'react';
import HeaderDrawer from '../../../CustomComponents/HeaderDrawer';
import {FONT_FAMILY, FONT_SIZE} from '../../../Assets/Constants/FontCustom';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ColorCustom from '../../../Assets/Constants/ColorCustom';
import ListCard from './ListCard';
import DetailInOutcome from '../DetailInOutcome';
import Entypo from 'react-native-vector-icons/Entypo';
import ModalComponent from '../../../CustomComponents/ModalComponent';
import {MONTH, YEARS} from '../../../Assets/Data/Months';
import DropdownTxtComponent from '../../../CustomComponents/DropdownTxtComponent';
import {useMemo} from 'react';
import {EN_LANGUAGE, VN_LANGUAGE} from '../../../Assets/Data/Language';
import {useEffect} from 'react';
import {
  getDates,
  getMonths,
  getYears,
} from '../../../Assets/FunctionCompute/GetData';
import {doc, getDoc} from 'firebase/firestore';
import {uploadDataTransaction} from '../../../../ReduxToolKit/Slices/TransactionsSlice';
import {db} from '../../../../Firebase/Firebase';
import {useNetInfo} from '@react-native-community/netinfo';
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';
const {height: HSC} = Dimensions.get('screen');

const adUnitId_Inter = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
const interstitial = InterstitialAd.createForAdRequest(adUnitId_Inter, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['finance', 'education'],
});

const Transactions = ({navigation}) => {
  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      setOpenDetail(null);
    });
    subscribe;
  }, [navigation]);
  useEffect(() => {
    const unsubscribeIntersial = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        interstitial.show();
      },
    );
    interstitial.load();

    return () => {
      unsubscribeIntersial();
    };
  }, []);

  const userSetting = useSelector(state => state.UserSetting).language;
  const WALLET = useSelector(state => state.Wallet);
  const modalTxt = useMemo(() =>
    userSetting === 'English'
      ? EN_LANGUAGE.statistic.statisticMonth
      : VN_LANGUAGE.statistic.statisticMonth,
  );
  const netifo = useNetInfo();
  const currencySetting = useSelector(state => state.Wallet)[0].currency;
  const TRANSACTIONS = useSelector(state => state.Transactions);
  const uid = useSelector(state => state.UserSetting).id;
  const [walletIndex, setWalletIndex] = useState(0);
  const [inout, setInout] = useState(null);
  const [openDetailIO, setOpenDetailIO] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openDropYear, setOpenDropYear] = useState(false);
  const [openDropMonth, setOpenDropMonth] = useState(false);

  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const getDataToDate = async (wallet, year, month) => {
    if (
      TRANSACTIONS[walletIndex]?.data[0]?.month == month &&
      TRANSACTIONS[walletIndex]?.data[0]?.year == year
    ) {
      setOpenModal(false);

      return;
    } else {
      setLoading(true);
      getDates(
        uid,
        wallet,
        year,
        month,
        new Date(year, month, 0).getDate(),
        'desc',
        31,
      ).then(d => {
        let tmp = [];
        if (d.length !== 0) {
          d.map(async (item, index) => {
            const getDate = await getDoc(
              doc(
                db,
                `/USER/${uid}/Wallet/${wallet}/Statistic/${year}/Month/${month}/Date/${item.date}`,
              ),
            );
            tmp.push({
              year: year,
              month: month,
              date: item.date,
              outcome: getDate.data().outcome,
              income: getDate.data().income,
            });
            if (tmp.length === d.length) {
              dispatch(
                uploadDataTransaction({
                  key: WALLET[walletIndex].name,
                  data: tmp,
                }),
              );
              setLoading(false);
              setOpenModal(false);
            }
          });
        } else {
          dispatch(
            uploadDataTransaction({key: WALLET[walletIndex].name, data: tmp}),
          );
          setLoading(false);
          setOpenModal(false);
        }
      });
    }
  };
  const getDB = async wallet => {
    setLoading(true);
    let tmp = [];
    new Promise(resolve => {
      getYears(uid, wallet, new Date().getFullYear()).then(y => {
        if (y !== null) {
          let tmpYear = y.year;
          getMonths(uid, wallet, y.year, 1, 12, 12, 'desc').then(m => {
            if (m.length !== 0) {
              let tmpMonth = m[0].month;
              getDates(
                uid,
                wallet,
                tmpYear,
                tmpMonth,
                new Date(tmpYear, tmpMonth, 0).getDate(),
                'desc',
                31,
              ).then(d => {
                if (d.length === 0) {
                  resolve(tmp);
                } else {
                  d.map(async (item, index) => {
                    const getDate = await getDoc(
                      doc(
                        db,
                        `/USER/${uid}/Wallet/${wallet}/Statistic/${tmpYear}/Month/${tmpMonth}/Date/${item.date}`,
                      ),
                    );
                    tmp.push({
                      year: tmpYear,
                      month: tmpMonth,
                      date: item.date,
                      outcome: getDate.data().outcome,
                      income: getDate.data().income,
                    });
                    if (tmp.length === d.length) {
                      resolve(tmp);
                    }
                  });
                }
              });
            } else {
              resolve(tmp);
            }
          });
        } else {
          resolve(tmp);
        }
      });
    }).then(data => {
      dispatch(uploadDataTransaction({key: WALLET[walletIndex].name, data}));
      setLoading(false);
    });
  };
  const changeWallet = index => {
    setWalletIndex(index);
    setOpenDetailIO(null);
  };

  useEffect(() => {
    if (netifo.isConnected !== null) {
      if (netifo.isConnected) {
        if (!TRANSACTIONS.map(t => t.key).includes(WALLET[walletIndex].name)) {
          interstitial.load();

          setLoading(true);

          getDB(WALLET[walletIndex].name);
        }
      } else
        ToastAndroid.show(
          userSetting === 'English'
            ? 'Your internet is occuring a problem'
            : 'Mất kết nối internet',
          ToastAndroid.LONG,
        );
    }
  }, [walletIndex, netifo]);
  const [openDetail, setOpenDetail] = useState(null);
  const [openScroll, setOpenScroll] = useState(false);

  return (
    <View style={styles.transactionOverview}>
      <HeaderDrawer
        title={userSetting === 'English' ? 'Transactions' : 'Giao Dịch'}
        onPressLeft={() => navigation.openDrawer()}
      />
      <DetailInOutcome
        openModalDetail={openDetailIO}
        setOpenModalDetail={setOpenDetailIO}
        inout={inout}
        walletName={WALLET[walletIndex]}
        setOpenDetail={setOpenDetail}
      />

      <View style={styles.overview}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            marginVertical: 5,
          }}
          contentContainerStyle={{
            justifyContent: 'space-between',
          }}>
          {WALLET.map((item, index) => {
            return (
              <View key={index}>
                <Pressable
                  onPress={() => {
                    if (netifo.isConnected === true) {
                      changeWallet(index);
                      setOpenDetail(null);
                    }
                    if (netifo.isConnected === false) {
                      ToastAndroid.show(
                        userSetting === 'English'
                          ? 'Your internet is occuring a problem'
                          : 'Mất kết nối internet',
                        ToastAndroid.SHORT,
                      );
                    }
                  }}>
                  <View
                    style={[
                      styles.walletBtn,
                      {
                        borderColor:
                          walletIndex === index
                            ? ColorCustom.green
                            : ColorCustom.gray,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.walletTxt,
                        {
                          color:
                            walletIndex === index
                              ? ColorCustom.green
                              : ColorCustom.gray,
                        },
                      ]}>
                      {item.name}
                    </Text>
                  </View>
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
        <Pressable
          onPress={() => {
            setOpenModal(true);
          }}>
          <Entypo name="calendar" size={24} color={ColorCustom.gray} />
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator color={ColorCustom.green} size={'large'} />
      ) : (
        <View
          onLayout={e => {
            setOpenScroll(
              HSC - e.nativeEvent.layout.y - e.nativeEvent.layout.height < 0
                ? true
                : false,
            );
          }}>
          <ListCard
            walletIndex={walletIndex}
            currencySetting={currencySetting}
            setInout={setInout}
            setOpenDetailIO={setOpenDetailIO}
            year={year}
            month={month}
            WALLET={WALLET}
            setOpenDetail={setOpenDetail}
            openDetail={openDetail}
            openScroll={openScroll}
          />
        </View>
      )}
      <ModalComponent visible={openModal}>
        <View style={styles.modalOverview}>
          <Pressable
            onPress={() => setOpenModal(false)}
            style={styles.modalBackground}
          />
          <View style={styles.modalView}>
            <View>
              <Text style={styles.modalTxt}>{modalTxt.titleYear}</Text>

              <DropdownTxtComponent
                width={250}
                height={40}
                data={YEARS}
                choose={year}
                setChoose={setYear}
                fontSize={FONT_SIZE.TXT_SIZE}
                fontFamily={FONT_FAMILY.Medium}
                color={ColorCustom.black}
                open={openDropYear}
                setOpen={setOpenDropYear}
                placeHolder={modalTxt.titleYear}
                isIcon={true}
                additional={StatusBar.currentHeight}
              />
            </View>
            <View
              style={{
                marginTop: 15,
              }}>
              <Text style={styles.modalTxt}>{modalTxt.titleMonth}</Text>
              <View>
                <DropdownTxtComponent
                  width={250}
                  height={40}
                  data={MONTH}
                  choose={month}
                  setChoose={setMonth}
                  fontSize={FONT_SIZE.TXT_SIZE}
                  fontFamily={FONT_FAMILY.Medium}
                  color={ColorCustom.black}
                  open={openDropMonth}
                  setOpen={setOpenDropMonth}
                  placeHolder={modalTxt.titleMonth}
                  isIcon={true}
                  additional={StatusBar.currentHeight}
                />
              </View>
            </View>
            <Pressable
              onPress={() => {
                interstitial.load();
                getDataToDate(WALLET[0].name, year, month);
              }}
              style={styles.modalPressable}>
              <Text style={styles.modalBtnTxt}>
                {currencySetting === 'English' ? 'Confirm' : 'Xác Nhận'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ModalComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionOverview: {
    flex: 1,
    backgroundColor: ColorCustom.background,
  },
  walletBtn: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
    margin: 10,
    borderWidth: 1,
    borderRadius: 99,
    backgroundColor: '#FFFFFF',
  },
  walletTxt: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: 16,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  modalOverview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(186,186,186,0.5)',
  },
  modalView: {
    width: '80%',
    height: 200,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTxt: {
    fontFamily: FONT_FAMILY.Regular,
    color: ColorCustom.black,
    fontSize: FONT_SIZE.TXT_SMALLER_SIZE,
    marginBottom: 5,
  },
  modalPressable: {
    backgroundColor: ColorCustom.green,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 5,
    position: 'absolute',
    zIndex: -1,
    bottom: -20,
    alignSelf: 'center',
  },
  modalBtnTxt: {
    fontFamily: FONT_FAMILY.Medium,
    color: ColorCustom.white,
    fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
  },
  overview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
});

export default Transactions;
