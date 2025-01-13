import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, {useState, useMemo, useEffect} from 'react';
import ModalComponent from '../../../CustomComponents/ModalComponent';
import {styles} from './Planning';
import Feather from 'react-native-vector-icons/Feather';
import ColorCustom from '../../../Assets/Constants/ColorCustom';
import {FONT_FAMILY, FONT_SIZE} from '../../../Assets/Constants/FontCustom';
import CurrencyDropDown from '../../../CustomComponents/CurrencyDropDown';
import dayjs from 'dayjs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {uuidv4} from '@firebase/util';
import {addPlan, updatePlan} from '../../../../ReduxToolKit/Slices/Plan_Data';
import HistoryCard from '../../../CustomComponents/HistoryCard';
import {useDispatch, useSelector} from 'react-redux';
import {
  addDataPlan,
  addDataHistory,
} from '../../../Assets/FunctionCompute/AddData';
import {updateDataPlan} from '../../../Assets/FunctionCompute/UpdateData';
import {addScheduleNotification} from '../Notification/NotificationFunction';
import {useNetInfo} from '@react-native-community/netinfo';
import {Timestamp} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {convertTimestamptToDate} from '../Notification/Notification';
const ListCurrency = ['VND', 'USD', 'EUR', 'CNY', 'CAD', 'RUD', 'JPY'];
const ModalPlan = ({
  openModal,
  onClear,
  typeModal,
  languagePlan,
  errorType,
  setErrorType,
  planName,
  setPlanName,
  budget,
  setBudget,
  currency,
  setCurrency,
  errorDate,
  setErrorDate,
  dateStart,
  dateEnd,
  dataEdit,
  setDateType,
  setOpenCalendar,
  history,
  loading,
}) => {
  const PlanData = useSelector(state => state.PlanData);
  const uid = useSelector(state => state.UserSetting).id;
  const [inputType, setInputType] = useState('Outcome');
  const [openDropDown, setOpenDropDown] = useState(false);
  const dispatch = useDispatch();
  const netInfo = useNetInfo();
  const checkStatusDate = useMemo(() => {
    if (
      new Date(dateStart).getTime() < new Date().getTime() &&
      (new Date(dateEnd).getTime() > new Date().getTime() ||
        new Date(dateEnd).toDateString() === new Date().toDateString())
    ) {
      return 0; //On going
    }
    if (new Date(dateEnd).getTime() < new Date().getTime()) {
      return -1; //Completed
    }
    if (new Date(dateStart).getTime() > new Date().getTime()) {
      return 1; //Not started yet
    }
  }, [dateStart, dateEnd, typeModal]);
  useEffect(() => {
    const AddDataToDB = async () => {
      let planNoInternet = JSON.parse(
        await AsyncStorage.getItem('PLAN_NO_INTERNET'),
      );
      let EditNoInternet = JSON.parse(
        await AsyncStorage.getItem('EDIT_PLAN_NO_INTERNET'),
      );
      if (netInfo.isConnected && (planNoInternet || EditNoInternet)) {
        planNoInternet?.forEach(p => {
          addDataPlan(uid, {
            ...p,
            dateStart: Timestamp.fromDate(new Date(p.dateStart)),
            dateFinish: Timestamp.fromDate(new Date(p.dateFinish)),
          });
          if (p.isIncomePlan === 'Income') {
            addScheduleNotification(
              'PlanNotification',
              'Plan Notification',
              p.planName,
              languagePlan.txtNotification,
              p.ID,
            );
          }
        });
        EditNoInternet?.forEach(edit => {
          updateDataPlan(uid, edit.dataEdit.planId, {
            planName: edit.planName,
            budget: +edit.budget,
            dateFinish: Timestamp.fromDate(new Date(edit.dateEnd)),
          });
          if (edit.dataEdit.budget !== Number(edit.budget)) {
            addDataHistory(uid, edit.dataEdit.planId, {
              ...edit.newHistory,
              timeChange: Timestamp.fromDate(
                new Date(edit.newHistory.timeChange),
              ),
            });
          }
        });
        AsyncStorage.removeItem('PLAN_NO_INTERNET');
        AsyncStorage.removeItem('EDIT_PLAN_NO_INTERNET');
      }
    };
    AddDataToDB();
  }, [netInfo.isConnected]);
  const onChoose = async () => {
    if (typeModal === 'Add' || typeModal === 'Edit') {
      if (
        planName !== '' &&
        budget > 0 &&
        new Date(dateStart).getTime() <= new Date(dateEnd).getTime() &&
        new Date(dateStart).toDateString() !== new Date(dateEnd).toDateString()
      ) {
        setErrorDate(null);
        setErrorType(null);
        if (typeModal === 'Add') {
          let ID = uuidv4();
          const newData = {
            budget: +budget,
            current: 0,
            currency,
            dateFinish: dateEnd,
            dateStart: dateStart,
            isIncomePlan: inputType === 'Income' ? true : false,
            planName,
            planId: ID,
          };
          const position = PlanData.findIndex(
            plan =>
              new Date(plan.dateStart).getTime() <=
              new Date(dateStart).getTime(),
          );
          dispatch(addPlan({position: position, plan: newData}));

          if (netInfo.isConnected) {
            addDataPlan(uid, newData);
          } else {
            try {
              let planNoInternet = JSON.parse(
                await AsyncStorage.getItem('PLAN_NO_INTERNET'),
              );
              if (planNoInternet) {
                planNoInternet.push(newData);
              } else {
                planNoInternet = [{...newData}];
              }
              AsyncStorage.setItem(
                'PLAN_NO_INTERNET',
                JSON.stringify(planNoInternet),
              );
            } catch (e) {
              console.log(e);
            }
          }
        } else if (typeModal === 'Edit') {
          if (
            dataEdit.budget !== budget ||
            dataEdit.planName !== planName ||
            dataEdit.dateFinish !== dateEnd
          ) {
            const newHistory = {
              newBudget: +budget,
              oldBudget: dataEdit.budget,
              timeChange: new Date(),
            };
            dispatch(
              updatePlan({
                id: dataEdit.planId,
                plan: {
                  ...dataEdit,
                  planName,
                  budget: Number(budget),
                  dateFinish: dateEnd,
                },
              }),
            );
            if (netInfo.isConnected) {
              updateDataPlan(uid, dataEdit.planId, {
                planName,
                budget: Number(budget),
                dateFinish: dateEnd,
              });
              if (dataEdit.budget !== Number(budget)) {
                addDataHistory(uid, dataEdit.planId, newHistory);
              }
            } else {
              let EditPlan_NoInternet = JSON.parse(
                await AsyncStorage.getItem('EDIT_PLAN_NO_INTERNET'),
              );
              if (EditPlan_NoInternet) {
                EditPlan_NoInternet.push({
                  dataEdit,
                  planName,
                  budget,
                  dateEnd,
                  newHistory,
                });
              } else {
                EditPlan_NoInternet = [
                  {
                    dataEdit,
                    planName,
                    budget,
                    dateEnd,
                    newHistory,
                  },
                ];
              }
              await AsyncStorage.setItem(
                'EDIT_PLAN_NO_INTERNET',
                JSON.stringify(EditPlan_NoInternet),
              );
            }
          }
        }
        onClear();
      } else {
        if (planName === '' && budget === 0) {
          setErrorType(1);
        } else {
          if (planName === '') setErrorType(2);
          else if (budget === 0) setErrorType(3);
          else setErrorType(null);
        }
        if (
          new Date(dateStart).getTime() > new Date(dateEnd).getTime() ||
          new Date(dateStart).toDateString() ===
            new Date(dateEnd).toDateString()
        ) {
          setErrorDate(1);
        } else setErrorDate(null);
      }
    }
  };
  return (
    <ModalComponent visible={openModal} animationType="fade" zIndex={70}>
      <Pressable
        style={{flex: 1, backgroundColor: 'rgba(217,217,217,0.5)', zIndex: 1}}
        onPress={onClear}
      />
      <View style={{flex: 2, backgroundColor: ColorCustom.white, zIndex: 1}}>
        <ScrollView showsVerticalScrollIndicator={true} nestedScrollEnabled>
          <View style={styles.modal_container}>
            {/* HEADER */}
            <View style={styles.row}>
              <Pressable onPress={onClear}>
                <Feather name="x" size={30} color={ColorCustom.red} />
              </Pressable>
              <Text style={styles.header_text}>
                {typeModal === 'Add'
                  ? languagePlan.headerAdd
                  : typeModal === 'Details'
                  ? languagePlan.headerDetails
                  : languagePlan.headerEdit}
              </Text>
              {typeModal !== 'Details' ? (
                <Pressable onPress={onChoose}>
                  <Feather name="check" size={30} color={ColorCustom.green} />
                </Pressable>
              ) : (
                <View style={{width: 30, height: 30}} />
              )}
            </View>
            {/* BODY */}
            {(typeModal === 'Add' || typeModal === 'Edit') && (
              <View style={{marginTop: 10}}>
                {/* Button outcome income */}
                {typeModal === 'Add' && (
                  <View
                    style={[{alignSelf: 'center', width: '70%'}, styles.row]}>
                    <Pressable
                      style={[
                        styles.pressable,
                        {
                          borderColor:
                            inputType === 'Outcome'
                              ? ColorCustom.orange
                              : ColorCustom.middleGrey,
                        },
                      ]}
                      onPress={() => setInputType('Outcome')}
                      hitSlop={10}>
                      <Text
                        style={[
                          styles.text,
                          {fontSize: FONT_SIZE.TXT_SIZE},
                          {
                            color:
                              inputType === 'Outcome'
                                ? ColorCustom.orange
                                : ColorCustom.middleGrey,
                          },
                        ]}
                        adjustsFontSizeToFit>
                        {languagePlan.txtOutcome}
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.pressable,
                        {
                          borderColor:
                            inputType === 'Income'
                              ? ColorCustom.blue
                              : ColorCustom.middleGrey,
                        },
                      ]}
                      onPress={() => setInputType('Income')}
                      hitSlop={10}>
                      <Text
                        style={[
                          styles.text,
                          {fontSize: FONT_SIZE.TXT_SIZE},
                          {
                            color:
                              inputType === 'Income'
                                ? ColorCustom.blue
                                : ColorCustom.middleGrey,
                          },
                        ]}
                        adjustsFontSizeToFit>
                        {languagePlan.txtIncome}
                      </Text>
                    </Pressable>
                  </View>
                )}
                {/* PLAN NAME */}
                <View style={{paddingHorizontal: 10}}>
                  <View>
                    <Text
                      style={[styles.text, {marginTop: 10, marginBottom: 5}]}>
                      {languagePlan.txtPlan}
                    </Text>
                    <TextInput
                      style={[
                        styles.textinput,
                        {
                          borderColor:
                            errorType === 1 || errorType === 2
                              ? 'red'
                              : ColorCustom.middleGrey,
                          color:
                            inputType === 'Outcome'
                              ? ColorCustom.orange
                              : ColorCustom.blue,
                        },
                      ]}
                      defaultValue={planName}
                      onChangeText={setPlanName}
                    />
                    {(errorType === 1 || errorType == 2) && (
                      <View
                        style={[
                          styles.row,
                          {
                            borderWidth: 0,
                            marginTop: 2,
                            justifyContent: 'flex-start',
                          },
                        ]}>
                        <MaterialIcons
                          name="error"
                          size={15}
                          color={ColorCustom.red}
                          style={{marginRight: 5}}
                        />
                        <Text style={styles.error_txt}>
                          {languagePlan.error1}
                        </Text>
                      </View>
                    )}
                  </View>
                  {/* AMOUNT */}
                  <View>
                    <Text
                      style={[styles.text, {marginTop: 10, marginBottom: 5}]}>
                      {languagePlan.txtAmount}
                    </Text>
                    <View
                      style={{
                        zIndex: 50,
                        alignItems: 'flex-end',
                      }}>
                      <View
                        style={[
                          styles.row,
                          styles.textinput_container,
                          {
                            paddingHorizontal: 10,
                            borderColor:
                              errorType === 1 || errorType === 3
                                ? 'red'
                                : ColorCustom.middleGrey,
                            zIndex: 1,
                            top: 0,
                            left: 0,
                            position: 'absolute',
                            width: '100%',
                          },
                        ]}>
                        <TextInput
                          style={styles.textinput_small}
                          defaultValue={budget}
                          placeholder={'0'}
                          placeholderTextColor={ColorCustom.gray}
                          keyboardType="numeric"
                          onChangeText={setBudget}
                        />
                      </View>
                      <View style={styles.currency_dropdown}>
                        {typeModal === 'Add' ? (
                          <CurrencyDropDown
                            width={50}
                            height={30}
                            open={openDropDown}
                            setOpen={setOpenDropDown}
                            data={ListCurrency}
                            currency={currency}
                            setCurrency={setCurrency}
                          />
                        ) : (
                          <Text
                            style={{
                              color: '#000',
                              fontFamily: FONT_FAMILY.Regular,
                              fontSize: 13,
                              marginTop: 2,
                            }}>
                            {dataEdit.currency}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={{marginTop: openDropDown ? -90 : 0}}>
                      {(errorType === 1 || errorType === 3) && (
                        <View
                          style={[
                            styles.row,
                            {
                              borderWidth: 0,
                              marginTop: 10,
                              justifyContent: 'flex-start',
                              zIndex: 1,
                            },
                          ]}>
                          <MaterialIcons
                            name="error"
                            size={15}
                            color={ColorCustom.red}
                            style={{marginRight: 5}}
                          />
                          <Text style={styles.error_txt}>
                            {languagePlan.error1}
                          </Text>
                        </View>
                      )}
                    </View>
                    {/* DATE */}
                    <View>
                      <Text
                        style={[
                          styles.text,
                          {marginTop: 25, marginBottom: 5, zIndex: 1},
                        ]}>
                        {languagePlan.txtStartingDate}
                      </Text>
                      <View
                        style={[
                          styles.row,
                          styles.textinput_container,
                          {
                            paddingHorizontal: 10,
                            borderColor: errorDate
                              ? 'red'
                              : ColorCustom.middleGrey,
                            zIndex: 1,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.textinput_small,
                            {paddingVertical: 10},
                          ]}>
                          {dayjs(dateStart).format('DD/MM/YYYY')}
                        </Text>
                        <Pressable
                          hitSlop={10}
                          onPress={() => {
                            setDateType('Start');
                            setOpenCalendar(true);
                          }}>
                          {typeModal === 'Add' && (
                            <AntDesign
                              name="calendar"
                              size={20}
                              color={ColorCustom.middleGrey}
                              style={{marginRight: 5}}
                            />
                          )}
                        </Pressable>
                      </View>
                      {errorDate && (
                        <View style={[styles.row, styles.errorDate]}>
                          <MaterialIcons
                            name="error"
                            size={15}
                            color={ColorCustom.red}
                            style={{marginRight: 5}}
                          />
                          <Text style={styles.error_txt}>
                            {languagePlan.error2}
                          </Text>
                        </View>
                      )}
                      <Text
                        style={[styles.text, {marginTop: 10, marginBottom: 5}]}>
                        {languagePlan.txtFinishingDate}
                      </Text>
                      <View
                        style={[
                          styles.row,
                          styles.textinput_container,
                          {
                            paddingHorizontal: 10,
                            borderColor: errorDate
                              ? 'red'
                              : ColorCustom.middleGrey,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.textinput_small,
                            {paddingVertical: 10},
                          ]}>
                          {dayjs(dateEnd).format('DD/MM/YYYY')}
                        </Text>
                        <Pressable
                          hitSlop={10}
                          onPress={() => {
                            setDateType('End');
                            setOpenCalendar(true);
                          }}>
                          <AntDesign
                            name="calendar"
                            size={20}
                            color={ColorCustom.middleGrey}
                            style={{marginRight: 5}}
                          />
                        </Pressable>
                      </View>
                      {errorDate && (
                        <View style={[styles.row, styles.errorDate]}>
                          <MaterialIcons
                            name="error"
                            size={15}
                            color={ColorCustom.red}
                            style={{marginRight: 5}}
                          />
                          <Text style={styles.error_txt}>
                            {languagePlan.error2}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            )}
            {typeModal === 'Details' && (
              <View
                style={{
                  marginTop: 5,
                  paddingLeft: 10,
                }}>
                <View style={styles.row_space}>
                  <Text
                    style={[styles.text, styles.txt_left]}
                    adjustsFontSizeToFit>
                    {languagePlan.txtPlan}
                  </Text>
                  <Text
                    style={[
                      styles.text,
                      styles.txt_right,
                      {color: ColorCustom.orange},
                    ]}>
                    {dataEdit.planName}
                  </Text>
                </View>
                <View style={styles.row_space}>
                  <Text
                    style={[styles.text, styles.txt_left]}
                    adjustsFontSizeToFit>
                    {languagePlan.txtAmount}
                  </Text>
                  <Text style={[styles.text, styles.txt_right]}>
                    {`${dataEdit.budget}  ${dataEdit.currency}`}
                  </Text>
                </View>
                <View style={styles.row_space}>
                  <Text
                    style={[styles.text, styles.txt_left]}
                    adjustsFontSizeToFit>
                    {languagePlan.txtStartingDate}
                  </Text>
                  <Text style={[styles.text, styles.txt_right]}>
                    {dayjs(dataEdit.dateStart).format('DD/MM/YYYY')}
                  </Text>
                </View>
                <View style={styles.row_space}>
                  <Text
                    style={[styles.text, styles.txt_left]}
                    adjustsFontSizeToFit>
                    {languagePlan.txtFinishingDate}
                  </Text>
                  <Text style={[styles.text, styles.txt_right]}>
                    {dayjs(dataEdit.dateFinish).format('DD/MM/YYYY')}
                  </Text>
                </View>
                <View
                  style={[
                    styles.row,
                    {
                      justifyContent: 'flex-start',
                      marginVertical: 10,
                    },
                  ]}>
                  <Text
                    style={[styles.text, styles.txt_left]}
                    adjustsFontSizeToFit>
                    {languagePlan.txtStatus}
                  </Text>
                  <Text style={[styles.text, styles.txt_right]}>
                    {checkStatusDate === -1
                      ? languagePlan.txtCompleted
                      : checkStatusDate === 0
                      ? languagePlan.txtOngoing
                      : languagePlan.txtNotStarted}
                  </Text>
                </View>
                <View
                  style={[
                    styles.row,
                    {
                      marginVertical: 10,
                      alignItems: 'flex-start',
                    },
                  ]}>
                  <Text
                    style={[styles.text, styles.txt_left]}
                    adjustsFontSizeToFit>
                    {languagePlan.txtEvaluate}
                  </Text>

                  {(dataEdit.isIncomePlan === true &&
                    dataEdit.current >= dataEdit.budget) ||
                  (dataEdit.isIncomePlan === false &&
                    dataEdit.current <= dataEdit.budget) ? (
                    <Text
                      style={[
                        styles.text,
                        styles.txt_right,
                        {color: ColorCustom.green},
                      ]}>
                      {languagePlan.evaluate}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.text,
                        styles.txt_right,
                        {color: ColorCustom.red},
                      ]}
                      adjustsFontSizeToFit>
                      {dataEdit.isIncomePlan
                        ? `${languagePlan.incomeStatus} - ${
                            dataEdit.budget - dataEdit.current
                          } `
                        : `${languagePlan.outcomeStatus} - ${
                            dataEdit.current - dataEdit.budget
                          } `}
                      {dataEdit.currency}
                    </Text>
                  )}
                </View>
                {loading ? (
                  <View style={{width: '100%'}}>
                    <ActivityIndicator
                      color={ColorCustom.green}
                      size={'small'}
                    />
                  </View>
                ) : (
                  <>
                    {history?.map((item, index) => {
                      return (
                        <View
                          style={{
                            marginVertical: 10,
                          }}
                          key={index}>
                          <HistoryCard
                            width={'95%'}
                            txtDate={dayjs(
                              convertTimestamptToDate(item.timeChange),
                            ).format('YYYY/MM/DD')}
                            currentValue={item.newBudget}
                            previousValue={item.oldBudget}
                            currency={dataEdit.currency}
                            isIncome={dataEdit.isIncomePlan}
                            language={languagePlan}
                          />
                        </View>
                      );
                    })}
                  </>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </ModalComponent>
  );
};

export default ModalPlan;
