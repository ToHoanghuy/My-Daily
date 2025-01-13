import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  StatusBar,
  ToastAndroid,
} from 'react-native';
import React from 'react';
import {styles} from './Statistic';
import DropdownTxtComponent from '../../../CustomComponents/DropdownTxtComponent';
import {useState} from 'react';
import {useCallback} from 'react';
import {FONT_SIZE} from '../../../Assets/Constants/FontCustom';
import {FONT_FAMILY} from '../../../Assets/Constants/FontCustom';
import ColorCustom from '../../../Assets/Constants/ColorCustom';
import Entypo from 'react-native-vector-icons/Entypo';

import Calendar from '../../../CustomComponents/CalendarComponent/Calendar';
import dayjs from 'dayjs';
import {useEffect} from 'react';
import {memo} from 'react';
import {QUARTER, MONTH, YEARS} from '../../../Assets/Data/Months';

const StatisticModal = ({
  openModalStatistic,
  setOpenModalStatistic,
  typeStatistic,
  language,
  onFinish,
  setLoading,
}) => {
  const [openDropYear, setOpenDropYear] = useState(false);
  const [openCalendarStart, setOpenCalendarStart] = useState(false);
  const [openCalendarEnd, setOpenCalendarEnd] = useState(false);

  const [year, setYear] = useState('');
  //Quarter
  const [quarter, setQuarter] = useState('');
  const [openDropQuarter, setOpenDropQuarter] = useState(false);
  //Month
  const [month, setMonth] = useState('');
  const [openDropMonth, setOpenDropMonth] = useState(false);

  //Customize
  const [startingDate, setStartingDate] = useState(new Date());
  const [endingDate, setEndingDate] = useState(new Date());
  const [error, setError] = useState(false);
  useEffect(() => {
    setError(false);
  }, [typeStatistic]);
  const cancelModal = useCallback(() => {
    setOpenModalStatistic(!openModalStatistic);
    setOpenDropMonth(false);
    setOpenDropYear(false);
    setOpenDropQuarter(false);
  }, [openModalStatistic]);
  const onComplete = () => {
    //setLoading(true);
    if (typeStatistic === 'Year') {
      setOpenModalStatistic(!openModalStatistic);
      onFinish(year, quarter, month, startingDate, endingDate);
      setError(false);
    }
    if (typeStatistic === 'Quarter') {
      if (year !== '' && quarter !== '') {
        setOpenModalStatistic(!openModalStatistic);
        onFinish(year, quarter, month, startingDate, endingDate);
        setError(false);
      } else {
        setError(true);
      }
    }
    if (typeStatistic === 'Month') {
      if (year !== '' && month !== '') {
        setOpenModalStatistic(!openModalStatistic);
        onFinish(year, quarter, month, startingDate, endingDate);
        setError(false);
      } else {
        setError(true);
      }
    }
    if (typeStatistic === 'Customize') {
      if (startingDate !== '' && endingDate !== '') {
        if (dayjs(startingDate).valueOf() > dayjs(endingDate).valueOf()) {
          ToastAndroid.show(
            language === 'English'
              ? 'Starting date must lower than ending date'
              : 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc',
            ToastAndroid.LONG,
          );
        } else {
          setOpenModalStatistic(!openModalStatistic);
          onFinish(year, quarter, month, startingDate, endingDate);
          setError(false);
        }
      } else {
        setError(true);
      }
    }
  };
  return (
    <Modal
      visible={openModalStatistic}
      onRequestClose={cancelModal}
      transparent
      statusBarTranslucent>
      <View style={styles.modal_container}>
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={cancelModal}
        />
        <View style={styles.modal_quater}>
          <Text
            style={[
              styles.modal_txt,
              {color: error ? ColorCustom.red : ColorCustom.green},
            ]}>
            {language.statisticQuater.header}
          </Text>
          {typeStatistic === 'Quarter' && (
            <>
              <View style={styles.modal_subContainer}>
                <Text style={styles.modal_txt_1}>
                  {language.statisticQuater.titleYear}
                </Text>
                <View>
                  <DropdownTxtComponent
                    width={250}
                    height={40}
                    data={YEARS}
                    choose={year}
                    setChoose={setYear}
                    fontSize={FONT_SIZE.TXT_SIZE}
                    fontFamily={FONT_FAMILY.Medium}
                    color={ColorCustom.black}
                    open={openDropYear}
                    setOpen={setOpenDropYear}
                    placeHolder={language.statisticQuater.titleYear}
                    zIndex={999}
                    additional={StatusBar.currentHeight}
                  />
                </View>
              </View>
              <View style={styles.modal_subContainer}>
                <Text style={styles.modal_txt_1}>
                  {language.statisticQuater.titleQuater}
                </Text>
                <View>
                  <DropdownTxtComponent
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
                    placeHolder={language.statisticQuater.titleQuater}
                    zIndex={99}
                    additional={StatusBar.currentHeight}
                  />
                </View>
              </View>
            </>
          )}
          {typeStatistic === 'Month' && (
            <>
              <View style={styles.modal_subContainer}>
                <Text style={styles.modal_txt_1}>
                  {language.statisticMonth.titleYear}
                </Text>
                <View>
                  <DropdownTxtComponent
                    width={250}
                    height={40}
                    data={YEARS}
                    choose={year}
                    setChoose={setYear}
                    fontSize={FONT_SIZE.TXT_SIZE}
                    fontFamily={FONT_FAMILY.Medium}
                    color={ColorCustom.black}
                    open={openDropYear}
                    setOpen={setOpenDropYear}
                    placeHolder={language.statisticMonth.titleYear}
                    zIndex={9999}
                    additional={StatusBar.currentHeight}
                  />
                </View>
              </View>
              <View style={styles.modal_subContainer}>
                <Text style={styles.modal_txt_1}>
                  {language.statisticMonth.titleMonth}
                </Text>
                <View>
                  <DropdownTxtComponent
                    width={250}
                    height={40}
                    data={MONTH}
                    choose={month}
                    setChoose={setMonth}
                    fontSize={FONT_SIZE.TXT_SIZE}
                    fontFamily={FONT_FAMILY.Medium}
                    color={ColorCustom.black}
                    open={openDropMonth}
                    setOpen={setOpenDropMonth}
                    placeHolder={'Month'}
                    zIndex={999}
                    additional={StatusBar.currentHeight}
                  />
                </View>
              </View>
            </>
          )}
          {typeStatistic === 'Customize' && (
            <>
              <View style={{marginVertical: 10}}>
                <Text style={styles.modal_txt_1}>
                  {language.statisticCustomize.titleStartingDate}
                </Text>

                <View style={styles.modal_customize}>
                  <Text
                    style={[
                      styles.modal_txt,
                      {
                        color: ColorCustom.black,
                        flex: 1,
                        paddingVertical: 15,
                      },
                    ]}>
                    {dayjs(startingDate).format('DD/MM/YYYY')}
                  </Text>
                  <Pressable
                    onPress={() => setOpenCalendarStart(!openCalendarStart)}>
                    <Entypo
                      name="calendar"
                      size={24}
                      color={ColorCustom.gray}
                    />
                  </Pressable>
                </View>
              </View>
              <View style={{marginVertical: 10}}>
                <Text style={styles.modal_txt_1}>
                  {language.statisticCustomize.titleEndingDate}
                </Text>
                <View style={styles.modal_customize}>
                  <Text
                    style={[
                      styles.modal_txt,
                      {
                        color: ColorCustom.black,
                        flex: 1,
                        paddingVertical: 15,
                      },
                    ]}>
                    {dayjs(endingDate).format('DD/MM/YYYY')}
                  </Text>
                  <Pressable
                    onPress={() => setOpenCalendarEnd(!openCalendarEnd)}>
                    <Entypo
                      name="calendar"
                      size={24}
                      color={ColorCustom.gray}
                    />
                  </Pressable>
                </View>
              </View>
            </>
          )}
          <Pressable style={styles.modal_pressable} onPress={onComplete}>
            <Text style={styles.modal_txt_press}>{language.btnModal}</Text>
          </Pressable>
        </View>
        <Calendar
          open={openCalendarStart}
          setOpen={setOpenCalendarStart}
          setDatePicker={date => setStartingDate(new Date(date))}
        />
        <Calendar
          open={openCalendarEnd}
          setOpen={setOpenCalendarEnd}
          setDatePicker={date => setEndingDate(new Date(date))}
        />
      </View>
    </Modal>
  );
};

export default memo(StatisticModal);
