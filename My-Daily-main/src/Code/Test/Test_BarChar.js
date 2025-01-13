import {View, Text} from 'react-native';
import React from 'react';
import BarChart from '../CustomComponents/ChartComponent/BarChart';
import {useState} from 'react';

const Test_BarChar = () => {
  const [itemPress, setItemPress] = useState();
  console.log(itemPress);
  return (
    <View
      style={{
        flex: 1,
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
        itemPress={itemPress}
        setItemPress={setItemPress}
      />
    </View>
  );
};

export default Test_BarChar;
