import {View, Image, Dimensions, Animated, Easing} from 'react-native';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useEffect, useRef} from 'react';
import ColorCustom from '../../Assets/Constants/ColorCustom';
import {useDispatch} from 'react-redux';
import {
  getDataWallet,
  getAllPlan,
  getNotification,
  getYears,
  getMonths,
  getDataMonth,
  getDataExchange,
} from '../../Assets/FunctionCompute/GetData';
import {uploadPlan} from '../../../ReduxToolKit/Slices/Plan_Data';
import {loadDataWallet} from '../../../ReduxToolKit/Slices/WalletSlice';
import {uploadNotification} from '../../../ReduxToolKit/Slices/NotificationSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {collection, doc, updateDoc, getDocs, getDoc} from 'firebase/firestore';
import {auth, db} from '../../../Firebase/Firebase';
import {changeTouch} from '../../../ReduxToolKit/Slices/UserSetting';
import {uploadDataExchange} from '../../../ReduxToolKit/Slices/ExchangeRecentSlice';
import {uploadDataMonth} from '../../../ReduxToolKit/Slices/StatisticSlice';
import {updateLink} from '../../../ReduxToolKit/Slices/LinkAPISlice';
const {width, height} = Dimensions.get('screen');
const OnBoarding = ({navigation}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (auth.currentUser) {
      const collectData = async () => {
        const id = await AsyncStorage.getItem('UserID');
        if (id === null) {
          await updateDoc(doc(db, `/USER/${auth.currentUser.uid}`), {
            isTouch: false,
          });
          dispatch(changeTouch(false));
        }
        const getLink = await getDoc(doc(db, '/API/currency'));
        if (getLink.exists()) {
          dispatch(updateLink(getLink.data().link));
        }
        const getNotify = await getDocs(
          collection(db, `/USER/${auth.currentUser.uid}/Notification`),
        );
        const getPlan = await getDocs(
          collection(db, `/USER/${auth.currentUser.uid}/Plan`),
        );
        if (getNotify.empty && getPlan.empty) {
          await Promise.all([
            getDataWallet(auth.currentUser.uid).then(data => {
              getYears(
                auth.currentUser.uid,
                data[0].name,
                new Date().getFullYear(),
              ).then(year => {
                if (year) {
                  getMonths(
                    auth.currentUser.uid,
                    data[0].name,
                    year.year,
                    1,
                    12,
                    1,
                    'desc',
                  ).then(dataMonth => {
                    if (dataMonth.length !== 0) {
                      getDataMonth(
                        auth.currentUser.uid,
                        year.year,
                        dataMonth[0].month,
                        data[0].name,
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
                  });
                } else {
                  dispatch(uploadDataMonth(null));
                }
              });
              getDataExchange(auth.currentUser.uid, data[0].name).then(
                value => {
                  dispatch(uploadDataExchange(value));
                },
              );
              dispatch(loadDataWallet(data));
            }),
          ]).then(() => {
            navigation.reset({
              index: 0,
              routes: [{name: 'OverViewScreen'}],
            });
          });
        } else if (getPlan.empty) {
          await Promise.all([
            getDataWallet(auth.currentUser.uid).then(data => {
              getYears(
                auth.currentUser.uid,
                data[0].name,
                new Date().getFullYear(),
              ).then(year => {
                if (year) {
                  getMonths(
                    auth.currentUser.uid,
                    data[0].name,
                    year.year,
                    1,
                    12,
                    1,
                    'desc',
                  ).then(dataMonth => {
                    if (dataMonth.length !== 0) {
                      getDataMonth(
                        auth.currentUser.uid,
                        year.year,
                        dataMonth[0].month,
                        data[0].name,
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
                  });
                } else {
                  dispatch(uploadDataMonth(null));
                }
              });
              getDataExchange(auth.currentUser.uid, data[0].name).then(
                value => {
                  dispatch(uploadDataExchange(value));
                },
              );
              dispatch(loadDataWallet(data));
            }),
            getNotification(auth.currentUser.uid).then(value => {
              dispatch(uploadNotification(value));
            }),
          ]).then(() => {
            navigation.reset({
              index: 0,
              routes: [{name: 'OverViewScreen'}],
            });
          });
        } else if (getNotify.empty) {
          await Promise.all([
            getDataWallet(auth.currentUser.uid).then(data => {
              getYears(
                auth.currentUser.uid,
                data[0].name,
                new Date().getFullYear(),
              ).then(year => {
                if (year) {
                  getMonths(
                    auth.currentUser.uid,
                    data[0].name,
                    year.year,
                    1,
                    12,
                    1,
                    'desc',
                  ).then(dataMonth => {
                    if (dataMonth.length !== 0) {
                      getDataMonth(
                        auth.currentUser.uid,
                        year.year,
                        dataMonth[0].month,
                        data[0].name,
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
                  });
                } else {
                  dispatch(uploadDataMonth(null));
                }
              });
              getDataExchange(auth.currentUser.uid, data[0].name).then(
                value => {
                  dispatch(uploadDataExchange(value));
                },
              );
              dispatch(loadDataWallet(data));
            }),
            getAllPlan(auth.currentUser.uid).then(data =>
              dispatch(uploadPlan(data)),
            ),
          ]).then(() => {
            navigation.reset({
              index: 0,
              routes: [{name: 'OverViewScreen'}],
            });
          });
        } else {
          await Promise.all([
            getDataWallet(auth.currentUser.uid).then(data => {
              getYears(
                auth.currentUser.uid,
                data[0].name,
                new Date().getFullYear(),
              ).then(year => {
                if (year) {
                  getMonths(
                    auth.currentUser.uid,
                    data[0].name,
                    year.year,
                    1,
                    12,
                    1,
                    'desc',
                  ).then(dataMonth => {
                    if (dataMonth.length !== 0) {
                      getDataMonth(
                        auth.currentUser.uid,
                        year.year,
                        dataMonth[0].month,
                        data[0].name,
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
                  });
                } else {
                  dispatch(uploadDataMonth(null));
                }
              });
              getDataExchange(auth.currentUser.uid, data[0].name).then(
                value => {
                  dispatch(uploadDataExchange(value));
                },
              );
              dispatch(loadDataWallet(data));
            }),
            getNotification(auth.currentUser.uid).then(value => {
              dispatch(uploadNotification(value));
            }),
            getAllPlan(auth.currentUser.uid).then(data =>
              dispatch(uploadPlan(data)),
            ),
          ]).then(() => {
            navigation.reset({
              index: 0,
              routes: [{name: 'OverViewScreen'}],
            });
          });
        }
      };

      collectData();
    }
  }, []);

  const animatedValue = [...new Array(3)].map(
    () => useRef(new Animated.Value(20)).current,
  );
  useEffect(() => {
    const animations = [...new Array(3)].map((item, index) => {
      return Animated.sequence([
        Animated.timing(animatedValue[index], {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.cubic,
        }),
        Animated.timing(animatedValue[index], {
          toValue: 20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]);
    });
    Animated.loop(Animated.stagger(150, animations)).start();
  }, []);
  return (
    <View style={styles.view}>
      <Image
        source={require('../../Assets/Images/Logo.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={{position: 'absolute', bottom: height * 0.2}}>
        <View style={{flexDirection: 'row'}}>
          {[...new Array(3)].map((_, index) => {
            return (
              <Animated.View
                style={[
                  {transform: [{translateY: animatedValue[index]}]},
                  styles.circle,
                ]}
                key={index}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width * 0.8,
    height: height * 0.5,
  },
  circle: {
    width: 15,
    height: 15,
    borderRadius: 100,
    backgroundColor: ColorCustom.green,
    marginHorizontal: 7,
  },
});

export default OnBoarding;
