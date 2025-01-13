import {View, Text} from 'react-native';
import React, {useState} from 'react';
import DropdownImageComponent from '../CustomComponents/DropdownImageComponent';
import DropdownTxtComponent from '../CustomComponents/DropdownTxtComponent';
import {FONT_FAMILY, FONT_SIZE} from '../Assets/Constants/FontCustom';
import ColorCustom from '../Assets/Constants/ColorCustom';
const QUARTER = ['1', '2', '2', '12', '123'];

const TestDropdown = () => {
  const [typeMoney, setTypeMoney] = useState('');
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [quarter, setQuarter] = useState('');
  const [openDropQuarter, setOpenDropQuarter] = useState(false);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      {/* <DropdownImageComponent
        width={300}
        height={50}
        typeMoney={typeMoney}
        setTypeMoney={setTypeMoney}
        open={open}
        setOpen={setOpen}
        placeHolder={'Choose kinds of money'}
      /> */}

      <View
        style={{
          width: '80%',
          borderWidth: 1,
          alignItems: 'center',

          paddingVertical: 20,
        }}>
        {/* <DropdownTxtComponent
          width={250}
          height={40}
          data={QUARTER}
          choose={quarter}
          setChoose={setQuarter}
          fontSize={FONT_SIZE.TXT_SIZE}
          fontFamily={FONT_FAMILY.Medium}
          color={ColorCustom.black}
          open={openDropQuarter}
          setOpen={setOpenDropQuarter}
          placeHolder={'Quarter'}
          zIndex={999}
          scrollEnable={true}
        /> */}

        {/* <DropdownTxtComponent
          width={250}
          height={40}
          data={QUARTER}
          choose={quarter}
          setChoose={setQuarter}
          fontSize={FONT_SIZE.TXT_SIZE}
          fontFamily={FONT_FAMILY.Medium}
          color={ColorCustom.black}
          open={open1}
          setOpen={setOpen1}
          placeHolder={'Quarter'}
          zIndex={99}
          scrollEnable={true}
        /> */}
        <DropdownImageComponent />
      </View>
      <Text style={{color: 'black'}}>{typeMoney?.enName?.toString()}</Text>
    </View>
  );
};

export default TestDropdown;
