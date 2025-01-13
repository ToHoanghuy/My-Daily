import {View, Text, FlatList, Image, Button, TextInput} from 'react-native';
import React, {useEffect} from 'react';

import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../../Firebase/Firebase';
import {useGetAllProductQuery} from '../../ReduxToolKit/Slices/ProductSlices';
import {ConvertMoney} from '../CustomComponents/ConvertMoney';
import {useState} from 'react';
const GetData = () => {
  const [exchangeMoney, setExchangeMoney] = useState(8000);
  const getAPI = () => {
    const from = 'VND';
    const to = 'USD';
    ConvertMoney(from, to, exchangeMoney, setExchangeMoney);
  };
  console.log(exchangeMoney);
  return (
    <View
      style={{
        flex: 1,

        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Button title="GET API" onPress={getAPI} />
    </View>
  );
};

export default GetData;
