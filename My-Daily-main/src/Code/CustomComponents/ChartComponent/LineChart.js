import {View, ScrollView, StyleSheet} from 'react-native';
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  memo,
} from 'react';
import {
  Circle,
  Defs,
  G,
  Line,
  Marker,
  Path,
  Rect,
  Svg,
  Text as TextSVG,
} from 'react-native-svg';

const LineChart = ({
  typeStatistic,
  heightChart = 400,
  paddingLeft = 45,
  paddingBottom = 30,
  paddingRight = 10,
  paddingTop = 50,
  backgroundColor = 'white',
  axisColor = 'black',
  data = [],
  colorMarker = '#FF5C00',
  lineColor = '#FF5C00',
  lineWidth = 2,
  markerWidth = 2,
  gapItem = 60,
  strokeColor = 'hsl(0,0%,73%)',
  labelFontSize = 12,
  buttonBackColor = 'hsl(44,99%,50%)',
  buttonLabelColor = 'black',
  buttonRadius = 5,
  label_xAxis = 'Month',
  label_yAxis = 'VND',
  showStrokeBack = false,
  pressItem,
  setPressItem,
  langugage,
}) => {
  const Moneytary = useMemo(
    () =>
      langugage === 'English'
        ? ['', 'Thousand', 'Million', 'Billion', 'Trillion']
        : ['', 'Nghìn', 'Triệu', 'Tỷ', 'Nghìn Tỷ'],
    [langugage],
  );

  const x1 = paddingLeft;
  const y1 = heightChart - paddingBottom;
  const x2 = data.length * gapItem - paddingRight + x1 + 50;
  const y2 = heightChart - paddingBottom;
  const x3 = paddingLeft;
  const y3 = paddingTop;
  const gapBetweenPoint_xAxis = gapItem;

  const x_Axis = x2;
  const y_Axis = y3 - 20;
  const max_Data_Value = useMemo(
    () => Math.max(...data.map(item => item.value)),
    [data],
  );
  const [yAxisTitle, setyAxisTitle] = useState(0);
  const gapBetweenPoint_yAxix = useMemo(() => (y1 - y3) / data.length, [data]);
  const valueBetweenPoint_yAxix = useMemo(
    () => max_Data_Value / data.length,
    [data],
  );
  const computeMonetary = value => {
    return Math.round((value / Math.pow(10, yAxisTitle * 3)) * 100) / 100;
  };

  useEffect(() => {
    let number = Math.floor(max_Data_Value).toString().length;
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
  }, [max_Data_Value, typeStatistic]);
  const createPathLine = useCallback(() => {
    let d = '';
    data.map((item, index) => {
      const y = y1 - ((y1 - y3) / (max_Data_Value || 1)) * item.value;
      if (index === 0) {
        d += `M ${x1 * 2} ${y}`;
      } else {
        d += `L ${x1 * 2 + gapBetweenPoint_xAxis * index} ${y}`;
      }
    });
    return d;
  }, [data]);
  const line = useRef(null);
  const renderAxis = useCallback(() => {
    return (
      <Svg>
        {data.map((_, index) => {
          return (
            <G key={`x_Axis_Lable_Line_${index}`}>
              <Line
                x1={gapBetweenPoint_xAxis * index + x1 * 2}
                x2={gapBetweenPoint_xAxis * index + x1 * 2}
                y1={y1}
                y2={y1 + 5}
                stroke={axisColor}
              />

              {showStrokeBack && max_Data_Value !== 0 && (
                <G>
                  <Path
                    d={`M ${x1} ${
                      y1 - gapBetweenPoint_yAxix * index - gapBetweenPoint_yAxix
                    } h ${x2 - x1}`}
                    stroke={strokeColor}
                    strokeDasharray={[5]}
                    key={`stroke_y_Axis_${index}`}
                  />

                  <Path
                    d={`M ${gapBetweenPoint_xAxis * index + x1 * 2} ${y3} v ${
                      y1 - y3
                    }`}
                    stroke={strokeColor}
                    strokeDasharray={[5]}
                    key={`stroke_x_Axis_${index}`}
                  />
                </G>
              )}
            </G>
          );
        })}
      </Svg>
    );
  }, [data, max_Data_Value]);
  const renderBtnValue = () => {
    return (
      <Svg>
        {data.map((item, index) => {
          const y = y1 - ((y1 - y3) / (max_Data_Value || 1)) * item.value;
          const value = computeMonetary(item.value);
          return (
            <G key={index} onPress={() => setPressItem(item)}>
              <Rect
                width={(labelFontSize / 2) * value.toString().length + 20}
                height={30}
                x={
                  x1 * 2 +
                  gapBetweenPoint_xAxis * index -
                  ((labelFontSize / 2) * value.toString().length + 20) / 2
                }
                y={y - 50}
                rx={buttonRadius}
                ry={buttonRadius}
                fill={buttonBackColor}></Rect>
              <TextSVG
                x={x1 * 2 + gapBetweenPoint_xAxis * index}
                y={y - 30}
                textAnchor="middle"
                fill={buttonLabelColor}
                fontSize={labelFontSize}>
                {value}
              </TextSVG>
            </G>
          );
        })}
      </Svg>
    );
  };

  return (
    <View
      style={{
        backgroundColor: backgroundColor,
        flexDirection: 'row',
      }}>
      <View style={[StyleSheet.absoluteFillObject]}>
        <Svg>
          <G key="y_Axis">
            <Line x1={x1} x2={x3} y1={y1} y2={y_Axis} stroke={axisColor} />
            <Path
              d={`M  ${x1 - 5} ${y3 - 20}L ${x1 + 5} ${y3 - 20} L ${x1} ${
                y3 - 25
              } z`}
              fill={axisColor}
            />
            <TextSVG
              x={x1}
              y={y3 - 30}
              textAnchor={'middle'}
              fontSize={labelFontSize}>
              {yAxisTitle !== -1
                ? Moneytary[yAxisTitle] + ' ' + label_yAxis
                : label_yAxis}
            </TextSVG>
          </G>
          {[...new Array(data.length + 1)].map((_, index) => {
            if (max_Data_Value === 0) {
              return;
            }
            return (
              <G key={`y_Axis_Lable_Line_${index}`}>
                <Line
                  x1={x1}
                  x2={x1 - 5}
                  y1={y1 - gapBetweenPoint_yAxix * index}
                  y2={y1 - gapBetweenPoint_yAxix * index}
                  stroke={axisColor}
                />

                <TextSVG
                  textAnchor="middle"
                  x={x1 - 25}
                  y={y1 - gapBetweenPoint_yAxix * index}
                  fontSize={labelFontSize}>
                  {computeMonetary(valueBetweenPoint_yAxix * index)}
                </TextSVG>
              </G>
            );
          })}
        </Svg>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          marginLeft: x1,
        }}
        contentContainerStyle={{
          width: x2 + paddingRight,
          height: heightChart,
          marginLeft: -x1,
        }}
        removeClippedSubviews={true}>
        <Svg>
          <Defs>
            <Marker id="marker">
              <Circle x={0} y={0} r={markerWidth} fill={colorMarker} />
            </Marker>
          </Defs>
          <G key="x_Axis">
            <Line x1={x1} x2={x_Axis} y1={y1} y2={y2} stroke={axisColor} />
            <Path
              d={`M  ${x2} ${y1 - 5}L ${x2 + 5} ${y1} L ${x2} ${y1 + 5} z`}
              fill={axisColor}
            />
            <TextSVG
              x={x2 - 10}
              y={y1 + 20}
              textAnchor={'middle'}
              fontSize={labelFontSize}>
              {label_xAxis}
            </TextSVG>
          </G>
          {renderAxis()}
          <G>
            <Path
              ref={line}
              d={createPathLine()}
              stroke={lineColor}
              fill={'none'}
              marker={'url(#marker)'}
              strokeLinejoin="round"
              strokeLinecap={'round'}
              strokeWidth={lineWidth}
            />
          </G>
          {renderBtnValue()}

          {data.map((item, index) => {
            return (
              <TextSVG
                key={`month${index}`}
                textAnchor="middle"
                x={gapBetweenPoint_xAxis * index + x1 * 2}
                y={y1 + 25}
                fontWeight={pressItem?.month === item.month ? '700' : '400'}
                fontSize={labelFontSize}>
                {item.month}
              </TextSVG>
            );
          })}
        </Svg>
      </ScrollView>
    </View>
  );
};

export default memo(LineChart);
