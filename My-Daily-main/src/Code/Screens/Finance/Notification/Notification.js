import {
  View,
  FlatList,
  ActivityIndicator,
  ToastAndroid,
  Text,
} from 'react-native';
import React, {useState} from 'react';
import HeaderDrawer from '../../../CustomComponents/HeaderDrawer';
import Entypo from 'react-native-vector-icons/Entypo';
import Menu from '../../../CustomComponents/Menu';
import {useDispatch, useSelector} from 'react-redux';
import {useMemo} from 'react';
import {EN_LANGUAGE, VN_LANGUAGE} from '../../../Assets/Data/Language';
import {useCallback} from 'react';
import NotificationCard from '../../../CustomComponents/NotificationCard';
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import {db} from '../../../../Firebase/Firebase';
import {
  addNewNotificationToRedux,
  deleteNotification,
  uploadNotification,
} from '../../../../ReduxToolKit/Slices/NotificationSlice';
import ColorCustom from '../../../Assets/Constants/ColorCustom';
import {getNotification} from '../../../Assets/FunctionCompute/GetData';
import {useRef} from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import {FONT_FAMILY} from '../../../Assets/Constants/FontCustom';

const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

export const convertTimestamptToDate = value => {
  return new Date(value.seconds * 1000 + value.nanoseconds / 1000000);
};

const Notification = ({navigation}) => {
  const curSetting = useSelector(state => state.UserSetting);
  const NOTIFICATION = useSelector(state => state.Notification);
  const preLength = useRef(0);
  const [loading, setLoading] = useState(false);
  const netifo = useNetInfo();
  const uid = useSelector(state => state.UserSetting).id;
  const language = useMemo(
    () =>
      curSetting.language === 'English'
        ? EN_LANGUAGE.notification
        : VN_LANGUAGE.notification,
    [curSetting.language],
  );
  const [drawerHeight, setDrawerHeight] = useState(0);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const onDeleteDoc = async id => {
    if (netifo.isConnected === true) {
      dispatch(deleteNotification(id));
      await deleteDoc(doc(db, `/USER/${uid}/Notification/${id}`));
    }
    if (netifo.isConnected === false) {
      ToastAndroid.show(
        curSetting.language === 'English'
          ? 'Your internet is occuring a problem'
          : 'Mất kết nối internet',
        ToastAndroid.LONG,
      );
    }
  };
  const onDeleteAll = async () => {
    const getNotify = await getDocs(
      collection(db, `/USER/${uid}/Notification/`),
    );
    getNotify.forEach(async item => {
      await deleteDoc(doc(db, `/USER/${uid}/Notification/${item.id}`));
    });
    dispatch(uploadNotification([]));
  };
  const renderNotification = ({item, index}) => {
    return (
      <NotificationCard
        key={index}
        width={'100%'}
        onPress={() => {
          onDeleteDoc(item.id);
        }}
        dateNotice={convertTimestamptToDate(item.value.date)}
        title={item.value.title}
        subtitle={item.value.subTitle}
      />
    );
  };
  const getMoreData = useCallback(async () => {
    if (netifo.isConnected === true) {
      preLength.current = NOTIFICATION.length;
      const end = await getDoc(
        doc(
          db,
          `/USER/${uid}/Notification/${
            NOTIFICATION[NOTIFICATION.length - 1].id
          }`,
        ),
      );
      getNotification(uid, end).then(data => {
        //console.log('asd', NOTIFICATION.length, data.length);
        dispatch(addNewNotificationToRedux(data));
      });
    }
    setLoading(false);
  }, [loading, NOTIFICATION]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <HeaderDrawer
        title={language.header}
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
              if (netifo.isConnected === true) {
                setOpen(true);
              }
              if (netifo.isConnected === false) {
                ToastAndroid.show(
                  curSetting.language === 'English'
                    ? 'Your internet is occuring a problem'
                    : 'Mất kết nối internet',
                  ToastAndroid.LONG,
                );
              }
            },
          },
        ]}
      />
      <FlatList
        data={NOTIFICATION}
        renderItem={renderNotification}
        removeClippedSubviews={true}
        renderToHardwareTextureAndroid
        getItemLayout={(_, index) => ({
          length: 107,
          offset: 107 * index,
          index,
        })}
        onEndReached={() => {
          if (loading === false && NOTIFICATION.length !== preLength.current) {
            setLoading(true);
            getMoreData();
          }
        }}
        ListEmptyComponent={
          <Text
            style={{
              fontSize: FONT_FAMILY.Medium,
              fontSize: 18,
              textAlign: 'center',
              marginTop: 20,
            }}>
            {curSetting.language == 'Empty'
              ? "There isn't notification"
              : 'Chưa có thông báo nào'}
          </Text>
        }
        onEndReachedThreshold={0.2}
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
      {loading && (
        <ActivityIndicator color={ColorCustom.green} size={'large'} />
      )}
      <Menu
        open={open}
        setOpen={setOpen}
        drawerHeight={drawerHeight}
        btnList={[{title: language.btnClearAll, onPress: onDeleteAll}]}
      />
    </View>
  );
};

export default Notification;
