import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useReducer,
} from 'react';
import {collection, getDocs} from 'firebase/firestore';
import {db} from '../../../../Firebase/Firebase';
import HeaderDrawer from '../../../CustomComponents/HeaderDrawer';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Menu from '../../../CustomComponents/Menu';
import {useSelector, useDispatch} from 'react-redux';
import {EN_LANGUAGE, VN_LANGUAGE} from '../../../Assets/Data/Language';
import SwiperCard from '../../../CustomComponents/SwiperCard';
import ColorCustom from '../../../Assets/Constants/ColorCustom';
import Calendar from '../../../CustomComponents/CalendarComponent/Calendar';
import {FONT_FAMILY, FONT_SIZE} from '../../../Assets/Constants/FontCustom';
import dayjs from 'dayjs';
import {deletePlan} from '../../../../ReduxToolKit/Slices/Plan_Data';
import AlertComponent from '../../../CustomComponents/AlertComponent';
import {deleteDataPlan} from '../../../Assets/FunctionCompute/DeleteData';
import ModalPlan from './ModalPlan';
import {useNetInfo} from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
const FINISH_LOADSCREEN = 'FINISH_LOADSCREEN';
const LOAD_PLAN = 'LOAD_PLAN';
const PlanReducer = (state, action) => {
  switch (action.type) {
    case FINISH_LOADSCREEN:
      return {
        ...state,
        loadingScreen: false,
      };
    case LOAD_PLAN:
      return {
        ...state,
        ListPlan: [...action.payload],
      };
    default:
      break;
  }
};
const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const Planning = ({navigation}) => {
  const netInfo = useNetInfo();
  const PlanData = useSelector(state => state.PlanData);
  const curSetting = useSelector(state => state.UserSetting);
  const [state, dispatchReducer] = useReducer(PlanReducer, {
    loadingScreen: true,
    ListPlan: PlanData,
  });
  const [openModal, setOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState(null); // typeModal = {"Add", "Details", "Edit", "Remove"}
  const uid = useSelector(state => state.UserSetting).id;
  const dispatch = useDispatch();
  const language = useMemo(
    () => (curSetting.language === 'English' ? EN_LANGUAGE : VN_LANGUAGE),
    [curSetting.language],
  );
  const WALLET = useSelector(state => state.Wallet)[0].currency;
  const {planning: languagePlan} = language;
  const {modal: languageAlert} = language;
  const [drawerHeight, setDrawerHeight] = useState(0);
  const [open, setOpen] = useState(false);
  const [dateType, setDateType] = useState('Start');
  const [openCalendar, setOpenCalendar] = useState(false);
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [planName, setPlanName] = useState('');
  const [budget, setBudget] = useState(0);
  const [errorType, setErrorType] = useState(null);
  const [errorDate, setErrorDate] = useState(null);
  const [currency, setCurrency] = useState(WALLET);
  const [dataEdit, setDataEdit] = useState({});
  const [openAlert, setOpenAlert] = useState(false);
  const [alertType, setAlertType] = useState(null);
  const [menuType, setMenuType] = useState('All');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const onSwiperPress = useCallback(item => {
    setDataEdit({...item});
    setPlanName(item.planName);
    setBudget(String(item.budget));
    setDateStart(item.dateStart);
    setDateEnd(item.dateFinish);
  }, []);
  const getHistory = async id => {
    let tmp = [];
    setLoading(true);
    const snapShot = await getDocs(
      collection(db, `/USER/${uid}/Plan/${id}/History`),
    );
    if (!snapShot.empty) {
      snapShot.forEach(d => tmp.push(d.data()));
      setHistory([...tmp]);
    }
  };

  useEffect(() => {
    if (typeModal === 'Add' || typeModal === 'Edit') {
      setOpenModal(true);
      return;
    }
    if (typeModal === 'Details') {
      if (netInfo.isConnected) {
        getHistory(dataEdit.planId).then(() => setLoading(false));
      }
      setOpenModal(true);
      return;
    }
    if (typeModal === 'Remove') {
      setOpenAlert(true);
      setAlertType(1);
      return;
    }
  }, [typeModal, netInfo.isConnected]);
  useEffect(() => {
    if (menuType === 'All') {
      dispatchReducer({type: LOAD_PLAN, payload: PlanData});
    }
    if (menuType === 'Ongoing') {
      dispatchReducer({
        type: LOAD_PLAN,
        payload: PlanData.filter(
          plan =>
            new Date(plan.dateStart).getTime() < new Date().getTime() &&
            (new Date(plan.dateFinish).getTime() > new Date().getTime() ||
              new Date(plan.dateFinish).toDateString() ===
                new Date().toDateString()),
        ),
      });
    }
    if (menuType === 'Finish') {
      dispatchReducer({
        type: LOAD_PLAN,
        payload: PlanData.filter(
          plan =>
            new Date(plan.dateFinish).getTime() < new Date().getTime() &&
            new Date(plan.dateFinish).toDateString() !==
              new Date().toDateString(),
        ),
      });
    }
  }, [PlanData, menuType]);

  const onClear = useCallback(() => {
    setPlanName('');
    setBudget(0);
    setDateStart(new Date());
    setDateEnd(new Date());
    setOpenModal(false);
    setErrorType(null);
    setErrorDate(null);
    setTypeModal(null);
    setAlertType(null);
    setHistory([]);
    setCurrency(WALLET);
  }, []);
  const onDelete = async () => {
    // if (dataEdit.isIncomePlan) {
    //   await notifee.cancelTriggerNotification(dataEdit.planId);
    // }
    setAlertType(2);
    dispatch(deletePlan(dataEdit.planId));
    if (netInfo.isConnected) {
      deleteDataPlan(uid, dataEdit.planId);
    } else {
      let DeleteNoInternet = JSON.parse(
        await AsyncStorage.getItem('DELETE_PLAN_NO_INTERNET'),
      );
      if (DeleteNoInternet) {
        DeleteNoInternet.push(dataEdit.planId);
      } else {
        DeleteNoInternet = [dataEdit.planId];
      }
      await AsyncStorage.setItem(
        'DELETE_PLAN_NO_INTERNET',
        JSON.stringify(DeleteNoInternet),
      );
    }
  };
  useEffect(() => {
    const RemovePlanDB = async () => {
      const DeleteNoInternet = JSON.parse(
        await AsyncStorage.getItem('DELETE_PLAN_NO_INTERNET'),
      );
      if (netInfo.isConnected && DeleteNoInternet) {
        DeleteNoInternet.forEach(d => {
          deleteDataPlan(uid, d);
        });
        AsyncStorage.removeItem('DELETE_PLAN_NO_INTERNET');
      }
    };
    RemovePlanDB();
  }, [netInfo.isConnected]);
  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <SwiperCard
          key={index}
          width={'100%'}
          isIncome={item.isIncomePlan}
          title={item.planName}
          setPressType={setTypeModal}
          onPress={() => onSwiperPress(item)}
          dateStart={dayjs(item.dateStart).format('YYYY-MM-DD')}
          dateEnd={dayjs(item.dateFinish).format('YYYY-MM-DD')}
          percent={((item.current / item.budget) * 100).toFixed(0)}
          current={item.current}
          budget={item.budget}
          currency={item.currency}
          navigation={navigation}
          language={
            item.isIncomePlan
              ? languagePlan.incomeStatus
              : languagePlan.outcomeStatus
          }
        />
      );
    },
    [PlanData],
  );
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: ColorCustom.white,
      }}
      onLayout={() => {
        dispatchReducer({type: FINISH_LOADSCREEN});
      }}>
      {alertType === 2 && (
        <AlertComponent
          title={languageAlert.successDelete.header}
          open={openAlert}
          setOpen={setOpenAlert}
          type={'SUCCESS'}
          subtitle={languageAlert.successDelete.subHeader}
          buttonList={[
            {
              txt: languageAlert.successDelete.btnDone,
              onPress: onClear,
            },
          ]}
        />
      )}
      {alertType === 1 && (
        <AlertComponent
          title={languageAlert.alertDelete.header}
          open={openAlert}
          setOpen={setOpenAlert}
          type={'ALERT'}
          subtitle={languageAlert.alertDelete.subHeader}
          disableBackDrop={true}
          buttonList={[
            {
              txt: languageAlert.alertDelete.btnNo,
              onPress: onClear,
            },
            {
              txt: languageAlert.alertDelete.btnYes,
              onPress: onDelete,
            },
          ]}
        />
      )}
      <HeaderDrawer
        title={'Planning'}
        isSetting={true}
        setDrawerHeight={setDrawerHeight}
        onPressLeft={() => {
          navigation.openDrawer();
        }}
        buttonList={[
          {
            icon_type: Feather,
            icon_name: 'edit',
            onPress: () => setTypeModal('Add'),
          },
          {
            icon_type: Entypo,
            icon_name: 'dots-three-vertical',
            onPress: () => {
              setOpen(true);
            },
          },
        ]}
      />
      {state.loadingScreen ? (
        <View style={{width: '100%'}}>
          <ActivityIndicator color={ColorCustom.green} size={'large'} />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
          }}>
          <FlatList
            data={state.ListPlan}
            renderItem={renderItem}
            renderToHardwareTextureAndroid
            showsVerticalScrollIndicator={true}
            initialNumToRender={10}
            getItemLayout={(_, index) => ({
              length: 60,
              offset: 60 * index,
              index,
            })}
            ListEmptyComponent={() => (
              <View style={{alignItems: 'center', marginTop: 20}}>
                <Text style={[styles.header_text, {color: ColorCustom.gray}]}>
                  {language === EN_LANGUAGE
                    ? `There is no plan`
                    : `Chưa có kế hoạch nào được thiết lập`}
                </Text>
              </View>
            )}
          />
        </View>
      )}
      <View
        style={{
          width: '100%',
        }}>
        {netInfo.isConnected === true && (
          <BannerAd
            unitId={adUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        )}
      </View>
      <Menu
        open={open}
        setOpen={setOpen}
        drawerHeight={drawerHeight}
        btnList={[
          {
            title: languagePlan.btnAll,
            onPress: () => setMenuType('All'),
          },
          {
            title: languagePlan.btnOngoing,
            onPress: () => setMenuType('Ongoing'),
          },
          {
            title: languagePlan.btnFinished,
            onPress: () => setMenuType('Finish'),
          },
        ]}
      />
      <ModalPlan
        openModal={openModal}
        onClear={onClear}
        typeModal={typeModal}
        languagePlan={languagePlan}
        errorType={errorType}
        setErrorType={setErrorType}
        setErrorDate={setErrorDate}
        errorDate={errorDate}
        planName={planName}
        setPlanName={setPlanName}
        budget={budget}
        setBudget={setBudget}
        currency={currency}
        setCurrency={setCurrency}
        dateStart={dateStart}
        dateEnd={dateEnd}
        dataEdit={dataEdit}
        setDateType={setDateType}
        setOpenCalendar={setOpenCalendar}
        history={history}
        loading={loading}
      />
      <Calendar
        open={openCalendar}
        setOpen={setOpenCalendar}
        setDatePicker={dateType === 'Start' ? setDateStart : setDateEnd}
        language={curSetting.language}
        enablePast={false}
        FromDate={typeModal === 'Add' ? new Date() : dataEdit?.dateFinish}
      />
    </View>
  );
};
export const styles = StyleSheet.create({
  text: {
    color: ColorCustom.middleGrey,
    fontSize: 15,
    fontFamily: FONT_FAMILY.Regular,
  },
  header_text: {
    color: ColorCustom.black,
    fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
    fontFamily: FONT_FAMILY.Medium,
  },
  textinput: {
    width: '100%',
    borderColor: ColorCustom.middleGrey,
    borderWidth: 1,
    borderRadius: 15,
    color: ColorCustom.black,
    fontFamily: FONT_FAMILY.Regular,
    paddingHorizontal: 10,
  },
  textinput_small: {
    width: '80%',
    color: ColorCustom.black,
    fontFamily: FONT_FAMILY.Regular,
  },
  pressable: {
    borderRadius: 10,
    borderWidth: 1.5,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  row: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  textinput_container: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: ColorCustom.middleGrey,
  },
  modal_container: {
    backgroundColor: ColorCustom.white,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  error_txt: {
    color: 'red',
    fontFamily: FONT_FAMILY.Regular,
    fontSize: FONT_SIZE.TXT_SMALLEST_SIZE,
  },
  currency_dropdown: {
    zIndex: 10,
    marginTop: 10,
    marginRight: 10,
  },
  /* edit style */
  txt_left: {
    flex: 1.5,
  },
  txt_right: {
    flex: 2,
    color: ColorCustom.black,
  },
  /* detail style */
  errorDate: {
    borderWidth: 0,
    marginTop: 2,
    justifyContent: 'flex-start',
  },
  row_space: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
});
export default Planning;
