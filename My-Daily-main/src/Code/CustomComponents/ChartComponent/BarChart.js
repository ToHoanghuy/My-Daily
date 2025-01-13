import {View, ScrollView, StyleSheet, Text} from 'react-native';
import React, {useMemo, memo} from 'react';
import {G, Line, Path, Rect, Svg, Text as TextSVG} from 'react-native-svg';
import {useState} from 'react';
import {useEffect} from 'react';
import {FONT_FAMILY, FONT_SIZE} from '../../Assets/Constants/FontCustom';
import ColorCustom from '../../Assets/Constants/ColorCustom';
import {useCallback} from 'react';
const BarChart = ({
  typeStatistic,
  height = 500,
  backgroundColor = 'white',
  paddingLeft = 50,
  paddingRight = 40,
  paddingTop = 50,
  paddingBottom = 30,
  data = [],
  gap_xAxis = 80,
  barWidth = 30,
  barColorIncome = '#59e012',
  barColorOutcome = '#FF5C00',
  barRadius = 10,
  title_xAxis = 'Month',
  title_yAxis = 'USD',
  itemPress,
  setItemPress,
  language = 'English',
  legendIncome = 'Income',
  legendOutcome = 'Outcome',
}) => {
  const y1 = height - paddingBottom;
  const y2 = y1;
  const y3 = paddingTop;
  const gap_Between_xAxis = gap_xAxis + barWidth / 2;
  const x1 = paddingLeft;
  const x3 = x1;

  const x2 = data.length * gap_Between_xAxis + gap_Between_xAxis;
  const Moneytary = useMemo(
    () =>
      language === 'English'
        ? ['', 'Thousand', 'Million', 'Billion', 'Trillion']
        : ['', 'Nghìn', 'Triệu', 'Tỷ', 'Nghìn Tỷ'],
    [language],
  );
  const maxDataIncomeValue = useMemo(
    () => Math.max(...data.map(item => item.income)),
    [data],
  );
  const maxDataOutcomeValue = useMemo(
    () => Math.max(...data.map(item => item.outcome)),
    [data],
  );
  const maxDataValue =
    maxDataIncomeValue >= maxDataOutcomeValue
      ? maxDataIncomeValue
      : maxDataOutcomeValue;
  const gap_yAxis = (y1 - y3) / maxDataValue;
  const [yAxisTitle, setyAxisTitle] = useState(0);
  const computeMonetary = value => {
    return Math.round((value / Math.pow(10, yAxisTitle * 3)) * 100) / 100;
  };
  useEffect(() => {
    let number = Math.floor(maxDataValue).toString().length;
    if (number >= 13) {
      setyAxisTitle(4);
      return;
    }
    if (number >= 10) {
      setyAxisTitle(3);
      return;
    }
    if (number >= 7) {
      setyAxisTitle(2);
      return;
    }
    if (number >= 4) {
      setyAxisTitle(1);
      return;
    }
    setyAxisTitle(0);
    return;
  }, [maxDataValue, data]);
  const renderAxis = useCallback(() => {
    return (
      <Svg>
        {[0, 1, 2, 3, 4, 5, 6].map((item, index) => {
          return (
            <G key={index}>
              {index !== 0 && (
                <Line
                  x1={0}
                  y1={y1 - ((y1 - y3) / 6) * index}
                  x2={x2}
                  y2={y1 - ((y1 - y3) / 6) * index}
                  stroke={'grey'}
                  strokeDasharray={[2]}
                />
              )}
              <Line
                x1={gap_Between_xAxis * (index + 1)}
                y1={y1}
                x2={gap_Between_xAxis * (index + 1)}
                y2={y1 + 5}
                stroke="black"
              />
            </G>
          );
        })}
      </Svg>
    );
  }, [data]);
  const renderBar = () => {
    return (
      <Svg>
        {data.map((item, index) => {
          return (
            <G
              key={index}
              onPress={() => {
                setItemPress({
                  month: item.month,
                  valueIncome: item.income,
                  valueOutcome: item.outcome,
                });
              }}>
              <G key={'income'}>
                <Rect
                  x={gap_Between_xAxis * (index + 1) + 2}
                  y={y1 - gap_yAxis * item.income}
                  height={gap_yAxis * item.income}
                  width={barWidth}
                  rx={barRadius}
                  ry={barRadius}
                  fill={barColorIncome}
                />
              </G>
              <G key={'outcome'}>
                <Rect
                  x={gap_Between_xAxis * (index + 1) - barWidth - 2}
                  y={y1 - gap_yAxis * item.outcome}
                  height={gap_yAxis * item.outcome}
                  width={barWidth}
                  rx={barRadius}
                  ry={barRadius}
                  fill={barColorOutcome}
                />
              </G>
              <Rect
                x={gap_Between_xAxis * (index + 1) - barWidth}
                y={y1}
                width={barWidth * 2}
                height={40}
                fill={'transparent'}
              />
              <TextSVG
                testID="value_Outcome"
                fontSize={12}
                fill="black"
                x={
                  gap_Between_xAxis * (index + 1) - barWidth - 2 + barWidth / 2
                }
                y={y1 - gap_yAxis * item.outcome - 20}
                textAnchor="middle">
                {computeMonetary(item.outcome)}
              </TextSVG>
              <TextSVG
                testID="value_Income"
                fontSize={12}
                fill="black"
                x={gap_Between_xAxis * (index + 1) + 2 + barWidth / 2}
                y={y1 - gap_yAxis * item.income - 20}
                textAnchor="middle">
                {computeMonetary(item.income)}
              </TextSVG>
            </G>
          );
        })}
      </Svg>
    );
  };
  const sumData = (data, isIncome = true) => {
    if (isIncome)
      return data.reduce((preValue, curValue) => preValue + curValue.income, 0);
    return data.reduce((preValue, curValue) => preValue + curValue.outcome, 0);
  };

  return (
    <View>
      {/*Legend */}
      <View style={styles.containerLegend}>
        <View style={styles.contain}>
          <View
            style={[
              styles.block,
              {
                backgroundColor: barColorIncome,
              },
            ]}
          />
          <Text testID="titleIcome" style={styles.txt}>
            {legendIncome}
          </Text>
        </View>
        <View style={{width: 20}} />
        <View style={styles.contain}>
          <View
            style={[
              styles.block,
              {
                backgroundColor: barColorOutcome,
              },
            ]}
          />
          <Text testID="titleOutcome" style={styles.txt}>
            {legendOutcome}
          </Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: backgroundColor,
          flexDirection: 'row',
        }}>
        <View style={StyleSheet.absoluteFillObject}>
          <Svg>
            <Line
              x1={x1}
              y1={y1}
              x2={x3}
              y2={y3 - 20}
              stroke="black"
              key={'y_Axis'}
            />

            <Path
              d={`M ${x1 - 5} ${y3 - 20} L ${x1} ${y3 - 25} L ${x1 + 5} ${
                y3 - 20
              } z `}
            />
            <TextSVG
              font={12}
              fill={'black'}
              x={x1}
              y={y3 - 30}
              textAnchor="middle">
              {yAxisTitle !== -1
                ? Moneytary[yAxisTitle] + ' ' + title_yAxis
                : title_yAxis}
            </TextSVG>
            {[...new Array(7)].map((_, index) => {
              return (
                <G key={index}>
                  <TextSVG
                    testID="value_yAxis"
                    fill={'black'}
                    fontSize={12}
                    x={x1 - 10}
                    y={y1 - ((y1 - y3) / 6) * index}
                    textAnchor="end">
                    {computeMonetary(Math.floor((maxDataValue / 6) * index))}
                  </TextSVG>
                  {index !== 0 && (
                    <G>
                      <Line
                        x1={x1}
                        y1={y1 - ((y1 - y3) / 6) * index}
                        x2={x1 - 5}
                        y2={y1 - ((y1 - y3) / 6) * index}
                        stroke="black"
                      />
                    </G>
                  )}
                </G>
              );
            })}
          </Svg>
        </View>
        <ScrollView
          style={{marginLeft: x1}}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            width: x2 + paddingRight,
            height,
          }}
          removeClippedSubviews={true}
          decelerationRate={0.8}
          bounces={0}>
          <Svg>
            <Line
              x1={0}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="black"
              key={'x_Axis'}
            />
            <Path
              d={`M ${x2} ${y2 - 5} L ${x2} ${y2 + 5} L ${x2 + 5} ${y2} z`}
            />
            <TextSVG
              font={12}
              fill={'black'}
              x={x2 - 10}
              y={y2 + 15}
              textAnchor="middle">
              {title_xAxis}
            </TextSVG>
            {renderAxis()}
            {renderBar()}
            {data.map((item, index) => {
              return (
                <TextSVG
                  key={`month_${index}`}
                  fontSize={12}
                  fill="black"
                  x={gap_Between_xAxis * (index + 1)}
                  y={y1 + 20}
                  textAnchor="middle"
                  fontWeight={itemPress?.month === item.month ? '700' : '400'}>
                  {item.month}
                </TextSVG>
              );
            })}
          </Svg>
        </ScrollView>
      </View>
      <View style={styles.containBottom}>
        <View style={styles.bottom}>
          <Text
            testID="titleOutcome"
            style={[styles.bottomTxt_Title, {color: barColorOutcome}]}>
            {legendOutcome}
          </Text>
          <Text
            testID="resultOutcome&titleyAxis"
            style={[
              styles.bottomTxt,
              {
                color: barColorOutcome,
              },
            ]}>
            {sumData(data, false)} {title_yAxis}
          </Text>
        </View>
        <View style={styles.bottom}>
          <Text
            testID="titleIncome"
            style={[styles.bottomTxt_Title, {color: barColorIncome}]}>
            {legendIncome}
          </Text>
          <Text
            testID="resultIncome&titleyAxis"
            style={[styles.bottomTxt, {color: barColorIncome}]}>
            {sumData(data)} {title_yAxis}
          </Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  containerLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginVertical: 5,
  },
  contain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  block: {
    width: 15,
    height: 15,
    marginRight: 10,
  },
  txt: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: FONT_SIZE.TXT_SMALLER_SIZE,
    color: ColorCustom.black,
  },
  containBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 25,
  },
  bottom: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomTxt_Title: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: FONT_SIZE.TXT_SMALL_SIZE,
  },
  bottomTxt: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: FONT_SIZE.TXT_SMALLER_SIZE,
  },
});
export default memo(BarChart);
