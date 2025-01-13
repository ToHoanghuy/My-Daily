import {
  View,
  Text,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import LineChart from '../../../CustomComponents/ChartComponent/LineChart';
import {styles, sumStatistics} from './Statistic';
import PieChart from '../../../CustomComponents/ChartComponent/PieChart';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ColorCustom from '../../../Assets/Constants/ColorCustom';
import {useDispatch, useSelector} from 'react-redux';
import {useReducer} from 'react';
import {
  getDataMonthOutcome,
  normalize,
} from '../../../Assets/FunctionCompute/GetData';
import {uploadMonthOutcome} from '../../../../ReduxToolKit/Slices/StatisticSlice';
import {MONTHS, QUARTER_TXT} from '../../../Assets/Data/Months';
import NoDataFond from '../../../CustomComponents/NoDataFond';
import {useEffect} from 'react';
import dayjs from 'dayjs';

const {width} = Dimensions.get('screen');
const LINE_PRESS = 'LINE_PRESS';
const LOADING = 'LOADING';
const FINISH = 'FINISH';
const handleLineChart = (state, action) => {
  switch (action.type) {
    case LINE_PRESS:
      return {
        ...state,
        pressItem: {...action.payload},
      };
    case LOADING:
      return {
        ...state,
        loading: true,
      };
    case FINISH:
      return {
        ...state,
        loading: false,
      };
    default:
      break;
  }
};
const Outcome = ({
  typeStatistic = 'Year',
  typePress,
  yearPress,
  STATISTIC_BUTTONS,
  loading,
  language,
  currency,
  STATISTIC,
  quarterIndex,
  month,
  dateStart,
  dateEnd,
  WALLET,
}) => {
  const name = useMemo(() => STATISTIC_BUTTONS[typePress].name, [typePress]);
  const [state, dispatchReducer] = useReducer(handleLineChart, {
    pressItem: {
      month: 0,
      value: 0,
    },
    loading: false,
  });
  const QUARTER = useSelector(state => state.Statistics).quarter;
  const CUSTOMIZE = useSelector(state => state.Statistics).customize;
  const uid = useSelector(state => state.UserSetting).id;
  const [quarter, setQuarter] = useState([]);
  useEffect(() => {
    let tmp = [];
    if (typeStatistic === 'Quarter' || typeStatistic === 'Month') {
      tmp = QUARTER.map(item => item.outcome);
    }
    if (typeStatistic === 'Customize') {
      tmp = CUSTOMIZE.map(item => item.outcome);
    }
    setQuarter(normalize(tmp.flat()));
  }, [QUARTER, CUSTOMIZE]);

  const listStatistics = useSelector(state => state.Statistics).monthOutcome;
  const dispatch = useDispatch();
  const checkColorLine = useCallback(() => {
    return STATISTIC_BUTTONS[typePress].color;
  }, [typePress]);
  const onLinePress = press => {
    dispatchReducer({type: LOADING});
    dispatchReducer({type: LINE_PRESS, payload: press});
    getDataMonthOutcome(uid, yearPress, press.month, WALLET).then(
      statisticMonth => {
        dispatch(uploadMonthOutcome(statisticMonth));
        dispatchReducer({type: FINISH});
      },
    );
  };
  const render_Statistic_IO = ({item: statistic, index}) => {
    return (
      <View key={index} style={styles.item}>
        <View
          style={[
            styles.item_icon,
            {
              backgroundColor: statistic.color,
            },
          ]}>
          <FontAwesome name={statistic.iconName} size={23} color={'white'} />
        </View>
        <Text style={styles.item_name} numberOfLines={1}>
          {language === 'English' ? statistic.name.EN : statistic.name.VN}
        </Text>
        {typeStatistic !== 'Year' && (
          <Text style={styles.item_percent}>
            {+((statistic.value / sumStatistics(quarter)) * 100).toFixed(2)} %
          </Text>
        )}
        <Text style={styles.item_money}>
          {statistic.value} {currency}
        </Text>
      </View>
    );
  };

  const render_Statistic_IO_1 = ({item: statistic, index}) => {
    return (
      <View key={index} style={styles.item}>
        <View
          style={[
            styles.item_icon,
            {
              backgroundColor: statistic.color,
            },
          ]}>
          <FontAwesome name={statistic.iconName} size={23} color={'white'} />
        </View>
        <Text style={styles.item_name} numberOfLines={1}>
          {language === 'English' ? statistic.name.EN : statistic.name.VN}
        </Text>
        {typeStatistic !== 'Year' && (
          <Text style={styles.item_percent}>
            {+((statistic.value / sumStatistics(quarter)) * 100).toFixed(2)} %
          </Text>
        )}
        <Text style={styles.item_money}>
          {statistic.value} {currency}
        </Text>
      </View>
    );
  };
  const txtView = useCallback(() => {
    if (language === 'English') {
      if (typeStatistic === 'Quarter') {
        return `The ${QUARTER_TXT[quarterIndex - 1]} quarter of ${yearPress}`;
      }
      if (typeStatistic === 'Month')
        return `The ${MONTHS[month - 1]} of ${yearPress}`;
      if (typeStatistic === 'Customize') {
        return `${dayjs(dateStart).format('DD/MM/YYYY')}-${dayjs(
          dateEnd,
        ).format('DD/MM/YYYY')}`;
      }
    } else {
      if (typeStatistic === 'Quarter') {
        return `Quý ${quarterIndex} năm ${yearPress}`;
      }
      if (typeStatistic === 'Month') return `Tháng ${month} năm ${yearPress}`;
      if (typeStatistic === 'Customize') {
        return `${dayjs(dateStart).format('DD/MM/YYYY')}-${dayjs(
          dateEnd,
        ).format('DD/MM/YYYY')}`;
      }
    }
  }, [quarter, language]);
  if (typeStatistic === 'Year' && STATISTIC.length === 0) {
    return (
      <View
        style={{
          width,
        }}>
        <NoDataFond widthImage={150} heightImage={150} fontSize={18} />
      </View>
    );
  }
  if (typeStatistic !== 'Year' && quarter.length === 0) {
    return (
      <View
        style={{
          width,
        }}>
        <NoDataFond widthImage={150} heightImage={150} fontSize={18} />
      </View>
    );
  }

  if (typeStatistic === 'Year')
    return (
      <View style={{width}}>
        <LineChart
          typeStatistic={typeStatistic}
          data={STATISTIC}
          pressItem={state.pressItem}
          setPressItem={press => onLinePress(press)}
          showStrokeBack={true}
          lineColor={checkColorLine()}
          colorMarker={checkColorLine()}
          langugage={language}
          label_xAxis={language === 'English' ? 'Month' : 'Tháng'}
          label_yAxis={currency}
          gapItem={70}
          buttonBackColor="hsl(222,28%,95%)"
        />
        <Text
          style={[
            styles.outcome_txt,
            {
              color: checkColorLine(),
            },
          ]}>
          {name}
        </Text>
        <Text
          style={[
            styles.outcome_txt,
            {
              color: checkColorLine(),
              marginTop: 0,
            },
          ]}>
          {sumStatistics(STATISTIC)} {currency}
        </Text>

        {state.pressItem.month !== 0 && (
          <>
            <View style={styles.bar_txt_view}>
              <Text style={styles.bar_txt}>
                {language === 'English'
                  ? MONTHS[state.pressItem.month - 1]
                  : `Tháng ${state.pressItem.month}`}
              </Text>
            </View>
            <View
              style={[
                styles.bar_container,
                {
                  borderColor: checkColorLine(),
                },
              ]}>
              <View style={styles.list_btns}>
                <Text
                  style={[
                    styles.modal_txt_press,
                    {
                      color: checkColorLine(),
                    },
                  ]}>
                  {name}
                </Text>

                <Text
                  style={[
                    styles.modal_txt_press,
                    {
                      color: checkColorLine(),
                    },
                  ]}>
                  {state.pressItem.value} {currency}
                </Text>
              </View>
              <View style={styles.divider} />

              {state.loading ? (
                <ActivityIndicator color={ColorCustom.orange} size={'large'} />
              ) : (
                <FlatList
                  data={listStatistics.outcome}
                  renderItem={render_Statistic_IO}
                  getItemLayout={(_, index) => ({
                    length: 60,
                    offset: 60 * index,
                    index,
                  })}
                  style={
                    listStatistics.outcome.length > 4 && {
                      height: 60 * 4,
                    }
                  }
                  nestedScrollEnabled
                  removeClippedSubviews={true}
                  ListEmptyComponent={
                    <Text style={[styles.btn_txt, {color: ColorCustom.gray}]}>
                      {language === 'English'
                        ? " Don't have data"
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
  return (
    <View style={{width}}>
      <Text style={styles.outcome_quarter_txt}>{txtView()}</Text>
      <PieChart
        width={width * 0.5}
        height={width * 0.5}
        data={quarter}
        radius={70}
        strokeWidth={40}
      />
      <View
        style={[
          styles.bar_container,
          {
            borderColor: checkColorLine(),
          },
        ]}>
        <View style={styles.list_btns}>
          <Text
            style={[
              styles.modal_txt_press,
              {
                color: checkColorLine(),
              },
            ]}>
            {name}
          </Text>

          <Text
            style={[
              styles.modal_txt_press,
              {
                color: checkColorLine(),
              },
            ]}>
            {sumStatistics(quarter)} {currency}
          </Text>
        </View>
        <View style={styles.divider} />
        <FlatList
          data={quarter}
          renderItem={render_Statistic_IO_1}
          getItemLayout={(_, index) => ({
            length: 60,
            offset: 60 * index,
            index,
          })}
          style={
            quarter.length > 4 && {
              height: 60 * 4,
            }
          }
          removeClippedSubviews={true}
          ListEmptyComponent={
            <Text style={[styles.btn_txt, {color: ColorCustom.gray}]}>
              {language === 'English' ? "Don't have data" : 'Không có dữ liệu'}
            </Text>
          }
          nestedScrollEnabled
        />
      </View>
    </View>
  );
};

export default Outcome;
