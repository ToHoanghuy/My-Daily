import {
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  UIManager,
  LayoutAnimation,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import HeaderDrawer from '../../CustomComponents/HeaderDrawer';
import {FONT_FAMILY} from '../../Assets/Constants/FontCustom';
import {FONT_SIZE} from '../../Assets/Constants/FontCustom';
import ColorCustom from '../../Assets/Constants/ColorCustom';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {EN_LANGUAGE, VN_LANGUAGE} from '../../Assets/Data/Language';
import PieChart from '../../CustomComponents/ChartComponent/PieChart';
import SwiperCard from '../../CustomComponents/SwiperCard';
import {
  TestIds,
  AdEventType,
  InterstitialAd,
  BannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {useMemo} from 'react';
import {useEffect} from 'react';
import NoDataFond from '../../CustomComponents/NoDataFond';
import {MONTHS} from '../../Assets/Data/Months';
import {
  deleteWalletRedux,
  sortWallet,
} from '../../../ReduxToolKit/Slices/WalletSlice';
import {
  getDataExchange,
  getDataMonth,
  getMonths,
  getYears,
} from '../../Assets/FunctionCompute/GetData';
import {uploadDataMonth} from '../../../ReduxToolKit/Slices/StatisticSlice';
import {uploadDataExchange} from '../../../ReduxToolKit/Slices/ExchangeRecentSlice';
import {changeWalletAction} from '../../../ReduxToolKit/Actions/changeWalletAction';
import {useNetInfo} from '@react-native-community/netinfo';
import AlertComponent from '../../CustomComponents/AlertComponent';
import {deleteWallet} from '../../Assets/FunctionCompute/DeleteData';
import {deleteTransaction} from '../../../ReduxToolKit/Slices/TransactionsSlice';
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const {width: WIDTH_SCREEN, height: HEIGHT_SCREEN} = Dimensions.get('window');

const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
const adUnitId_Inter = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
const interstitial = InterstitialAd.createForAdRequest(adUnitId_Inter, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

const Overview = ({navigation}) => {
  const userSetting = useSelector(state => state.UserSetting);
  const WALLETS = useSelector(state => state.Wallet);
  const STATISTICS = useSelector(state => state.Statistics).month;
  const EXCHANGE_RECENT = useSelector(state => state.ExchangeRecent);
  const NOTIFICATION = useSelector(state => state.Notification);
  const PLANS = useSelector(state => state.PlanData);
  const uid = useSelector(state => state.UserSetting).id;
  const netifo = useNetInfo();
  const language = useMemo(
    () =>
      userSetting.language === 'English'
        ? EN_LANGUAGE.overview
        : VN_LANGUAGE.overview,
    [userSetting.language],
  );
  const checkConditionStatistic = () => {
    if (isOutcome && STATISTICS.outcome.length === 0) return 0;
    if (!isOutcome && STATISTICS.income.length === 0) return 0;
    return 1;
  };
  const dateTxt = useCallback(() => {
    if (userSetting.language === 'English') {
      return `The ${MONTHS[STATISTICS?.month - 1]} of ${STATISTICS?.year}`;
    } else {
      return `Tháng ${STATISTICS?.month} năm ${STATISTICS?.year}`;
    }
  }, [language, STATISTICS]);
  const [blanceShow, setBlanceShow] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showRecentExchange, setShowRecentExchange] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  const [isOutcome, setIsOutcome] = useState(false);
  const [type, setType] = useState('details');
  const [scrollLayout, setScrollLayout] = useState(0);
  const [openAlert, setOpenAlert] = useState(false);
  const pressAnimatedX = useSharedValue(WIDTH_SCREEN - 70);
  const pressAnimatedY = useSharedValue(300);

  const dispatch = useDispatch();
  const panHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.tmpX = pressAnimatedX.value;
      ctx.tmpY = pressAnimatedY.value;
    },
    onActive: (e, ctx) => {
      pressAnimatedX.value = ctx.tmpX + e.translationX;
      pressAnimatedY.value = ctx.tmpY + e.translationY;
    },
    onEnd: () => {
      if (pressAnimatedX.value < 10) pressAnimatedX.value = withTiming(10);
      if (pressAnimatedX.value > WIDTH_SCREEN - 70)
        pressAnimatedX.value = withTiming(WIDTH_SCREEN - 70);
      if (pressAnimatedY.value < 80) pressAnimatedY.value = withTiming(90);
      if (pressAnimatedY.value > HEIGHT_SCREEN - 70)
        pressAnimatedY.value = withTiming(HEIGHT_SCREEN - 70);
    },
  });
  const pressableAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: pressAnimatedX.value},
        {translateY: pressAnimatedY.value},
      ],
    };
  });
  useEffect(() => {
    if (pressAnimatedY.value > HEIGHT_SCREEN - 70) {
      pressAnimatedY.value = withTiming(HEIGHT_SCREEN - 70);
    }
  }, [scrollLayout]);

  const btnPressable = useCallback(
    () => (
      <PanGestureHandler onGestureEvent={panHandler}>
        <AnimatedPressable
          onPress={() => {
            navigation.navigate('InsertOutcome');
          }}
          style={[styles.presable, pressableAnimatedStyle]}>
          <Feather name="plus" size={40} color={'white'} />
        </AnimatedPressable>
      </PanGestureHandler>
    ),
    [scrollLayout],
  );
  const [loading, setLoading] = useState(false);
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const changeWallet = useCallback(
    async (wallet, index, sort = true) => {
      if (netifo.isConnected === true) {
        if ((sort && WALLETS[0].name !== wallet.name) || !sort) {
          setLoading(true);
          sort && dispatch(sortWallet(index));
          dispatch(changeWalletAction());
          Promise.all([
            getYears(uid, wallet.name, new Date().getFullYear()).then(year => {
              if (year) {
                getMonths(uid, wallet.name, year.year, 1, 12, 1, 'desc').then(
                  dataMonth => {
                    if (dataMonth.length !== 0) {
                      getDataMonth(
                        uid,
                        year.year,
                        dataMonth[0].month,
                        wallet.name,
                      ).then(dataDetail => {
                        dispatch(
                          uploadDataMonth({
                            year: year.year,
                            month: dataMonth[0].month,
                            ...dataDetail,
                          }),
                        );
                      });
                    } else {
                      dispatch(uploadDataMonth(null));
                    }
                  },
                );
              } else {
                dispatch(uploadDataMonth(null));
              }
            }),
            getDataExchange(uid, wallet.name).then(value => {
              dispatch(uploadDataExchange(value));
            }),
          ]).then(() => setLoading(false));
        }
      }
      if (netifo.isConnected === false) {
        ToastAndroid.show(
          userSetting.language === 'English'
            ? 'Your internet is occuring a problem'
            : 'Mất kết nối internet',
          ToastAndroid.LONG,
        );
      }
    },
    [WALLETS[0].name, netifo.isConnected],
  );
  const onDeleteWallet = (index, walletName) => {
    if (WALLETS.length === 1) {
      ToastAndroid.show(
        userSetting.language === 'English'
          ? "You can't delete this wallet. Because you only have one wallet"
          : 'Bạn không thể xóa ví. Vì bạn chỉ còn 1 ví',
        ToastAndroid.LONG,
      );
    } else {
      setOpenAlert(!openAlert);
      setWalletDelete({name: walletName, index});
    }
  };
  const [walletDelete, setWalletDelete] = useState({});
  {
    /*Inter */
  }
  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        interstitial.show();
      },
    );

    interstitial.load();

    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View
        style={{
          flex: 1,
        }}>
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          onLayout={e => setScrollLayout(e.nativeEvent.layout.height)}
          onContentSizeChange={(_, height) => {
            setScrollLayout(height);
          }}
          renderToHardwareTextureAndroid
          removeClippedSubviews={false}>
          <HeaderDrawer
            title={language.header}
            onPressLeft={() => navigation.openDrawer()}
            onPressRight={() => navigation.navigate('Notification')}
            isNotice={true}
            numberOfNotice={NOTIFICATION.length}
          />
          {netifo.isConnected && (
            <View
              style={{
                width: '100%',
              }}>
              <BannerAd
                unitId={adUnitId}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                requestOptions={{
                  requestNonPersonalizedAdsOnly: true,
                }}
              />
            </View>
          )}
          {/*Alert Component */}
          <AlertComponent
            open={openAlert}
            setOpen={setOpenAlert}
            title={userSetting.language === 'English' ? 'Warning' : 'Cảnh Báo'}
            subtitle={
              userSetting.language === 'English'
                ? 'Are you definitely delete this wallet!'
                : 'Bạn có chắc chắn muốn xóa ví này!'
            }
            buttonList={[
              {
                txt: userSetting.language === 'English' ? 'No' : 'Không',
                onPress: () => {
                  setOpenAlert(!openAlert);
                },
              },
              {
                txt: userSetting.language === 'English' ? 'Yes' : 'Có',
                onPress: () => {
                  interstitial.load();
                  setOpenAlert(!openAlert);
                  deleteWallet(uid, walletDelete.name);
                  deleteTransaction(walletDelete.name);
                  dispatch(deleteWalletRedux(walletDelete.name));
                  if (walletDelete.index === 0) {
                    changeWallet(
                      {name: WALLETS[1].name},
                      walletDelete.index,
                      false,
                    );
                  }
                },
              },
            ]}
            type={'ALERT'}
          />
          {/*Body */}
          <View style={styles.body}>
            {/*Balance Header */}

            <View style={styles.headerContainer}>
              <Pressable
                style={styles.balanceContainer}
                onPress={() => {
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut,
                  );
                  setBlanceShow(!blanceShow);
                }}>
                <View>
                  <Text style={styles.balanceTxt}>{language.titleBalance}</Text>
                  <Text style={styles.balanceTxtMoney}>
                    {WALLETS[0].value} {WALLETS[0].currency}
                  </Text>
                </View>

                <Feather
                  name={blanceShow ? 'chevron-up' : 'chevron-down'}
                  size={25}
                  color={ColorCustom.green}
                />
              </Pressable>
              {blanceShow && WALLETS.length >= 1 && (
                <View>
                  <View
                    style={{
                      width: '100%',
                      height: 1,
                      marginVertical: 10,
                      backgroundColor: ColorCustom.green,
                    }}
                  />
                  <ScrollView
                    removeClippedSubviews
                    scrollEnabled
                    style={{
                      height: WALLETS.length > 3 ? 45 * 3 : WALLETS.length * 45,
                    }}>
                    {WALLETS.map((wallet, index) => {
                      return (
                        <View
                          key={index}
                          style={[
                            styles.balanceContainer,
                            {
                              height: 45,
                            },
                          ]}>
                          <Pressable
                            onPress={() => changeWallet(wallet, index)}
                            style={[
                              styles.balanceContainer,
                              {
                                width: '80%',
                              },
                            ]}>
                            <Text
                              style={styles.txtWalletName}
                              numberOfLines={1}>
                              {wallet.name}
                            </Text>
                            {index === 0 && (
                              <Text
                                style={{
                                  color: 'hsl(0,0%,50%)',
                                  fontSize: FONT_SIZE.TXT_SMALLER_SIZE,
                                  paddingHorizontal: 10,
                                  paddingVertical: 5,
                                  backgroundColor: 'hsl(0,0%,73%)',
                                  borderRadius: 10,
                                  fontFamily: FONT_FAMILY.Regular,
                                }}>
                                Default
                              </Text>
                            )}
                            <Text
                              style={styles.txtWalletName}
                              numberOfLines={1}>
                              {wallet.value} {wallet.currency}
                            </Text>
                          </Pressable>
                          <Pressable
                            onPress={() => onDeleteWallet(index, wallet.name)}
                            style={styles.btnTrash}>
                            <Feather
                              name="trash"
                              size={14}
                              color={ColorCustom.red}
                            />
                          </Pressable>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            </View>

            {/*Statistic */}
            <View style={styles.headerContainer}>
              {/*Statistic Header */}
              <Pressable
                style={styles.balanceContainer}
                onPress={() => {
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut,
                  );
                  setShowStatistics(!showStatistics);
                }}>
                <Text style={styles.balanceTxt}>
                  {language.titleStatistics}
                </Text>
                <Feather
                  name={showStatistics ? 'chevron-up' : 'chevron-down'}
                  size={25}
                  color={ColorCustom.green}
                />
              </Pressable>

              <View style={styles.balanceDivider} />

              {/*Button Statistic */}

              <View style={styles.balanceContainerPress}>
                <Pressable
                  onPress={() => {
                    setIsOutcome(true);
                  }}
                  style={[
                    styles.balancePress,
                    isOutcome === false && {borderColor: ColorCustom.gray},
                  ]}>
                  <Text
                    style={[
                      styles.balanceTxtPress,
                      isOutcome === false && {color: ColorCustom.gray},
                    ]}>
                    {language.btnOutcome}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setIsOutcome(false);
                  }}
                  style={[
                    styles.balancePress,
                    {
                      borderColor:
                        isOutcome === false
                          ? ColorCustom.blue
                          : ColorCustom.gray,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.balanceTxtPress,
                      {
                        color:
                          isOutcome === false
                            ? ColorCustom.blue
                            : ColorCustom.gray,
                      },
                    ]}>
                    {language.btnIncome}
                  </Text>
                </Pressable>
              </View>
              {loading ? (
                <ActivityIndicator color={ColorCustom.green} size={'large'} />
              ) : checkConditionStatistic() ? (
                <View>
                  {/*Date */}
                  <Text style={styles.txtDate}>{dateTxt()}</Text>
                  {/*Pie Chart */}

                  <PieChart
                    width={WIDTH_SCREEN * 0.5}
                    height={WIDTH_SCREEN * 0.5}
                    data={isOutcome ? STATISTICS.outcome : STATISTICS.income}
                    radius={70}
                    strokeWidth={40}
                    language={userSetting.language}
                  />

                  {/*Header Detail */}
                  <View
                    style={[
                      styles.balanceContainer,
                      {
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginVertical: 10,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.txtTitle,
                        {
                          color: isOutcome
                            ? ColorCustom.orange
                            : ColorCustom.blue,
                        },
                      ]}>
                      {isOutcome ? language.titleOutcome : language.titleIncome}
                    </Text>

                    <Text
                      style={[
                        styles.txtTitle,
                        {
                          color: isOutcome
                            ? ColorCustom.orange
                            : ColorCustom.blue,
                        },
                      ]}>
                      {isOutcome ? STATISTICS.sumOutcome : STATISTICS.sumIncome}{' '}
                      {WALLETS[0].currency}
                    </Text>
                  </View>
                  {showStatistics && (
                    <>
                      <View
                        style={[
                          styles.balanceDivider,
                          {
                            backgroundColor: ColorCustom.gray,
                          },
                        ]}
                      />

                      <ScrollView
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={true}
                        renderToHardwareTextureAndroid
                        nestedScrollEnabled={true}
                        style={{
                          height:
                            (isOutcome ? STATISTICS.outcome : STATISTICS.income)
                              .length > 6
                              ? 360
                              : (isOutcome
                                  ? STATISTICS.outcome
                                  : STATISTICS.income
                                ).length * 60,
                        }}>
                        {(isOutcome
                          ? STATISTICS.outcome
                          : STATISTICS.income
                        ).map((statistic, index) => {
                          return (
                            <View
                              key={index}
                              style={[
                                styles.balanceContainer,
                                {
                                  paddingVertical: 10,
                                },
                              ]}>
                              <View
                                style={[
                                  styles.icon,
                                  {backgroundColor: statistic.color},
                                ]}>
                                <FontAwesome
                                  name={statistic.iconName}
                                  size={23}
                                  color={'white'}
                                />
                              </View>
                              <Text style={styles.iconName} numberOfLines={1}>
                                {userSetting.language === 'English'
                                  ? statistic.name.EN
                                  : statistic.name.VN}
                              </Text>
                              <Text style={styles.iconPercent}>
                                {
                                  +(
                                    (statistic.value /
                                      (isOutcome
                                        ? STATISTICS.sumOutcome
                                        : STATISTICS.sumIncome)) *
                                    100
                                  ).toFixed(2)
                                }{' '}
                                %
                              </Text>
                              <Text style={styles.iconMoney}>
                                {statistic.value} {WALLETS[0].currency}
                              </Text>
                            </View>
                          );
                        })}
                      </ScrollView>
                    </>
                  )}
                </View>
              ) : (
                <NoDataFond
                  heightImage={120}
                  widthImage={120}
                  fontSize={FONT_SIZE.TXT_MIDDLE_SIZE}
                />
              )}
            </View>

            {/*Recent Exchange */}
            <View style={styles.headerContainer}>
              {/*Exchange Header */}
              <Pressable
                hitSlop={10}
                style={styles.balanceContainer}
                onPress={() => {
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut,
                  );
                  setShowRecentExchange(!showRecentExchange);
                }}>
                <Text style={styles.balanceTxt}>
                  {language.titleRecentExchange}
                </Text>

                <Feather
                  name={showRecentExchange ? 'chevron-up' : 'chevron-down'}
                  size={25}
                  color={ColorCustom.green}
                />
              </Pressable>

              {showRecentExchange && (
                <>
                  <View style={styles.balanceDivider} />
                  {/*List Detail */}
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={true}
                    nestedScrollEnabled={true}
                    style={{
                      height:
                        [...EXCHANGE_RECENT.income, ...EXCHANGE_RECENT.outcome]
                          .length > 6
                          ? 360
                          : [
                              ...EXCHANGE_RECENT.income,
                              ...EXCHANGE_RECENT.outcome,
                            ].length * 60,
                    }}>
                    {[
                      ...EXCHANGE_RECENT.income,
                      ...EXCHANGE_RECENT.outcome,
                    ].map((statistic, index) => {
                      return (
                        <View
                          key={index}
                          style={[
                            styles.balanceContainer,
                            {
                              paddingVertical: 10,
                            },
                          ]}>
                          <View
                            style={[
                              styles.icon,
                              {
                                backgroundColor: statistic.color,
                              },
                            ]}>
                            <FontAwesome
                              name={statistic.iconName}
                              size={23}
                              color={'white'}
                            />
                          </View>
                          <Text
                            style={[
                              styles.iconName,
                              {
                                flex: 1,
                                paddingLeft: 20,
                              },
                            ]}
                            numberOfLines={1}>
                            {userSetting.language === 'English'
                              ? statistic.name.EN
                              : statistic.name.VN}
                          </Text>

                          <Text
                            style={[
                              styles.iconMoney,
                              {
                                flex: 1,
                                textAlign: 'right',
                                color:
                                  statistic.isIncome === 'Income'
                                    ? ColorCustom.blue
                                    : ColorCustom.orange,
                              },
                            ]}>
                            {statistic.value} {WALLETS[0].currency}
                          </Text>
                        </View>
                      );
                    })}
                  </ScrollView>
                </>
              )}
            </View>

            {/*Plan */}
            <View style={styles.headerContainer}>
              {/*Exchange Header */}
              <Pressable
                style={styles.balanceContainer}
                onPress={() => {
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut,
                  );
                  setShowPlan(!showPlan);
                }}>
                <Text
                  style={{
                    fontFamily: FONT_FAMILY.Medium,
                    fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                    color: ColorCustom.green,
                  }}>
                  {language.titlePlan}
                </Text>
                <Feather
                  name={showPlan ? 'chevron-up' : 'chevron-down'}
                  size={25}
                  color={ColorCustom.green}
                />
              </Pressable>

              {showPlan && (
                <>
                  <View style={styles.balanceDivider} />
                  {/*List Detail */}
                  <ScrollView
                    removeClippedSubviews
                    nestedScrollEnabled={true}
                    renderToHardwareTextureAndroid
                    showsVerticalScrollIndicator={false}
                    style={{
                      height: PLANS.length > 4 ? 4 * 122 : PLANS.length * 122,
                    }}>
                    {PLANS.map((plan, index) => {
                      return (
                        <SwiperCard
                          key={index}
                          width={'100%'}
                          isIncome={plan.isIncomePlan}
                          title={plan.planName}
                          pressType={type}
                          setPressType={setType}
                          onPress={() => {}}
                          status={plan.isIncomePlan}
                          dateStart={plan.dateStart}
                          percent={((plan.current / plan.budget) * 100).toFixed(
                            0,
                          )}
                          current={plan.current}
                          budget={plan.budget}
                          currency={plan.currency}
                          language={
                            plan.isIncomePlan
                              ? EN_LANGUAGE.planStatus.income
                              : EN_LANGUAGE.planStatus.outcome
                          }
                          isSwipe={false}
                          navigation={navigation}
                        />
                      );
                    })}
                  </ScrollView>
                </>
              )}
            </View>
          </View>
        </ScrollView>
        {btnPressable()}
      </View>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  body: {
    flex: 1,
    marginHorizontal: 10,
  },
  headerContainer: {
    width: '100%',
    borderWidth: 1,
    marginVertical: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderColor: ColorCustom.green,
    borderRadius: 10,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  balanceTxt: {
    fontFamily: FONT_FAMILY.Medium,
    fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
    color: ColorCustom.green,
  },
  balanceTxtMoney: {
    fontFamily: FONT_FAMILY.Medium,
    fontSize: 20,
    color: ColorCustom.black,
  },
  balanceDivider: {
    width: '100%',
    height: 1,
    backgroundColor: ColorCustom.green,
    marginVertical: 5,
  },
  balanceContainerPress: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  balancePress: {
    height: 35,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderColor: ColorCustom.orange,
    width: 115,
  },
  balanceTxtPress: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: FONT_SIZE.TXT_SMALL_SIZE,
    color: ColorCustom.orange,
  },
  txtDate: {
    textAlign: 'center',
    fontFamily: FONT_FAMILY.Regular,
    fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
    color: ColorCustom.black,
    marginVertical: 5,
  },
  txtTitle: {
    fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
    fontFamily: FONT_FAMILY.Bold,
  },
  icon: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  iconName: {
    textAlign: 'left',
    fontSize: FONT_SIZE.TXT_SMALL_SIZE,
    width: '30%',
    fontFamily: FONT_FAMILY.Regular,
    color: ColorCustom.black,
  },
  iconPercent: {
    textAlign: 'justify',
    width: '20%',
    fontSize: FONT_SIZE.TXT_SMALL_SIZE,
    fontFamily: FONT_FAMILY.Regular,
    color: ColorCustom.orange,
  },
  iconMoney: {
    fontSize: FONT_SIZE.TXT_SMALL_SIZE,
    fontFamily: FONT_FAMILY.Regular,
    color: ColorCustom.black,
  },
  txtWalletName: {
    fontSize: FONT_SIZE.TXT_SIZE,
    fontFamily: FONT_FAMILY.Regular,
    color: ColorCustom.black,
    maxWidth: '35%',
  },
  btnTrash: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 10,
    marginLeft: 10,
    borderColor: ColorCustom.gray,
  },
  presable: {
    width: 60,
    height: 60,
    borderRadius: 60,
    position: 'absolute',
    backgroundColor: ColorCustom.green,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
});
export default Overview;
