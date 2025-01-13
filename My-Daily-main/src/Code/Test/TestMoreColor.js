import {View, Text, Button} from 'react-native';
import React, {useState} from 'react';
import MoreColor from '../CustomComponents/MoreColor';

const TestMoreColor = () => {
  const [openModal, setOpenModal] = useState(false);
  const [colorPicker, setColorPicker] = useState('');
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <MoreColor
        openModal={openModal}
        setOpenModal={setOpenModal}
        setColorPicker={setColorPicker}
      />
      <Text style={{color: 'black'}}>{colorPicker}</Text>
      <Button title="Show Modal" onPress={() => setOpenModal(!openModal)} />
    </View>
  );
};

export default TestMoreColor;
