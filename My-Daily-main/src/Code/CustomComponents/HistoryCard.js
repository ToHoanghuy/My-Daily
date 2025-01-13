import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {FONT_FAMILY} from '../Assets/Constants/FontCustom';
import FONT_COLORS from '../Assets/Constants/ColorCustom';
import Feather from 'react-native-vector-icons/Feather';
import dayjs from 'dayjs';
const HistoryCard = ({
  isIncome,
  width,
  txtDate,
  currentValue,
  previousValue,
  currency,
  fontSize = 13,
  fontFamily = FONT_FAMILY.Regular,
  language,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          width: width,
          borderColor: isIncome ? FONT_COLORS.blue : FONT_COLORS.orange,
          backgroundColor: isIncome ? FONT_COLORS.blue : FONT_COLORS.orange,
        },
      ]}>
      <View style={styles.circle_contain}>
        <View style={styles.circle} />
      </View>
      <View style={styles.card_container}>
        <View style={styles.content}>
          <Text style={[styles.text, {color: '#7A7A7A', fontSize: 12}]}>
            {dayjs(txtDate).format('DD/MM/YYYY')}
          </Text>
          <Text
            style={[styles.text, {fontFamily, fontSize}]}
            adjustsFontSizeToFit>
            {`${language.newBudget}:  ${currentValue} ${currency}`}
          </Text>
          <Text
            style={[styles.text, {fontFamily, fontSize}]}
            adjustsFontSizeToFit>
            {`${language.oldBudget}:  ${previousValue} ${currency}`}
          </Text>
        </View>
        <Feather
          name={
            Number(currentValue) - Number(previousValue) > 0
              ? 'trending-up'
              : 'trending-down'
          }
          color={
            Number(currentValue) - Number(previousValue) > 0
              ? '#70c661'
              : '#e65b5b'
          }
          size={30}
          style={{marginRight: 15}}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    paddingHorizontal: 1.5,
    paddingTop: 0.5,
    paddingBottom: 1,
  },
  text: {
    color: '#000',
    marginVertical: 3,
  },
  circle_contain: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '5%',
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 100,
    backgroundColor: '#fff',
  },
  card_container: {
    backgroundColor: '#fff',
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
});
export default React.memo(HistoryCard);
