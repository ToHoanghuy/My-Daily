import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  UIManager,
  LayoutAnimation,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React from 'react';
import {FONT_FAMILY} from '../../../Assets/Constants/FontCustom';
import ColorCustom from '../../../Assets/Constants/ColorCustom';
import Card from './Card';
import {useSelector} from 'react-redux';
import NoDataFond from '../../../CustomComponents/NoDataFond';
import {useNetInfo} from '@react-native-community/netinfo';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const DAY = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const NGAY = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
];
const ListCard = ({
  walletIndex,
  currencySetting,
  setInout,
  setOpenDetailIO,
  WALLET,
  openDetail,
  setOpenDetail,
  openScroll,
}) => {
  const TRANSACTIONS = useSelector(state => state.Transactions);
  const language = useSelector(state => state.UserSetting).language;
  const netifo = useNetInfo();
  if (
    TRANSACTIONS[walletIndex] === undefined ||
    TRANSACTIONS[walletIndex].data.length === 0
  ) {
    return <NoDataFond fontSize={14} widthImage={150} heightImage={150} />;
  }
  return (
    <ScrollView
      removeClippedSubviews
      renderToHardwareTextureAndroid
      scrollEnabled={openScroll}>
      {TRANSACTIONS[walletIndex].data.map((item, index) => {
        return (
          <View key={index} style={styles.card}>
            {/* Header */}
            <Pressable
              onPress={() => {
                if (netifo.isConnected === true) {
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut,
                  );
                  setOpenDetail(openDetail === index ? null : index);
                }
                if (netifo.isConnected === false) {
                  ToastAndroid.show(
                    language === 'English'
                      ? 'Your internet is occuring a problem'
                      : 'Mất kết nối internet',
                    ToastAndroid.SHORT,
                  );
                }
              }}
              style={styles.cardPressable}>
              <View
                style={[
                  styles.cardPressable,
                  {
                    justifyContent: 'center',
                  },
                ]}>
                <View style={{paddingRight: 5}}>
                  <Text style={styles.dateTxt}>{item.date}</Text>
                </View>
                <View>
                  <Text style={styles.monthYearTxt}>
                    {language === 'English'
                      ? DAY[
                          new Date(
                            `${item.year}-${item.month}-${item.date}`,
                          ).getDay()
                        ]
                      : NGAY[
                          new Date(
                            `${item.year}-${item.month}-${item.date}`,
                          ).getDay()
                        ]}
                  </Text>
                  <Text style={styles.monthYearTxt}>
                    {item.month}/{item.year}
                  </Text>
                </View>
              </View>

              <View>
                <Text style={[styles.money, {color: ColorCustom.orange}]}>
                  {item.outcome} {currencySetting}
                </Text>
                <Text style={[styles.money, {color: ColorCustom.blue}]}>
                  {item.income} {currencySetting}
                </Text>
              </View>
            </Pressable>
            {openDetail === index && (
              <View>
                <View style={styles.border} />
                <Card
                  currency={currencySetting}
                  wallet={WALLET[walletIndex].name}
                  date={item.date}
                  month={item.month}
                  year={item.year}
                  setInout={setInout}
                  setOpenDetailIO={setOpenDetailIO}
                  setOpenDetail={setOpenDetail}
                  language={language}
                />
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

export const styles = StyleSheet.create({
  card: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: ColorCustom.green,
    borderRadius: 10,
    backgroundColor: ColorCustom.white,
  },
  cardPressable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTxt: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: 36,
    color: ColorCustom.black,
  },
  monthYearTxt: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: 12,
    color: ColorCustom.black,
  },
  money: {
    fontFamily: FONT_FAMILY.Bold,
    fontSize: 16,
    textAlign: 'right',
  },
  border: {
    backgroundColor: ColorCustom.middleGrey,
    height: 0.5,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    height: 40,
    width: 40,
    borderRadius: 99,
  },
  itemTxt: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: 14,
    color: '#000000',
    width: '40%',
  },
});
export default ListCard;
