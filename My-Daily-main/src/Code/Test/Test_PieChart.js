import {View, Text, Dimensions} from 'react-native';
import React from 'react';
import PieChart from '../CustomComponents/ChartComponent/PieChart';
const {width: WIDTH_SCREEN, height: HEIGHT_SCREEN} = Dimensions.get('screen');
const DATA = [
  {
    name: 'Food',
    value: 400,
    color: '#eb3223',
  },
  {
    name: 'Education',
    value: 200,
    color: '#fbcb3c',
  },
  {
    name: 'Transport',
    value: 600,
    color: '#8fb6e6',
  },
  {
    name: 'Health',
    value: 500,
    color: '#3cda5e',
  },
  {
    name: 'Rent',
    value: 600,
    color: '#b46ef8',
  },
];
const Test_PieChart = () => {
  return (
    <View
      style={{
        flex: 1,
      }}>
      <PieChart
        width={WIDTH_SCREEN * 0.5}
        height={WIDTH_SCREEN * 0.5}
        data={DATA}
        radius={70}
        strokeWidth={40}
      />
    </View>
  );
};

export default Test_PieChart;
