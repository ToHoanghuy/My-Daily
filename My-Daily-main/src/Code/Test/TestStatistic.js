import {
  View,
  Text,
  ScrollView,
  Button,
  Pressable,
  Dimensions,
  InteractionManager,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import HeaderDrawer from '../CustomComponents/HeaderDrawer';
import Entypo from 'react-native-vector-icons/Entypo';
import Menu from '../CustomComponents/Menu';
import ColorCustom from '../Assets/Constants/ColorCustom';
import {FONT_FAMILY, FONT_SIZE} from '../Assets/Constants/FontCustom';
import dayjs from 'dayjs';
import {useCallback} from 'react';
import LineChart from '../CustomComponents/ChartComponent/LineChart';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PieChart from '../CustomComponents/ChartComponent/PieChart';
import BarChart from '../CustomComponents/ChartComponent/BarChart';
import {useRef} from 'react';
const STATISTIC_BUTTONS = [
  {
    name: 'General',
    color: ColorCustom.green,
  },
  {
    name: 'Outcome',
    color: ColorCustom.orange,
  },
  {
    name: 'Income',
    color: ColorCustom.blue,
  },
];
const YEARS = ['2021', '2022', '2023', '2024', '2025', '2026', '2027'];
const {width, height} = Dimensions.get('screen');
const LIST_STATISTICS = [
  {
    name: 'Food',
    value: 400,
    color: '#eb3223',
    icon: 'film',
  },
  {
    name: 'Education',
    value: 200,
    color: '#fbcb3c',
    icon: 'star',
  },
  {
    name: 'Transport',
    value: 600,
    color: '#8fb6e6',
    icon: 'heart',
  },
  {
    name: 'Health',
    value: 500,
    color: '#3cda5e',
    icon: 'gear',
  },
  {
    name: 'Rent',
    value: 600,
    color: '#f9ba74',
    icon: 'buysellads',
  },
  {
    name: 'Bought',
    value: 1233,
    color: '#d8dde9',
    icon: 'road',
  },
];
const TestStatistic = () => {
  const [drawerHeight, setDrawerHeight] = useState(0);
  const [open, setOpen] = useState(false);
  const [typeStatistic, setTypeStatistic] = useState('Year');
  const [typePress, setTypePress] = useState(0);
  const [yearPress, setYearPress] = useState(dayjs(new Date()).format('YYYY'));
  const checkConditionYear = useCallback(
    year => {
      if (yearPress === year) {
        return STATISTIC_BUTTONS[typePress].color;
      }
      return ColorCustom.gray;
    },
    [yearPress, typePress],
  );
  const checkColorLine = () => {
    return STATISTIC_BUTTONS[typePress].color;
  };
  const [pressItem, setPressItem] = useState({
    month: 'March',
    value: 5000,
  });
  const [barPress, setBarPress] = useState();
  const sumStatistics = LIST_STATISTICS => {
    // let LIST_STATISTICS = isOutcome
    //   ? LIST_STATISTICS_OUTCOME
    //   : LIST_STATISTICS_INCOME;
    return LIST_STATISTICS.reduce(
      (preValue, curValue) => curValue.value + preValue,
      0,
    );
  };
  const createGeneral = () => {
    return (
      <View
        style={{
          width,
        }}>
        <BarChart
          dataIncome={[
            {month: 'Jan', value: 500},
            {month: 'Feb', value: 400},
            {month: 'Mar', value: 600},
            {month: 'Apr', value: 240},
            {month: 'Jun', value: 6012},
            {month: 'Jul', value: 700},
            {month: 'Aug', value: 7080},
            {month: 'Sep', value: 158},
            {month: 'Oct', value: 7020},
            {month: 'Nov', value: 700},
            {month: 'Dec', value: 200},
          ]}
          dataOutcome={[
            {month: 'Jan', value: 1023},
            {month: 'Feb', value: 4432},
            {month: 'Mar', value: 1344},
            {month: 'Apr', value: 998},
            {month: 'Jun', value: 600},
            {month: 'Jul', value: 700},
            {month: 'Aug', value: 130},
            {month: 'Sep', value: 120},
            {month: 'Oct', value: 700},
            {month: 'Nov', value: 700},
            {month: 'Dec', value: 200},
          ]}
          itemPress={barPress}
          setItemPress={setBarPress}
          barColorIncome={ColorCustom.blue}
          barColorOutcome={ColorCustom.orange}
          barRadius={0}
        />
        {barPress && (
          <>
            <Pressable
              style={{
                width: '90%',
                paddingVertical: 5,
                alignSelf: 'center',
                backgroundColor: ColorCustom.green,
                borderRadius: 100,
                marginVertical: 10,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: FONT_FAMILY.Bold,
                  color: 'white',
                  alignSelf: 'center',
                }}>
                {barPress?.month}
              </Text>
            </Pressable>
            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                borderRadius: 15,
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderColor: ColorCustom.orange,
                marginVertical: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: ColorCustom.orange,
                    fontFamily: FONT_FAMILY.Medium,
                    fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                  }}>
                  Outcome
                </Text>

                <Text
                  style={{
                    color: ColorCustom.orange,
                    fontFamily: FONT_FAMILY.Medium,
                    fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                  }}>
                  {barPress.valueOutcome} USD
                </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: ColorCustom.gray,
                  marginVertical: 10,
                }}
              />
              <ScrollView removeClippedSubviews={true}>
                {LIST_STATISTICS.map((statistic, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        paddingVertical: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}>
                      <View
                        style={[
                          {
                            height: 40,
                            width: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 100,
                            backgroundColor: statistic.color,
                            marginRight: 10,
                          },
                        ]}>
                        <FontAwesome
                          name={statistic.icon}
                          size={23}
                          color={'white'}
                        />
                      </View>
                      <Text
                        style={{
                          textAlign: 'left',
                          fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                          flex: 1,
                          fontFamily: FONT_FAMILY.Regular,
                          color: ColorCustom.black,
                        }}>
                        {statistic.name}
                      </Text>
                      {typeStatistic !== 'Year' && (
                        <Text
                          style={{
                            textAlign: 'justify',
                            width: '20%',
                            fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                            fontFamily: FONT_FAMILY.Regular,
                            color: ColorCustom.orange,
                          }}>
                          {
                            +(
                              (statistic.value /
                                sumStatistics(LIST_STATISTICS)) *
                              100
                            ).toFixed(2)
                          }{' '}
                          %
                        </Text>
                      )}
                      <Text
                        style={{
                          fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                          fontFamily: FONT_FAMILY.Regular,
                          color: ColorCustom.black,
                          flex: 1,
                          textAlign: 'right',
                        }}>
                        {statistic.value} VND
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                borderRadius: 15,
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderColor: ColorCustom.blue,
                marginVertical: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: ColorCustom.blue,
                    fontFamily: FONT_FAMILY.Medium,
                    fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                  }}>
                  Income
                </Text>

                <Text
                  style={{
                    color: ColorCustom.blue,
                    fontFamily: FONT_FAMILY.Medium,
                    fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                  }}>
                  {barPress.valueOutcome} USD
                </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: ColorCustom.gray,
                  marginVertical: 10,
                }}
              />
              <ScrollView removeClippedSubviews={true}>
                {LIST_STATISTICS.map((statistic, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        paddingVertical: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}>
                      <View
                        style={[
                          {
                            height: 40,
                            width: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 100,
                            backgroundColor: statistic.color,
                            marginRight: 10,
                          },
                        ]}>
                        <FontAwesome
                          name={statistic.icon}
                          size={23}
                          color={'white'}
                        />
                      </View>
                      <Text
                        style={{
                          textAlign: 'left',
                          fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                          flex: 1,
                          fontFamily: FONT_FAMILY.Regular,
                          color: ColorCustom.black,
                        }}>
                        {statistic.name}
                      </Text>
                      {typeStatistic !== 'Year' && (
                        <Text
                          style={{
                            textAlign: 'justify',
                            width: '20%',
                            fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                            fontFamily: FONT_FAMILY.Regular,
                            color: ColorCustom.orange,
                          }}>
                          {
                            +(
                              (statistic.value /
                                sumStatistics(LIST_STATISTICS)) *
                              100
                            ).toFixed(2)
                          }{' '}
                          %
                        </Text>
                      )}
                      <Text
                        style={{
                          fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                          fontFamily: FONT_FAMILY.Regular,
                          color: ColorCustom.black,
                          flex: 1,
                          textAlign: 'right',
                        }}>
                        {statistic.value} VND
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </>
        )}
      </View>
    );
  };
  const createOutcome = () => {
    if (typeStatistic === 'Year')
      return (
        <View style={{width}}>
          <LineChart
            data={[
              {month: 'January', value: 1332},
              {month: 'Feburary', value: 1133},
              {month: 'March', value: 6000},
              {month: 'April', value: 612300},
              {month: 'May', value: 61235},
              {month: 'June', value: 600},
              {month: 'July', value: 70120},
              {month: 'August', value: 700},
              {month: 'September', value: 158},
              {month: 'October', value: 58999},
              {month: 'November', value: 700},
              {month: 'December', value: 1556},
            ]}
            pressItem={pressItem}
            setPressItem={setPressItem}
            showStrokeBack={true}
            lineColor={checkColorLine()}
            colorMarker={checkColorLine()}
            langugage={'EN'}
            label_xAxis="Month"
            label_yAxis="USD"
            gapItem={70}
            buttonBackColor="hsl(222,28%,95%)"
          />
          <Text
            style={{
              fontSize: 20,
              color: checkColorLine(),
              alignSelf: 'center',
              marginTop: 25,
              fontFamily: FONT_FAMILY.Regular,
            }}>
            {STATISTIC_BUTTONS[typePress].name}
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: checkColorLine(),
              alignSelf: 'center',
              fontFamily: FONT_FAMILY.Regular,
            }}>
            {sumStatistics(LIST_STATISTICS)} USD
          </Text>
          <Pressable
            style={{
              width: '90%',
              paddingVertical: 5,
              alignSelf: 'center',
              backgroundColor: ColorCustom.green,
              borderRadius: 100,
              marginVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: FONT_FAMILY.Bold,
                color: 'white',
                alignSelf: 'center',
              }}>
              {pressItem?.month}
            </Text>
          </Pressable>
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              borderRadius: 15,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderColor: checkColorLine(),
              marginVertical: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: checkColorLine(),
                  fontFamily: FONT_FAMILY.Medium,
                  fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                }}>
                {STATISTIC_BUTTONS[typePress].name}
              </Text>

              <Text
                style={{
                  color: checkColorLine(),
                  fontFamily: FONT_FAMILY.Medium,
                  fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                }}>
                {pressItem?.value} USD
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: ColorCustom.gray,
                marginVertical: 10,
              }}
            />
            <ScrollView removeClippedSubviews={true}>
              {LIST_STATISTICS.map((statistic, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      paddingVertical: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}>
                    <View
                      style={[
                        {
                          height: 40,
                          width: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 100,
                          backgroundColor: statistic.color,
                          marginRight: 10,
                        },
                      ]}>
                      <FontAwesome
                        name={statistic.icon}
                        size={23}
                        color={'white'}
                      />
                    </View>
                    <Text
                      style={{
                        textAlign: 'left',
                        fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                        flex: 1,
                        fontFamily: FONT_FAMILY.Regular,
                        color: ColorCustom.black,
                      }}>
                      {statistic.name}
                    </Text>
                    {typeStatistic !== 'Year' && (
                      <Text
                        style={{
                          textAlign: 'justify',
                          width: '20%',
                          fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                          fontFamily: FONT_FAMILY.Regular,
                          color: ColorCustom.orange,
                        }}>
                        {
                          +(
                            (statistic.value / sumStatistics(LIST_STATISTICS)) *
                            100
                          ).toFixed(2)
                        }{' '}
                        %
                      </Text>
                    )}
                    <Text
                      style={{
                        fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                        fontFamily: FONT_FAMILY.Regular,
                        color: ColorCustom.black,
                        flex: 1,
                        textAlign: 'right',
                      }}>
                      {statistic.value} VND
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      );
    if (typeStatistic === 'Quarter')
      return (
        <View style={{width}}>
          <Text
            style={{
              color: ColorCustom.black,
              fontFamily: FONT_FAMILY.Regular,
              fontSize: FONT_SIZE.TXT_SIZE,
              alignSelf: 'center',
              marginVertical: 10,
            }}>
            The second quarter of 2023
          </Text>
          <PieChart
            width={width * 0.5}
            height={width * 0.5}
            data={LIST_STATISTICS}
            radius={70}
            strokeWidth={40}
          />
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              borderRadius: 15,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderColor: checkColorLine(),
              marginVertical: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: checkColorLine(),
                  fontFamily: FONT_FAMILY.Medium,
                  fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                }}>
                {STATISTIC_BUTTONS[typePress].name}
              </Text>

              <Text
                style={{
                  color: checkColorLine(),
                  fontFamily: FONT_FAMILY.Medium,
                  fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                }}>
                {pressItem?.value} USD
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: ColorCustom.gray,
                marginVertical: 10,
              }}
            />
            <ScrollView removeClippedSubviews={true}>
              {LIST_STATISTICS.map((statistic, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      paddingVertical: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}>
                    <View
                      style={[
                        {
                          height: 40,
                          width: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 100,
                          backgroundColor: statistic.color,
                          marginRight: 10,
                        },
                      ]}>
                      <FontAwesome
                        name={statistic.icon}
                        size={23}
                        color={'white'}
                      />
                    </View>
                    <Text
                      style={{
                        textAlign: 'left',
                        fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                        flex: 1,
                        fontFamily: FONT_FAMILY.Regular,
                        color: ColorCustom.black,
                      }}>
                      {statistic.name}
                    </Text>
                    {typeStatistic !== 'Year' && (
                      <Text
                        style={{
                          textAlign: 'justify',
                          width: '20%',
                          fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                          fontFamily: FONT_FAMILY.Regular,
                          color: ColorCustom.orange,
                        }}>
                        {
                          +(
                            (statistic.value / sumStatistics(LIST_STATISTICS)) *
                            100
                          ).toFixed(2)
                        }{' '}
                        %
                      </Text>
                    )}
                    <Text
                      style={{
                        fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                        fontFamily: FONT_FAMILY.Regular,
                        color: ColorCustom.black,
                        flex: 1,
                        textAlign: 'right',
                      }}>
                      {statistic.value} VND
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      );
    if (typeStatistic === 'Month')
      return (
        <View style={{width}}>
          <Text
            style={{
              color: ColorCustom.black,
              fontFamily: FONT_FAMILY.Regular,
              fontSize: FONT_SIZE.TXT_SIZE,
              alignSelf: 'center',
              marginVertical: 10,
            }}>
            The December of 2023
          </Text>
          <PieChart
            width={width * 0.5}
            height={width * 0.5}
            data={LIST_STATISTICS}
            radius={70}
            strokeWidth={40}
          />
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              borderRadius: 15,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderColor: checkColorLine(),
              marginVertical: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: checkColorLine(),
                  fontFamily: FONT_FAMILY.Medium,
                  fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                }}>
                {STATISTIC_BUTTONS[typePress].name}
              </Text>

              <Text
                style={{
                  color: checkColorLine(),
                  fontFamily: FONT_FAMILY.Medium,
                  fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                }}>
                {pressItem?.value} USD
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: ColorCustom.gray,
                marginVertical: 10,
              }}
            />
            <ScrollView removeClippedSubviews={true}>
              {LIST_STATISTICS.map((statistic, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      paddingVertical: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}>
                    <View
                      style={[
                        {
                          height: 40,
                          width: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 100,
                          backgroundColor: statistic.color,
                          marginRight: 10,
                        },
                      ]}>
                      <FontAwesome
                        name={statistic.icon}
                        size={23}
                        color={'white'}
                      />
                    </View>
                    <Text
                      style={{
                        textAlign: 'left',
                        fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                        flex: 1,
                        fontFamily: FONT_FAMILY.Regular,
                        color: ColorCustom.black,
                      }}>
                      {statistic.name}
                    </Text>
                    {typeStatistic !== 'Year' && (
                      <Text
                        style={{
                          textAlign: 'justify',
                          width: '20%',
                          fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                          fontFamily: FONT_FAMILY.Regular,
                          color: ColorCustom.orange,
                        }}>
                        {
                          +(
                            (statistic.value / sumStatistics(LIST_STATISTICS)) *
                            100
                          ).toFixed(2)
                        }{' '}
                        %
                      </Text>
                    )}
                    <Text
                      style={{
                        fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                        fontFamily: FONT_FAMILY.Regular,
                        color: ColorCustom.black,
                        flex: 1,
                        textAlign: 'right',
                      }}>
                      {statistic.value} VND
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      );
    if (typeStatistic === 'Week')
      return (
        <View style={{width}}>
          <Text
            style={{
              color: ColorCustom.black,
              fontFamily: FONT_FAMILY.Regular,
              fontSize: FONT_SIZE.TXT_SIZE,
              alignSelf: 'center',
              marginVertical: 10,
            }}>
            31st Week of 2023
          </Text>
          <PieChart
            width={width * 0.5}
            height={width * 0.5}
            data={LIST_STATISTICS}
            radius={70}
            strokeWidth={40}
          />
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              borderRadius: 15,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderColor: checkColorLine(),
              marginVertical: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: checkColorLine(),
                  fontFamily: FONT_FAMILY.Medium,
                  fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                }}>
                {STATISTIC_BUTTONS[typePress].name}
              </Text>

              <Text
                style={{
                  color: checkColorLine(),
                  fontFamily: FONT_FAMILY.Medium,
                  fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                }}>
                {pressItem?.value} USD
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: ColorCustom.gray,
                marginVertical: 10,
              }}
            />
            <ScrollView removeClippedSubviews={true}>
              {LIST_STATISTICS.map((statistic, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      paddingVertical: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}>
                    <View
                      style={[
                        {
                          height: 40,
                          width: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 100,
                          backgroundColor: statistic.color,
                          marginRight: 10,
                        },
                      ]}>
                      <FontAwesome
                        name={statistic.icon}
                        size={23}
                        color={'white'}
                      />
                    </View>
                    <Text
                      style={{
                        textAlign: 'left',
                        fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                        flex: 1,
                        fontFamily: FONT_FAMILY.Regular,
                        color: ColorCustom.black,
                      }}>
                      {statistic.name}
                    </Text>
                    {typeStatistic !== 'Year' && (
                      <Text
                        style={{
                          textAlign: 'justify',
                          width: '20%',
                          fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                          fontFamily: FONT_FAMILY.Regular,
                          color: ColorCustom.orange,
                        }}>
                        {
                          +(
                            (statistic.value / sumStatistics(LIST_STATISTICS)) *
                            100
                          ).toFixed(2)
                        }{' '}
                        %
                      </Text>
                    )}
                    <Text
                      style={{
                        fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                        fontFamily: FONT_FAMILY.Regular,
                        color: ColorCustom.black,
                        flex: 1,
                        textAlign: 'right',
                      }}>
                      {statistic.value} VND
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      );
    if (typeStatistic === 'Cutomize')
      return (
        <View style={{width}}>
          <Text
            style={{
              color: ColorCustom.black,
              fontFamily: FONT_FAMILY.Regular,
              fontSize: FONT_SIZE.TXT_SIZE,
              alignSelf: 'center',
              marginVertical: 10,
            }}>
            11/26/2022 - 12/29/2022
          </Text>
          <PieChart
            width={width * 0.5}
            height={width * 0.5}
            data={LIST_STATISTICS}
            radius={70}
            strokeWidth={40}
          />
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              borderRadius: 15,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderColor: checkColorLine(),
              marginVertical: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: checkColorLine(),
                  fontFamily: FONT_FAMILY.Medium,
                  fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                }}>
                {STATISTIC_BUTTONS[typePress].name}
              </Text>

              <Text
                style={{
                  color: checkColorLine(),
                  fontFamily: FONT_FAMILY.Medium,
                  fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                }}>
                {pressItem?.value} USD
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: ColorCustom.gray,
                marginVertical: 10,
              }}
            />
            <ScrollView removeClippedSubviews={true}>
              {LIST_STATISTICS.map((statistic, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      paddingVertical: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}>
                    <View
                      style={[
                        {
                          height: 40,
                          width: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 100,
                          backgroundColor: statistic.color,
                          marginRight: 10,
                        },
                      ]}>
                      <FontAwesome
                        name={statistic.icon}
                        size={23}
                        color={'white'}
                      />
                    </View>
                    <Text
                      style={{
                        textAlign: 'left',
                        fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                        flex: 1,
                        fontFamily: FONT_FAMILY.Regular,
                        color: ColorCustom.black,
                      }}>
                      {statistic.name}
                    </Text>
                    {typeStatistic !== 'Year' && (
                      <Text
                        style={{
                          textAlign: 'justify',
                          width: '20%',
                          fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                          fontFamily: FONT_FAMILY.Regular,
                          color: ColorCustom.orange,
                        }}>
                        {
                          +(
                            (statistic.value / sumStatistics(LIST_STATISTICS)) *
                            100
                          ).toFixed(2)
                        }{' '}
                        %
                      </Text>
                    )}
                    <Text
                      style={{
                        fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                        fontFamily: FONT_FAMILY.Regular,
                        color: ColorCustom.black,
                        flex: 1,
                        textAlign: 'right',
                      }}>
                      {statistic.value} VND
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      );
  };
  const createIncome = () => {
    if (typeStatistic === 'Year')
      return (
        <View style={{width}}>
          <LineChart
            data={[
              {month: 'January', value: 1332},
              {month: 'Feburary', value: 1133},
              {month: 'March', value: 6000},
              {month: 'April', value: 612300},
              {month: 'May', value: 61235},
              {month: 'June', value: 600},
              {month: 'July', value: 70120},
              {month: 'August', value: 700},
              {month: 'September', value: 158},
              {month: 'October', value: 58999},
              {month: 'November', value: 700},
              {month: 'December', value: 1556},
            ]}
            pressItem={pressItem}
            setPressItem={setPressItem}
            showStrokeBack={true}
            lineColor={checkColorLine()}
            colorMarker={checkColorLine()}
            langugage={'EN'}
            label_xAxis="Month"
            label_yAxis="USD"
            gapItem={70}
            buttonBackColor="hsl(222,28%,95%)"
          />
          <Text
            style={{
              fontSize: 20,
              color: checkColorLine(),
              alignSelf: 'center',
              marginTop: 25,
              fontFamily: FONT_FAMILY.Regular,
            }}>
            {STATISTIC_BUTTONS[typePress].name}
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: checkColorLine(),
              alignSelf: 'center',
              fontFamily: FONT_FAMILY.Regular,
            }}>
            {sumStatistics(LIST_STATISTICS)} USD
          </Text>
          <Pressable
            style={{
              width: '90%',
              paddingVertical: 5,
              alignSelf: 'center',
              backgroundColor: ColorCustom.green,
              borderRadius: 100,
              marginVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: FONT_FAMILY.Bold,
                color: 'white',
                alignSelf: 'center',
              }}>
              {pressItem?.month}
            </Text>
          </Pressable>
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              borderRadius: 15,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderColor: checkColorLine(),
              marginVertical: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: checkColorLine(),
                  fontFamily: FONT_FAMILY.Medium,
                  fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                }}>
                {STATISTIC_BUTTONS[typePress].name}
              </Text>

              <Text
                style={{
                  color: checkColorLine(),
                  fontFamily: FONT_FAMILY.Medium,
                  fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                }}>
                {pressItem?.value} USD
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: ColorCustom.gray,
                marginVertical: 10,
              }}
            />
            <ScrollView removeClippedSubviews={true}>
              {LIST_STATISTICS.map((statistic, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      paddingVertical: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}>
                    <View
                      style={[
                        {
                          height: 40,
                          width: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 100,
                          backgroundColor: statistic.color,
                          marginRight: 10,
                        },
                      ]}>
                      <FontAwesome
                        name={statistic.icon}
                        size={23}
                        color={'white'}
                      />
                    </View>
                    <Text
                      style={{
                        textAlign: 'left',
                        fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                        flex: 1,
                        fontFamily: FONT_FAMILY.Regular,
                        color: ColorCustom.black,
                      }}>
                      {statistic.name}
                    </Text>
                    {typeStatistic !== 'Year' && (
                      <Text
                        style={{
                          textAlign: 'justify',
                          width: '20%',
                          fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                          fontFamily: FONT_FAMILY.Regular,
                          color: ColorCustom.orange,
                        }}>
                        {
                          +(
                            (statistic.value / sumStatistics(LIST_STATISTICS)) *
                            100
                          ).toFixed(2)
                        }{' '}
                        %
                      </Text>
                    )}
                    <Text
                      style={{
                        fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                        fontFamily: FONT_FAMILY.Regular,
                        color: ColorCustom.black,
                        flex: 1,
                        textAlign: 'right',
                      }}>
                      {statistic.value} VND
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      );
    if (typeStatistic === 'Quarter')
      return (
        <View style={{width}}>
          <Text
            style={{
              color: ColorCustom.black,
              fontFamily: FONT_FAMILY.Regular,
              fontSize: FONT_SIZE.TXT_SIZE,
              alignSelf: 'center',
              marginVertical: 10,
            }}>
            The second quarter of 2023
          </Text>
          <PieChart
            width={width * 0.5}
            height={width * 0.5}
            data={LIST_STATISTICS}
            radius={70}
            strokeWidth={40}
          />
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              borderRadius: 15,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderColor: checkColorLine(),
              marginVertical: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: checkColorLine(),
                  fontFamily: FONT_FAMILY.Medium,
                  fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                }}>
                {STATISTIC_BUTTONS[typePress].name}
              </Text>

              <Text
                style={{
                  color: checkColorLine(),
                  fontFamily: FONT_FAMILY.Medium,
                  fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                }}>
                {pressItem?.value} USD
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: ColorCustom.gray,
                marginVertical: 10,
              }}
            />
            <ScrollView removeClippedSubviews={true}>
              {LIST_STATISTICS.map((statistic, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      paddingVertical: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}>
                    <View
                      style={[
                        {
                          height: 40,
                          width: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 100,
                          backgroundColor: statistic.color,
                          marginRight: 10,
                        },
                      ]}>
                      <FontAwesome
                        name={statistic.icon}
                        size={23}
                        color={'white'}
                      />
                    </View>
                    <Text
                      style={{
                        textAlign: 'left',
                        fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                        flex: 1,
                        fontFamily: FONT_FAMILY.Regular,
                        color: ColorCustom.black,
                      }}>
                      {statistic.name}
                    </Text>
                    {typeStatistic !== 'Year' && (
                      <Text
                        style={{
                          textAlign: 'justify',
                          width: '20%',
                          fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                          fontFamily: FONT_FAMILY.Regular,
                          color: ColorCustom.orange,
                        }}>
                        {
                          +(
                            (statistic.value / sumStatistics(LIST_STATISTICS)) *
                            100
                          ).toFixed(2)
                        }{' '}
                        %
                      </Text>
                    )}
                    <Text
                      style={{
                        fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                        fontFamily: FONT_FAMILY.Regular,
                        color: ColorCustom.black,
                        flex: 1,
                        textAlign: 'right',
                      }}>
                      {statistic.value} VND
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      );
    if (typeStatistic === 'Month')
      return (
        <View style={{width}}>
          <Text
            style={{
              color: ColorCustom.black,
              fontFamily: FONT_FAMILY.Regular,
              fontSize: FONT_SIZE.TXT_SIZE,
              alignSelf: 'center',
              marginVertical: 10,
            }}>
            The December of 2023
          </Text>
          <PieChart
            width={width * 0.5}
            height={width * 0.5}
            data={LIST_STATISTICS}
            radius={70}
            strokeWidth={40}
          />
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              borderRadius: 15,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderColor: checkColorLine(),
              marginVertical: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: checkColorLine(),
                  fontFamily: FONT_FAMILY.Medium,
                  fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                }}>
                {STATISTIC_BUTTONS[typePress].name}
              </Text>

              <Text
                style={{
                  color: checkColorLine(),
                  fontFamily: FONT_FAMILY.Medium,
                  fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                }}>
                {pressItem?.value} USD
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: ColorCustom.gray,
                marginVertical: 10,
              }}
            />
            <ScrollView removeClippedSubviews={true}>
              {LIST_STATISTICS.map((statistic, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      paddingVertical: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}>
                    <View
                      style={[
                        {
                          height: 40,
                          width: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 100,
                          backgroundColor: statistic.color,
                          marginRight: 10,
                        },
                      ]}>
                      <FontAwesome
                        name={statistic.icon}
                        size={23}
                        color={'white'}
                      />
                    </View>
                    <Text
                      style={{
                        textAlign: 'left',
                        fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                        flex: 1,
                        fontFamily: FONT_FAMILY.Regular,
                        color: ColorCustom.black,
                      }}>
                      {statistic.name}
                    </Text>
                    {typeStatistic !== 'Year' && (
                      <Text
                        style={{
                          textAlign: 'justify',
                          width: '20%',
                          fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                          fontFamily: FONT_FAMILY.Regular,
                          color: ColorCustom.orange,
                        }}>
                        {
                          +(
                            (statistic.value / sumStatistics(LIST_STATISTICS)) *
                            100
                          ).toFixed(2)
                        }{' '}
                        %
                      </Text>
                    )}
                    <Text
                      style={{
                        fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                        fontFamily: FONT_FAMILY.Regular,
                        color: ColorCustom.black,
                        flex: 1,
                        textAlign: 'right',
                      }}>
                      {statistic.value} VND
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      );
    if (typeStatistic === 'Week')
      return (
        <View style={{width}}>
          <Text
            style={{
              color: ColorCustom.black,
              fontFamily: FONT_FAMILY.Regular,
              fontSize: FONT_SIZE.TXT_SIZE,
              alignSelf: 'center',
              marginVertical: 10,
            }}>
            31st Week of 2023
          </Text>
          <PieChart
            width={width * 0.5}
            height={width * 0.5}
            data={LIST_STATISTICS}
            radius={70}
            strokeWidth={40}
          />
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              borderRadius: 15,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderColor: checkColorLine(),
              marginVertical: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: checkColorLine(),
                  fontFamily: FONT_FAMILY.Medium,
                  fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                }}>
                {STATISTIC_BUTTONS[typePress].name}
              </Text>

              <Text
                style={{
                  color: checkColorLine(),
                  fontFamily: FONT_FAMILY.Medium,
                  fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                }}>
                {pressItem?.value} USD
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: ColorCustom.gray,
                marginVertical: 10,
              }}
            />
            <ScrollView removeClippedSubviews={true}>
              {LIST_STATISTICS.map((statistic, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      paddingVertical: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}>
                    <View
                      style={[
                        {
                          height: 40,
                          width: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 100,
                          backgroundColor: statistic.color,
                          marginRight: 10,
                        },
                      ]}>
                      <FontAwesome
                        name={statistic.icon}
                        size={23}
                        color={'white'}
                      />
                    </View>
                    <Text
                      style={{
                        textAlign: 'left',
                        fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                        flex: 1,
                        fontFamily: FONT_FAMILY.Regular,
                        color: ColorCustom.black,
                      }}>
                      {statistic.name}
                    </Text>
                    {typeStatistic !== 'Year' && (
                      <Text
                        style={{
                          textAlign: 'justify',
                          width: '20%',
                          fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                          fontFamily: FONT_FAMILY.Regular,
                          color: ColorCustom.orange,
                        }}>
                        {
                          +(
                            (statistic.value / sumStatistics(LIST_STATISTICS)) *
                            100
                          ).toFixed(2)
                        }{' '}
                        %
                      </Text>
                    )}
                    <Text
                      style={{
                        fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                        fontFamily: FONT_FAMILY.Regular,
                        color: ColorCustom.black,
                        flex: 1,
                        textAlign: 'right',
                      }}>
                      {statistic.value} VND
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      );
    if (typeStatistic === 'Cutomize')
      return (
        <View style={{width}}>
          <Text
            style={{
              color: ColorCustom.black,
              fontFamily: FONT_FAMILY.Regular,
              fontSize: FONT_SIZE.TXT_SIZE,
              alignSelf: 'center',
              marginVertical: 10,
            }}>
            11/26/2022 - 12/29/2022
          </Text>
          <PieChart
            width={width * 0.5}
            height={width * 0.5}
            data={LIST_STATISTICS}
            radius={70}
            strokeWidth={40}
          />
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              borderRadius: 15,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderColor: checkColorLine(),
              marginVertical: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: checkColorLine(),
                  fontFamily: FONT_FAMILY.Medium,
                  fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                }}>
                {STATISTIC_BUTTONS[typePress].name}
              </Text>

              <Text
                style={{
                  color: checkColorLine(),
                  fontFamily: FONT_FAMILY.Medium,
                  fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                }}>
                {pressItem?.value} USD
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: ColorCustom.gray,
                marginVertical: 10,
              }}
            />
            <ScrollView removeClippedSubviews={true}>
              {LIST_STATISTICS.map((statistic, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      paddingVertical: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}>
                    <View
                      style={[
                        {
                          height: 40,
                          width: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 100,
                          backgroundColor: statistic.color,
                          marginRight: 10,
                        },
                      ]}>
                      <FontAwesome
                        name={statistic.icon}
                        size={23}
                        color={'white'}
                      />
                    </View>
                    <Text
                      style={{
                        textAlign: 'left',
                        fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                        flex: 1,
                        fontFamily: FONT_FAMILY.Regular,
                        color: ColorCustom.black,
                      }}>
                      {statistic.name}
                    </Text>
                    {typeStatistic !== 'Year' && (
                      <Text
                        style={{
                          textAlign: 'justify',
                          width: '20%',
                          fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                          fontFamily: FONT_FAMILY.Regular,
                          color: ColorCustom.orange,
                        }}>
                        {
                          +(
                            (statistic.value / sumStatistics(LIST_STATISTICS)) *
                            100
                          ).toFixed(2)
                        }{' '}
                        %
                      </Text>
                    )}
                    <Text
                      style={{
                        fontSize: FONT_SIZE.TXT_SMALL_SIZE,
                        fontFamily: FONT_FAMILY.Regular,
                        color: ColorCustom.black,
                        flex: 1,
                        textAlign: 'right',
                      }}>
                      {statistic.value} VND
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      );
  };
  const scrollButton = useRef(null);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}>
        <HeaderDrawer
          title={'Statistic'}
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
                setOpen(true);
              },
            },
          ]}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {STATISTIC_BUTTONS.map((button, index) => {
            return (
              <Pressable
                onPress={() => {
                  InteractionManager.runAfterInteractions(() => {
                    setTypePress(index);
                    scrollButton.current.scrollTo({
                      x: width * index,
                      y: 0,
                      animated: false,
                    });
                  });
                }}
                key={index}
                style={[
                  {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 10,
                    marginHorizontal: 5,
                  },
                  typePress === index && {
                    borderBottomColor: button.color,
                    borderBottomWidth: 2,
                  },
                ]}>
                <Text
                  style={{
                    fontFamily: FONT_FAMILY.Regular,
                    color:
                      typePress === index ? button.color : ColorCustom.gray,
                    fontSize: FONT_SIZE.TXT_MIDDLE_SIZE,
                  }}>
                  {STATISTIC_BUTTONS[index].name}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            marginVertical: 10,
          }}
          contentContainerStyle={{
            justifyContent: 'space-between',
          }}>
          {YEARS.map((year, index) => {
            const color = checkConditionYear(year);
            return (
              <Pressable
                onPress={() => setYearPress(year)}
                key={index}
                style={{
                  width: (width - 60) / 3,
                  paddingVertical: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 10,
                  borderWidth: 1.5,
                  borderRadius: 100,
                  borderColor: color,
                }}>
                <Text
                  style={{
                    color: color,
                    fontSize: FONT_SIZE.TXT_SIZE,
                    fontFamily: FONT_FAMILY.Regular,
                  }}>
                  {year}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <ScrollView
          showsHorizontalScrollIndicator={false}
          ref={scrollButton}
          horizontal
          scrollEnabled={false}
          removeClippedSubviews={true}>
          {createGeneral()}
          {createOutcome()}
          {createIncome()}
        </ScrollView>

        <Menu
          open={open}
          setOpen={setOpen}
          drawerHeight={drawerHeight}
          btnList={[
            {
              title: 'Year',
              onPress: () =>
                InteractionManager.runAfterInteractions(
                  setTypeStatistic('Year'),
                ),
            },
            {
              title: 'Quarter',
              onPress: () =>
                InteractionManager.runAfterInteractions(
                  setTypeStatistic('Quarter'),
                ),
            },
            {
              title: 'Month',
              onPress: () =>
                InteractionManager.runAfterInteractions(
                  setTypeStatistic('Month'),
                ),
            },
            {
              title: 'Week',
              onPress: () =>
                InteractionManager.runAfterInteractions(
                  setTypeStatistic('Week'),
                ),
            },
            {
              title: 'Cutomize',
              onPress: () =>
                InteractionManager.runAfterInteractions(
                  setTypeStatistic('Cutomize'),
                ),
            },
          ]}
        />
      </ScrollView>
    </View>
  );
};

export default TestStatistic;
