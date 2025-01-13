import {View, Text, StyleSheet} from 'react-native';
import React, {useState, useCallback} from 'react';
import {useEffect} from 'react';
import Svg, {Circle} from 'react-native-svg';

import {FONT_FAMILY} from '../../Assets/Constants/FontCustom';
const PieChart = ({
  width,
  height,
  data,
  radius,
  strokeWidth,
  legendCircleWidth = 18,
  distance_Chart_Legend = 0,
  language = 'English',
}) => {
  const circumference = 2 * Math.PI * radius;
  const [percent, setPercent] = useState([]);
  const [angles, setAngles] = useState([]);
  const configDataChart = () => {
    let sum = 0;
    data?.map((item, _) => {
      sum += item.value;
    });
    let percentage = [];
    let anglesTmpArray = [];
    let angle = 0;
    data?.map((item, _) => {
      percentage.push((item.value / sum) * 100);
      anglesTmpArray.push(angle);
      angle += (item.value / sum) * 100 * 3.6;
    });

    setPercent([...percentage]);
    setAngles([...anglesTmpArray]);
  };

  useEffect(() => {
    configDataChart();
  }, [data]);
  const renderCircle = () => {
    return (
      <Svg>
        {data?.map((item, index) => {
          return (
            <Circle
              key={index}
              cx={width / 2}
              cy={height / 2}
              r={radius}
              strokeWidth={strokeWidth}
              fill={'none'}
              stroke={item.color}
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - percent[index] / 100)}
              originX={width / 2}
              originY={height / 2}
              rotation={angles[index]}
            />
          );
        })}
      </Svg>
    );
  };
  const renderLegend = useCallback(() => {
    return (
      <View>
        {data?.map((item, index) => {
          return (
            <View style={styles.legend} key={index}>
              <View
                style={{
                  borderRadius: 50,
                  width: legendCircleWidth,
                  height: legendCircleWidth,
                  backgroundColor: item.color,
                }}
              />
              <Text
                numberOfLines={1}
                style={[styles.text, {marginHorizontal: 10, maxWidth: 100}]}>
                {language === 'English' ? item.name.EN : item.name.VN}
              </Text>
            </View>
          );
        })}
      </View>
    );
  }, [data, language]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      {/* Chart */}
      <View
        style={{
          width,
          height,
          transform: [{rotate: '-90deg'}],
          zIndex: 4,
          marginHorizontal: distance_Chart_Legend,
        }}>
        {renderCircle()}
      </View>
      {/* Legend */}
      <View
        style={{
          width: '45%',
        }}>
        {renderLegend()}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  text: {
    color: '#000',
    fontFamily: FONT_FAMILY.Regular,
    fontSize: 13,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginLeft: 30,
  },
});
export default React.memo(PieChart);
