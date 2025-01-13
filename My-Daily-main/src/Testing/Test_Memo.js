import {View, Text, FlatList, Button} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useMemo} from 'react';
const DATA = [
  {
    name: {
      EN: 'Food',
      VN: 'Thức ăn',
    },
    icon_name: 'cutlery',
    color: '#E84242',
  },
  {
    name: {
      EN: 'Car',
      VN: 'Xe',
    },
    icon_name: 'cutlery',
    color: '#F968D0',
  },
  {
    name: {
      EN: 'Food',
      VN: 'Thức ăn',
    },
    icon_name: 'cutlery',
    color: '#FF9E9E',
  },
  {
    name: {
      EN: 'Food',
      VN: 'Thức ăn',
    },
    icon_name: 'cutlery',
    color: '#FF9E9E',
  },
  {
    name: {
      EN: 'Food',
      VN: 'Thức ăn',
    },
    icon_name: 'cutlery',
    color: '#FF9E9E',
  },
  {
    name: {
      EN: 'Food',
      VN: 'Thức ăn',
    },
    icon_name: 'cutlery',
    color: '#FF9E9E',
  },
  {
    name: {
      EN: 'Food',
      VN: 'Thức ăn',
    },
    icon_name: 'cutlery',
    color: '#FF9E9E',
  },
  {
    name: {
      EN: 'Food',
      VN: 'Thức ăn',
    },
    icon_name: 'cutlery',
    color: '#FF9E9E',
  },
  {
    name: {
      EN: 'Food',
      VN: 'Thức ăn',
    },
    icon_name: 'cutlery',
    color: '#FF9E9E',
  },
  {
    name: {
      EN: 'Food',
      VN: 'Thức ăn',
    },
    icon_name: 'cutlery',
    color: '#FF9E9E',
  },
  {
    name: {
      EN: 'Food',
      VN: 'Thức ăn',
    },
    icon_name: 'cutlery',
    color: '#FF9E9E',
  },
];
const Test_Memo = () => {
  const [language, setLanguage] = useState('English');
  const [number, setNumber] = useState(0);
  //   const name = useCallback(
  //     item => {
  //       console.log('render');
  //       if (language === 'English') return item.name.EN;
  //       else return item.name.VN;
  //     },
  //     [language],
  //   );
  //   const name = useMemo(() => {
  //     console.log('render');
  //     return language === 'English' ? 'EN' : 'VN';
  //   }, [language]);
  const name = useCallback(
    item => {
      console.log('render');
      if (language === 'English') return item.name.EN;
      else return item.name.VN;
    },
    [language],
  );
  const renderItem = useCallback(
    ({item, index}) => {
      console.log('flatlist');
      return (
        <View key={index}>
          <Text>{name(item)}</Text>
          {/* <Text>{name()}</Text> */}
          {/* <Text>{item.name.EN}</Text> */}
        </View>
      );
    },
    [language],
  );
  //   const renderItem = ({item, index}) => {
  //     console.log('flatlist');
  //     return (
  //       <View key={index}>
  //         <Text>{name}</Text>
  //         {/* <Text>{name()}</Text> */}
  //         {/* <Text>{item.name.EN}</Text> */}
  //       </View>
  //     );
  //   };
  return (
    <View>
      <Text>Test_Memo</Text>
      <FlatList data={DATA} renderItem={renderItem} />
      <Button
        title="language"
        onPress={() => {
          if (language === 'English') {
            setLanguage('Vietnamese');
          } else setLanguage('English');
        }}
      />
      <Button title="number" onPress={() => setNumber(number + 1)} />
    </View>
  );
};

export default Test_Memo;
