import {
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
  StyleSheet,
  Platform,
  UIManager,
  FlatList,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import HeaderDrawer from '../../../CustomComponents/HeaderDrawer';
import Entypo from 'react-native-vector-icons/Entypo';
import Menu from '../../../CustomComponents/Menu';
import ColorCustom from '../../../Assets/Constants/ColorCustom';
import {FONT_FAMILY, FONT_SIZE} from '../../../Assets/Constants/FontCustom';
import dayjs from 'dayjs';
import {useCallback} from 'react';
import {useRef} from 'react';
import {memo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useMemo} from 'react';
import {EN_LANGUAGE, VN_LANGUAGE} from '../../../Assets/Data/Language';
import StatisticModal from './StatisticModal';
import General from './General';
import Income from './Income';
import Outcome from './Outcome';
import {
  getDataMonth,
  getDates,
  getFromDateToDate,
  getIncome,
  getMonths,
  getOutcome,
} from '../../../Assets/FunctionCompute/GetData';
import {
  insertCustomize,
  insertDataQuarter,
  uploadDataQuarter,
  uploadDataYear,
  resetDataQuarter,
  updateYear,
  updateQuarter,
  updateCustomize,
  updateQuarterDetail,
  updateCustomizeDetail,
  resetCustomize,
} from '../../../../ReduxToolKit/Slices/StatisticSlice';
import {useEffect} from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';
import {collection, getDocs} from 'firebase/firestore';
import {db} from '../../../../Firebase/Firebase';

const YEARS = ['2023', '2024', '2025', '2026', '2027'];
const {width} = Dimensions.get('screen');

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
export const sumStatistics = LIST_STATISTICS => {
  return LIST_STATISTICS.reduce(
    (preValue, curValue) => curValue.value + preValue,
    0,
  );
};

const adUnitId_Inter = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
const interstitial = InterstitialAd.createForAdRequest(adUnitId_Inter, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['finance', 'education'],
});
const Statistic = ({navigation}) => {
  const curSetting = useSelector(state => state.UserSetting);
  const WALLET = useSelector(state => state.Wallet)[0];
  const STATISTIC = useSelector(state => state.Statistics).year;
  const NOTIFY_UPDATE = useSelector(state => state.Statistics).notifyUpdate;
  const CHANGE = useSelector(state => state.Statistics).notifyChange;
  const nestifo = useNetInfo();
  const uid = useSelector(state => state.UserSetting).id;
  const DISPATCH = useDispatch();
  const onChangeData = (
    yearPress,
    typeStatistic,
    typePress,
    month,
    quarter,
    startingDate,
    endingDate,
  ) => {
    setLoading(true);
    if (typeStatistic === 'Year') {
      getMonths(uid, WALLET.name, yearPress).then(item => {
        DISPATCH(uploadDataYear(item));
        setLoading(false);
      });
    }
    if (typeStatistic === 'Quarter') {
      getMonths(
        uid,
        WALLET.name,
        yearPress,
        quarter * 3 - 3 + 1,
        quarter * 3,
        3,
      ).then(month => {
        DISPATCH(uploadDataYear(month));
      });
      let tmp = [];

      let i = quarter * 3 - 3 + 1;
      Promise.all([
        getDataMonth(uid, yearPress, i, WALLET.name).then(data =>
          tmp.push(data),
        ),
        getDataMonth(uid, yearPress, i + 1, WALLET.name).then(data =>
          tmp.push(data),
        ),
        getDataMonth(uid, yearPress, i + 2, WALLET.name).then(data =>
          tmp.push(data),
        ),
      ]).then(() => {
        setLoading(false);
        DISPATCH(uploadDataQuarter(tmp));
      });
    }
    if (typeStatistic === 'Month') {
      const maxDate = new Date(yearPress, month, 0).getDate();
      Promise.all([
        getDates(
          uid,
          WALLET.name,
          yearPress,
          month,
          maxDate,
          'asc',
          maxDate,
        ).then(date => {
          let tmpDate = Array.from(date, ({date, income, outcome}) => ({
            month: `${date}/${month}`,
            income,
            outcome,
          }));

          DISPATCH(uploadDataYear(tmpDate));
        }),
        DISPATCH(resetDataQuarter()),
        getDataMonth(uid, yearPress, month, WALLET.name).then(data => {
          DISPATCH(insertDataQuarter(data));
        }),
      ]).then(() => setLoading(false));
    }
    if (typeStatistic === 'Customize') {
      const year = dayjs(startingDate).get('year');
      setYearPress(year);
      const startMonth = dayjs(startingDate).get('month') + 1;
      const endMonth = dayjs(endingDate).get('month') + 1;
      const startDate = dayjs(startingDate).get('date');
      const endDate = dayjs(endingDate).get('date');
      const maxStartMonth = new Date(year, startMonth, 0).getDate();

      getFromDateToDate(
        uid,
        WALLET.name,
        year,
        startMonth - 1,
        endMonth - 1,
        startDate,
        endDate,
      ).then(data => {
        setLoading(false);
        DISPATCH(uploadDataYear(data));
      });
      DISPATCH(resetCustomize());
      if (startMonth === endMonth) {
        for (let i = startDate; i <= endDate; i++) {
          let tmp = {};
          Promise.all([
            getIncome(uid, WALLET.name, year, startMonth, i).then(
              value => (tmp.income = value),
            ),
            getOutcome(uid, WALLET.name, year, startMonth, i).then(
              value => (tmp.outcome = value),
            ),
          ]).then(() => {
            setLoading(false);
            if (tmp.income.length === 0 && tmp.outcome.length === 0) {
            } else DISPATCH(insertCustomize(tmp));
          });
        }
      } else {
        for (let i = startDate; i <= maxStartMonth; i++) {
          let tmp = {};
          Promise.all([
            getIncome(uid, WALLET.name, year, startMonth, i).then(
              value => (tmp.income = value),
            ),
            getOutcome(uid, WALLET.name, year, startMonth, i).then(
              value => (tmp.outcome = value),
            ),
          ]).then(() => {
            if (tmp.income.length === 0 && tmp.outcome.length === 0) {
            } else DISPATCH(insertCustomize(tmp));
          });
        }
        for (let i = 1; i <= endDate; i++) {
          let tmp = {};
          Promise.all([
            getIncome(uid, WALLET.name, year, endMonth, i).then(
              value => (tmp.income = value),
            ),
            getOutcome(uid, WALLET.name, year, endMonth, i).then(
              value => (tmp.outcome = value),
            ),
          ]).then(() => {
            if (tmp.income.length === 0 && tmp.outcome.length == 0) {
            } else DISPATCH(insertCustomize(tmp));
          });
        }
      }
    }
  };

  const language = useMemo(
    () =>
      curSetting.language === 'English'
        ? EN_LANGUAGE.statistic
        : VN_LANGUAGE.statistic,
    [curSetting.langugage],
  );

  const STATISTIC_BUTTONS = useMemo(
    () => [
      {
        name: language.statisticGeneral.btnGeneral,
        color: ColorCustom.green,
      },
      {
        name: language.statisticGeneral.btnOutcome,
        color: ColorCustom.orange,
      },
      {
        name: language.statisticGeneral.btnIncome,
        color: ColorCustom.blue,
      },
    ],
    [curSetting.langugage],
  );
  const [drawerHeight, setDrawerHeight] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModalStatistic, setOpenModalStatistic] = useState(false);
  const [typeStatistic, setTypeStatistic] = useState('Year');
  const [yearPress, setYearPress] = useState(dayjs(new Date()).format('YYYY'));
  const [loading, setLoading] = useState(false);
  const [typePress, setTypePress] = useState(0);

  const [quarter, setQuarter] = useState(0);
  const [month, setMonth] = useState(0);

  //Customize
  const [startingDate, setStartingDate] = useState(new Date());
  const [endingDate, setEndingDate] = useState(new Date());

  const scrollButton = useRef(null);
  const scrollVertical = useRef(null);
  const checkUpdate = useRef(false);

  const checkConditionYear = useCallback(
    year => {
      if (yearPress === year) {
        return STATISTIC_BUTTONS[typePress].color;
      }
      return ColorCustom.gray;
    },
    [typePress, yearPress],
  );

  const renderYear = useCallback(
    ({item: year, index}) => {
      const color = checkConditionYear(year);
      return (
        <Pressable
          onPress={() => {
            if (nestifo.isConnected === true) {
              setYearPress(year);
              onChangeData(year, typeStatistic, typePress, month, quarter);
            }
            if (nestifo.isConnected === false) {
              ToastAndroid.show(
                curSetting.language === 'English'
                  ? 'Your internet is occuring a problem'
                  : 'Mất kết nối internet',
                ToastAndroid.LONG,
              );
            }
          }}
          hitSlop={10}
          key={index}
          style={[
            styles.year_btn,
            {
              borderColor: color,
            },
          ]}>
          <Text
            style={[
              styles.btn_txt,
              {
                color: color,
                fontSize: FONT_SIZE.TXT_SIZE,
              },
            ]}>
            {year}
          </Text>
        </Pressable>
      );
    },
    [yearPress, typePress],
  );
  useEffect(() => {
    if (
      Object.keys(NOTIFY_UPDATE).length !== 0 &&
      NOTIFY_UPDATE.wallet === WALLET.name
    ) {
      if (yearPress == NOTIFY_UPDATE.year) {
        let index = STATISTIC.findIndex(s => s.month == NOTIFY_UPDATE.month);

        if (typeStatistic === 'Year') {
          DISPATCH(
            updateYear({
              index: index,
              value: NOTIFY_UPDATE.value,
              isIncome: NOTIFY_UPDATE.isIncome,
              month: NOTIFY_UPDATE.month,
            }),
          );
        }
        if (typeStatistic === 'Quarter') {
          DISPATCH(
            updateYear({
              index: index,
              value: NOTIFY_UPDATE.value,
              isIncome: NOTIFY_UPDATE.isIncome,
              month: NOTIFY_UPDATE.month,
            }),
          );
          DISPATCH(
            updateQuarter({
              index: (NOTIFY_UPDATE.month + 3) % (3 * quarter),
              value: NOTIFY_UPDATE.value,
              isIncome: NOTIFY_UPDATE.isIncome,
              data: {
                iconName: NOTIFY_UPDATE.iconName,
                color: NOTIFY_UPDATE.color,
                isIncome: NOTIFY_UPDATE.isIncome,
                name: NOTIFY_UPDATE.name,
                value: NOTIFY_UPDATE.value,
              },
            }),
          );
        }

        if (typeStatistic === 'Month') {
          let indexDate = STATISTIC.findIndex(
            s => s.month == `${NOTIFY_UPDATE.date}/${NOTIFY_UPDATE.month}`,
          );
          if (indexDate >= 0) {
            DISPATCH(
              updateYear({
                index: indexDate,
                value: NOTIFY_UPDATE.value,
                isIncome: NOTIFY_UPDATE.isIncome,
                month: NOTIFY_UPDATE.month,
              }),
            );
            DISPATCH(
              updateQuarter({
                index: 0,
                value: NOTIFY_UPDATE.value,
                isIncome: NOTIFY_UPDATE.isIncome,
                data: {
                  iconName: NOTIFY_UPDATE.iconName,
                  color: NOTIFY_UPDATE.color,
                  isIncome: NOTIFY_UPDATE.isIncome,
                  name: NOTIFY_UPDATE.name,
                  value: NOTIFY_UPDATE.value,
                },
              }),
            );
          }
        }
      }
    }
    if (typeStatistic === 'Customize') {
      let indexDate = STATISTIC.findIndex(
        s => s.month == `${NOTIFY_UPDATE.date}/${NOTIFY_UPDATE.month}`,
      );

      if (indexDate >= 0) {
        DISPATCH(
          updateYear({
            index: indexDate,
            value: NOTIFY_UPDATE.value,
            isIncome: NOTIFY_UPDATE.isIncome,
            month: NOTIFY_UPDATE.month,
          }),
        );
        DISPATCH(
          updateCustomize({
            index: indexDate,
            value: NOTIFY_UPDATE.value,
            isIncome: NOTIFY_UPDATE.isIncome,
            data: {
              iconName: NOTIFY_UPDATE.iconName,
              color: NOTIFY_UPDATE.color,
              isIncome: NOTIFY_UPDATE.isIncome,
              name: NOTIFY_UPDATE.name,
              value: NOTIFY_UPDATE.value,
            },
          }),
        );
      }
    }

    // }
  }, [NOTIFY_UPDATE]);
  useEffect(() => {
    const changeStatistic = async () => {
      if (Object.keys(CHANGE).length !== 0 && CHANGE.wallet === WALLET.name) {
        if (STATISTIC.length === 0) {
          const getLengthStatistic = await getDocs(
            collection(db, `/USER/${uid}/Wallet/${WALLET.name}/Statistic/`),
          );
          if (getLengthStatistic.docs.length > 0) {
            return;
          }
        } else {
          if (yearPress == CHANGE.year) {
            let index = STATISTIC.findIndex(s => s.month == CHANGE.month);
            if (typeStatistic === 'Year') {
              DISPATCH(
                updateYear({
                  index: index,
                  value: CHANGE.value,
                  isIncome: CHANGE.isIncome,
                  month: CHANGE.month,
                }),
              );
            }
            if (typeStatistic === 'Quarter') {
              DISPATCH(
                updateYear({
                  index: index,
                  value: CHANGE.value,
                  isIncome: CHANGE.isIncome,
                  month: CHANGE.month,
                }),
              );
              DISPATCH(
                updateQuarterDetail({
                  index: (CHANGE.month + 3) % (3 * quarter),
                  value: CHANGE.value,
                  isIncome: CHANGE.isIncome,
                  name: CHANGE.name,
                }),
              );
            }

            if (typeStatistic === 'Month') {
              let indexDate = STATISTIC.findIndex(
                s => s.month == `${CHANGE.date}/${CHANGE.month}`,
              );
              if (indexDate >= 0) {
                DISPATCH(
                  updateYear({
                    index: indexDate,
                    value: CHANGE.value,
                    isIncome: CHANGE.isIncome,
                    month: CHANGE.month,
                  }),
                );
                DISPATCH(
                  updateQuarterDetail({
                    index: 0,
                    value: CHANGE.value,
                    isIncome: CHANGE.isIncome,
                    name: CHANGE.name,
                  }),
                );
              }
            }
          }
          if (typeStatistic === 'Customize') {
            let indexDate = STATISTIC.findIndex(
              s => s.month == `${CHANGE.date}/${CHANGE.month}`,
            );
            if (indexDate >= 0) {
              DISPATCH(
                updateYear({
                  index: indexDate,
                  value: CHANGE.value,
                  isIncome: CHANGE.isIncome,
                  month: CHANGE.month,
                }),
              );
              DISPATCH(
                updateCustomizeDetail({
                  index: indexDate,
                  value: CHANGE.value,
                  isIncome: CHANGE.isIncome,
                  name: CHANGE.name,
                }),
              );
            }
          }
        }
      }
    };
    changeStatistic();
  }, [CHANGE]);
  useEffect(() => {
    if (nestifo.isConnected !== null) {
      if (nestifo.isConnected) {
        interstitial.load();

        onChangeData(yearPress, typeStatistic, typePress, month, quarter);
      }
      if (!nestifo.isConnected) {
        ToastAndroid.show(
          curSetting.language === 'English'
            ? 'Your internet is occuring a problem'
            : 'Mất kết nối internet',
          ToastAndroid.LONG,
        );
      }
    }
  }, [nestifo.isConnected]);

  useEffect(() => {
    const unsubscribeIntersitialLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        interstitial.show();
      },
    );
    return () => {
      unsubscribeIntersitialLoaded();
    };
  }, []);
  return (
    <View style={styles.overall_container}>
      <StatisticModal
        openModalStatistic={openModalStatistic}
        setOpenModalStatistic={setOpenModalStatistic}
        typeStatistic={typeStatistic}
        language={language}
        onFinish={(year, quarter, month, startingDate, endingDate) => {
          interstitial.load();

          onChangeData(
            year,
            typeStatistic,
            typePress,
            month,
            quarter,
            startingDate,
            endingDate,
          );
          // setYearPress(year);
          setMonth(month);
          setQuarter(quarter);
          setEndingDate(endingDate);
          setStartingDate(startingDate);
        }}
        setLoading={setLoading}
      />

      <HeaderDrawer
        title={language.statisticGeneral.header}
        isSetting={true}
        setDrawerHeight={setDrawerHeight}
        onPressLeft={() => {
          navigation.openDrawer();
        }}
        buttonList={[
          {
            icon_type: Entypo,
            icon_name: 'dots-three-vertical',
            onPress: () => {
              if (nestifo.isConnected === true) {
                setOpen(true);
              }
              if (nestifo.isConnected === false) {
                ToastAndroid.show(
                  curSetting.language === 'English'
                    ? 'Your internet is occuring a problem'
                    : 'Mất kết nối internet',
                  ToastAndroid.SHORT,
                );
              }
            },
          },
        ]}
      />
      <View style={styles.list_btns}>
        {STATISTIC_BUTTONS.map((button, index) => {
          return (
            <Pressable
              onPress={() => {
                setTypePress(index);
                scrollVertical.current.scrollTo({x: 0, y: 0, animated: false});
                scrollButton.current.scrollTo({
                  x: width * index,
                  y: 0,
                  animated: false,
                });
              }}
              key={index}
              style={[
                styles.btn,
                typePress === index && {
                  borderBottomColor: button.color,
                  borderBottomWidth: 2,
                },
              ]}>
              <Text
                style={[
                  styles.btn_txt,
                  {
                    color:
                      typePress === index ? button.color : ColorCustom.gray,
                  },
                ]}>
                {STATISTIC_BUTTONS[index].name}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {typeStatistic === 'Year' && (
        <View
          style={{
            marginVertical: 10,
          }}>
          <FlatList
            data={YEARS}
            renderItem={renderYear}
            horizontal
            showsHorizontalScrollIndicator={false}
            getItemLayout={(_, index) => ({
              length: (width - 60) / 3 + 20,
              offset: ((width - 60) / 3 + 20) * index,
              index,
            })}
          />
        </View>
      )}

      <ScrollView
        ref={scrollVertical}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        renderToHardwareTextureAndroid
        style={{
          flex: 1,
        }}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          ref={scrollButton}
          horizontal
          scrollEnabled={false}
          removeClippedSubviews={true}
          renderToHardwareTextureAndroid>
          {loading ? (
            <View
              style={{
                width,
              }}>
              <ActivityIndicator
                size={'large'}
                color={checkConditionYear(yearPress)}
              />
            </View>
          ) : (
            <General
              languageIncome={language.statisticGeneral.titleIncome}
              languageOutcome={language.statisticGeneral.titleOutcome}
              language={curSetting.language}
              typeStatistic={typeStatistic}
              yearPress={yearPress}
              month={month}
              data={STATISTIC}
              currency={WALLET.currency}
              WALLET={WALLET.name}
            />
          )}
          {loading ? (
            <View
              style={{
                width,
              }}>
              <ActivityIndicator
                size={'large'}
                color={checkConditionYear(yearPress)}
              />
            </View>
          ) : (
            <Outcome
              typeStatistic={typeStatistic}
              typePress={typePress}
              yearPress={yearPress}
              STATISTIC_BUTTONS={STATISTIC_BUTTONS}
              loading={loading}
              language={curSetting.language}
              currency={WALLET.currency}
              month={month}
              dateStart={startingDate}
              dateEnd={endingDate}
              STATISTIC={Array.from(STATISTIC, ({income, month, outcome}) => ({
                month,
                value: outcome,
              }))}
              quarterIndex={quarter}
              WALLET={WALLET.name}
            />
          )}
          {loading ? (
            <View
              style={{
                width,
              }}>
              <ActivityIndicator
                size={'large'}
                color={checkConditionYear(yearPress)}
              />
            </View>
          ) : (
            <Income
              typeStatistic={typeStatistic}
              typePress={typePress}
              yearPress={yearPress}
              STATISTIC_BUTTONS={STATISTIC_BUTTONS}
              loading={loading}
              langugage={curSetting.language}
              month={month}
              dateStart={startingDate}
              dateEnd={endingDate}
              currency={WALLET.currency}
              STATISTIC={Array.from(STATISTIC, ({income, month, outcome}) => ({
                month,
                value: income,
              }))}
              quarterIndex={quarter}
              WALLET={WALLET.name}
            />
          )}
        </ScrollView>
      </ScrollView>

      <Menu
        open={open}
        setOpen={setOpen}
        drawerHeight={drawerHeight}
        btnList={[
          {
            title: language.statisticSort.year,
            onPress: () => {
              setTypeStatistic('Year');
              onChangeData(
                new Date().getFullYear().toString(),
                'Year',
                0,
                month,
                quarter,
              );
              setYearPress(new Date().getFullYear().toString());
            },
          },
          {
            title: language.statisticSort.quarter,
            onPress: () => {
              setTypeStatistic('Quarter');
              setOpenModalStatistic(!openModalStatistic);
            },
          },
          {
            title: language.statisticSort.month,
            onPress: () => {
              setTypeStatistic('Month');
              setOpenModalStatistic(!openModalStatistic);
            },
          },
          {
            title: language.statisticSort.customize,
            onPress: () => {
              setTypeStatistic('Customize');
              setOpenModalStatistic(!openModalStatistic);
            },
          },
        ]}
      />
    </View>
  );
};
export const styles = StyleSheet.create({
  overall_container: {
    flex: 1,
    backgroundColor: 'white',
  },
  modal_container: {
    flex: 1,
    backgroundColor: 'rgba(217, 217, 217, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal_quater: {
    paddingHorizontal: 20,
    paddingVertical: 50,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  modal_subContainer: {
    marginVertical: 30,
    alignSelf: 'center',
  },
  modal_txt: {
    color: ColorCustom.green,
    fontSize: FONT_SIZE.TXT_SIZE,
    fontFamily: FONT_FAMILY.Medium,
  },
  modal_txt_1: {
    fontFamily: FONT_FAMILY.Regular,
    color: ColorCustom.black,
    fontSize: FONT_SIZE.TXT_SMALLER_SIZE,
    marginBottom: 5,
  },
  modal_pressable: {
    backgroundColor: ColorCustom.green,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 5,
    position: 'absolute',
    bottom: -20,
    alignSelf: 'center',
  },
  modal_txt_press: {
    fontFamily: FONT_FAMILY.Medium,
    color: ColorCustom.white,
    fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
  },
  modal_customize: {
    borderWidth: 1,
    borderColor: ColorCustom.gray,
    borderRadius: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  list_btns: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  btn_txt: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
  },
  year_btn: {
    width: (width - 60) / 3,
    height: 35,

    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderWidth: 1.5,
    borderRadius: 100,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 60,
  },
  item_icon: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginRight: 10,
  },
  item_name: {
    textAlign: 'left',
    fontSize: FONT_SIZE.TXT_SMALL_SIZE,
    flex: 1,
    fontFamily: FONT_FAMILY.Regular,
    color: ColorCustom.black,
  },
  item_percent: {
    textAlign: 'center',
    width: '20%',
    fontSize: FONT_SIZE.TXT_SMALL_SIZE,
    fontFamily: FONT_FAMILY.Regular,
    color: ColorCustom.orange,
  },
  item_money: {
    fontSize: FONT_SIZE.TXT_SMALL_SIZE,
    fontFamily: FONT_FAMILY.Regular,
    color: ColorCustom.black,
    flex: 1,
    textAlign: 'right',
  },
  bar_txt_view: {
    width: '90%',
    paddingVertical: 5,
    alignSelf: 'center',
    backgroundColor: ColorCustom.green,
    borderRadius: 100,
    marginVertical: 10,
  },
  bar_txt: {
    fontSize: 20,
    fontFamily: FONT_FAMILY.Bold,
    color: 'white',
    alignSelf: 'center',
  },
  bar_container: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: ColorCustom.orange,
    marginVertical: 10,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: ColorCustom.gray,
    marginVertical: 10,
  },
  outcome_txt: {
    fontSize: 20,
    alignSelf: 'center',
    marginTop: 25,
    fontFamily: FONT_FAMILY.Regular,
  },
  outcome_quarter_txt: {
    color: ColorCustom.black,
    fontFamily: FONT_FAMILY.Regular,
    fontSize: FONT_SIZE.TXT_SIZE,
    alignSelf: 'center',
    marginVertical: 10,
  },
});
export default memo(Statistic);
