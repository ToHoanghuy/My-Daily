import {
  View,
  Text,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback} from 'react';
import BarChart from '../../../CustomComponents/ChartComponent/BarChart';
import ColorCustom from '../../../Assets/Constants/ColorCustom';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {styles, sumStatistics} from './Statistic';
import {
  getDataMonth,
  getIncome,
  getOutcome,
} from '../../../Assets/FunctionCompute/GetData';
import {useDispatch, useSelector} from 'react-redux';
import {uploadMonthIO} from '../../../../ReduxToolKit/Slices/StatisticSlice';
import {useReducer} from 'react';
import {MONTHS} from '../../../Assets/Data/Months';
import NoDataFond from '../../../CustomComponents/NoDataFond';
import {useEffect} from 'react';
import {store} from '../../../../ReduxToolKit/Store';
const {width} = Dimensions.get('screen');
const BAR_PRESS = 'BAR_PRESS';
const LOADING = 'LOADING';
const FINISH = 'FINISH';
const handleBarChart = (state, action) => {
  switch (action.type) {
    case BAR_PRESS:
      return {
        ...state,
        barPress: action.payload,
      };
    case LOADING:
      return {
        ...state,
        loadingPress: true,
      };
    case FINISH:
      return {
        ...state,
        loadingPress: false,
      };
    default:
      break;
  }
};

const General = ({
  languageIncome,
  languageOutcome,
  language,
  typeStatistic,
  data,
  yearPress,
  month,
  currency,
  WALLET,
}) => {
  const [state, dispatchReducer] = useReducer(handleBarChart, {
    barPress: null,
    loadingPress: false,
  });
  const listStatistics = useSelector(state => state.Statistics).month;
  const uid = useSelector(state => state.UserSetting).id;
  const dispatch = useDispatch();
  const render_Statistic_General = ({item, index}) => {
    return (
      <View key={index} style={styles.item}>
        <View
          style={[
            styles.item_icon,
            {
              backgroundColor: item.color,
            },
          ]}>
          <FontAwesome name={item.iconName} size={23} color={'white'} />
        </View>
        <Text style={styles.item_name} numberOfLines={1}>
          {language === 'English' ? item.name.EN : item.name.VN}
        </Text>
        {typeStatistic !== 'Year' && (
          <Text style={styles.item_percent}>
            {
              +(
                (item.value /
                  sumStatistics(
                    item.isIncome === 'Income'
                      ? listStatistics.income
                      : listStatistics.outcome,
                  )) *
                100
              ).toFixed(2)
            }{' '}
            %
          </Text>
        )}
        <Text style={styles.item_money}>
          {item.value} {currency}
        </Text>
      </View>
    );
  };
  useEffect(() => {
    dispatchReducer({type: BAR_PRESS, payload: null});
  }, [typeStatistic]);
  const onBarPress = bar => {
    let tmpMonth = '';
    let tmpDate = '';
    if (bar.month.toString().includes('/')) {
      tmpMonth = bar.month.split('/')[1];
      tmpDate = bar.month.split('/')[0];
    } else {
      tmpMonth = bar.month;
    }
    dispatchReducer({type: LOADING});
    dispatchReducer({type: BAR_PRESS, payload: bar});
    if (typeStatistic === 'Year' || typeStatistic === 'Quarter') {
      getDataMonth(uid, yearPress, tmpMonth, WALLET).then(statisMonth => {
        dispatch(uploadMonthIO(statisMonth));
        dispatchReducer({type: FINISH});
      });
    } else {
      let tmp = {};
      dispatchReducer({type: LOADING});
      Promise.all([
        getIncome(uid, WALLET, yearPress, tmpMonth, tmpDate).then(
          value => (tmp.income = value),
        ),
        getOutcome(uid, WALLET, yearPress, tmpMonth, tmpDate).then(
          value => (tmp.outcome = value),
        ),
      ]).then(() => {
        dispatch(uploadMonthIO(tmp));
        dispatchReducer({type: FINISH});
      });
    }
  };
  const txtView = useCallback(() => {
    if (language === 'English') {
      if (typeStatistic === 'Year' || typeStatistic === 'Quarter') {
        return MONTHS[state.barPress?.month - 1];
      }
      return `Day ${state.barPress?.month}`;
    } else {
      if (typeStatistic === 'Year' || typeStatistic === 'Quarter') {
        return `Tháng ${state.barPress?.month}`;
      }
    }
    return `Ngày ${state.barPress?.month}`;
  }, [state.barPress, language]);
  if (data.length === 0) {
    return (
      <View
        style={{
          width,
        }}>
        <NoDataFond widthImage={150} heightImage={150} fontSize={18} />
      </View>
    );
  }
  return (
    <View
      style={{
        width,
      }}>
      <BarChart
        typeStatistic={typeStatistic}
        data={data}
        itemPress={state.barPress}
        setItemPress={onBarPress}
        barColorIncome={ColorCustom.blue}
        barColorOutcome={ColorCustom.orange}
        barRadius={0}
        legendIncome={languageIncome}
        legendOutcome={languageOutcome}
        language={language}
        title_xAxis={language === 'English' ? 'Month' : 'Tháng'}
        title_yAxis={store.getState().Wallet[0].currency}
      />
      {state.barPress !== null && (
        <>
          <View style={styles.bar_txt_view}>
            <Text style={styles.bar_txt}>{txtView()}</Text>
          </View>
          <View style={styles.bar_container}>
            <View style={styles.list_btns}>
              <Text
                style={[
                  styles.modal_txt_press,
                  {
                    color: ColorCustom.orange,
                  },
                ]}>
                {languageOutcome}
              </Text>

              <Text
                style={[
                  styles.modal_txt_press,
                  {
                    color: ColorCustom.orange,
                  },
                ]}>
                {state.barPress.valueOutcome} {currency}
              </Text>
            </View>

            <View style={styles.divider} />
            {state.loadingPress == true ? (
              <ActivityIndicator color={ColorCustom.orange} size={'large'} />
            ) : (
              <FlatList
                data={listStatistics.outcome}
                renderItem={render_Statistic_General}
                nestedScrollEnabled
                style={
                  listStatistics.outcome.length > 4 && {
                    height: 60 * 4,
                  }
                }
                ListEmptyComponent={
                  <Text style={[styles.btn_txt, {color: ColorCustom.gray}]}>
                    {language === 'English'
                      ? "Don't have data"
                      : 'Không có dữ liệu'}
                  </Text>
                }
                getItemLayout={(_, index) => ({
                  length: 60,
                  offset: 60 * index,
                  index,
                })}
                removeClippedSubviews={true}
              />
            )}
          </View>
          <View style={[styles.bar_container, {borderColor: ColorCustom.blue}]}>
            <View style={styles.list_btns}>
              <Text
                style={[
                  styles.modal_txt_press,
                  {
                    color: ColorCustom.blue,
                  },
                ]}>
                {languageIncome}
              </Text>

              <Text
                style={[
                  styles.modal_txt_press,
                  {
                    color: ColorCustom.blue,
                  },
                ]}>
                {state.barPress.valueIncome} {currency}
              </Text>
            </View>

            <View style={styles.divider} />
            {state.loadingPress == true ? (
              <ActivityIndicator color={ColorCustom.blue} size={'large'} />
            ) : (
              <FlatList
                data={listStatistics.income}
                renderItem={render_Statistic_General}
                getItemLayout={(_, index) => ({
                  length: 60,
                  offset: 60 * index,
                  index,
                })}
                style={
                  listStatistics.income.length > 4 && {
                    height: 60 * 4,
                  }
                }
                nestedScrollEnabled
                removeClippedSubviews={true}
                ListEmptyComponent={
                  <Text style={[styles.btn_txt, {color: ColorCustom.gray}]}>
                    {language === 'English'
                      ? "Don't have data"
                      : 'Không có dữ liệu'}
                  </Text>
                }
              />
            )}
          </View>
        </>
      )}
    </View>
  );
};

export default General;
