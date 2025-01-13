import {View, Text, Button} from 'react-native';
import React from 'react';
import Calendar from '../CustomComponents/CalendarComponent/Calendar';
import {useState} from 'react';

const Test_Calendar = () => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Calendar
        open={open}
        setOpen={setOpen}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <Button title="Open Calendar" onPress={() => setOpen(!open)} />
    </View>
  );
};

export default Test_Calendar;
