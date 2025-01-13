import {
  View,
  Text,
  Pressable,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useCallback} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {styles} from './InsertOutcome';
import dayjs from 'dayjs';
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const DropDownPlan = ({
  width,
  height,
  data,
  select,
  setSelect,
  open,
  setOpen,
  color,
  setData,
  language,
}) => {
  const onSelect = useCallback(
    (item, index) => {
      setSelect([
        ...select,
        {
          planId: item.planId,
          planName: item.planName,
          currency: item.currency,
          budget: item.budget,
          current: item.current,
        },
      ]);
      let tmp = data;
      tmp.splice(index, 1);
      setData([...tmp]);
    },
    [data, select],
  );
  const onDelete = useCallback(
    (item, index) => {
      let tmp = data;
      tmp.splice(index, 0, {...item});
      setData([...tmp]);
      let tmpSelect = [...select];
      tmpSelect.splice(index, 1);
      setSelect([...tmpSelect]);
    },
    [data, select],
  );
  useEffect(() => {
    if (data.length === 0) {
      setOpen(false);
    }
  }, [data]);
  return (
    <Pressable
      onPress={() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setOpen(!open);
      }}
      style={[
        {
          width,
          height: height,
        },
        open && {height: (data.length > 3 ? 4 : data.length + 1) * height},
      ]}>
      <View style={[dropStyles.container]}>
        <View style={[{width}, dropStyles.text_input]}>
          {select.length === 0 ? (
            <View>
              <Text style={[styles.text_button, {margin: 10}]}>
                {language === 'English'
                  ? `All Ongoing Plans`
                  : `Tất cả kế hoạch đang thực hiện`}
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              style={{width: '90%'}}
              showsHorizontalScrollIndicator={false}>
              {select?.map((item, index) => (
                <Pressable
                  style={[{borderColor: color}, dropStyles.itemPress]}
                  key={index}
                  onPress={() => onDelete(item, index)}>
                  <Text
                    style={[styles.text_button, {color: '#000'}]}
                    adjustsFontSizeToFit>
                    {item.planName}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}

          <Ionicons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={'grey'}
            adjustsFontSizeToFit
          />
          {/* </Pressable> */}
        </View>
        {open && (
          <ScrollView
            style={{
              width: width - 1,
              height: (data.length > 3 ? 3 : data.length) * height,
              backgroundColor: '#fff',
              borderRadius: 15,
            }}
            showsVerticalScrollIndicator={false}
            snapToInterval={height}>
            {data.map((item, index) => {
              return (
                <Pressable
                  key={index}
                  style={[{height}, dropStyles.press]}
                  onPress={() => onSelect(item, index)}>
                  <Text
                    style={[styles.text_button, {color: '#000'}]}
                    adjustsFontSizeToFit>
                    {item.planName}
                  </Text>
                  <Text
                    style={[styles.text_button, {fontSize: 12}]}
                    adjustsFontSizeToFit>
                    {dayjs(item.dateStart).format('DD/MM/YY')}
                    {' -  '}
                    {dayjs(item.dateFinish).format('DD/MM/YY')}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>
    </Pressable>
  );
};
const dropStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    borderWidth: 1,
    zIndex: 999,
    borderColor: 'grey',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  text_input: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingRight: 10,
  },
  press: {
    borderTopWidth: 1,
    borderColor: 'grey',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  itemPress: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    margin: 5,
  },
});
export default React.memo(DropDownPlan);
