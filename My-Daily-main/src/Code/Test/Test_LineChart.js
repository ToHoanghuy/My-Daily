import {View, Text} from 'react-native';
import React from 'react';
import LineChart from '../CustomComponents/ChartComponent/LineChart';
import {useState} from 'react';

const Test_LineChart = () => {
  const [pressItem, setPressItem] = useState();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 10,
      }}>
      <LineChart
        data={[
          {month: 'Tháng 1', value: 1332},
          {month: 'Tháng 2', value: 1133},
          {month: 'Tháng 3', value: 6000},
          {month: 'Tháng 4', value: 612300},
          {month: 'Tháng 5', value: 61235},
          {month: 'Tháng 6', value: 600},
          {month: 'Tháng 7', value: 70120},
          {month: 'Tháng 8', value: 700},
          {month: 'Tháng 9', value: 158},
          {month: 'Tháng 10', value: 58999},
          {month: 'Tháng 11', value: 700},
          {month: 'Tháng 12', value: 20344},
        ]}
        pressItem={pressItem}
        setPressItem={setPressItem}
        showStrokeBack={true}
      />
    </View>
  );
};

export default Test_LineChart;
