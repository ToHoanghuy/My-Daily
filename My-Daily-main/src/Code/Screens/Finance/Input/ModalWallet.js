import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Dimensions,
  ToastAndroid,
  Modal,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import ModalComponent from '../../../CustomComponents/ModalComponent';
import Feather from 'react-native-vector-icons/Feather';
import {styles} from './InsertOutcome';
import ColorCustom from '../../../Assets/Constants/ColorCustom';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import DropdownImageComponent from '../../../CustomComponents/DropdownImageComponent';
import {useNetInfo} from '@react-native-community/netinfo';
const {width: WIDTH_SCREEN} = Dimensions.get('screen');
const ModalWallet = ({
  openWallet,
  setOpenWallet,
  setFocusInput,
  language,
  wallet,
  setWallet,
}) => {
  const netInfo = useNetInfo();
  const Ref = useRef(null);
  const [txtWallet, setTxtWallet] = useState('');
  const [txtAmount, setTxtAmount] = useState(0);
  const [txtCurrency, setTxtCurrency] = useState('');
  const [openCurrency, setOpenCurrency] = useState(false);
  const WALLET = useSelector(state => state.Wallet);
  const onCheck = () => {
    if (WALLET.some(w => w.name === txtWallet)) {
      ToastAndroid.showWithGravity(
        language.existWallet,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      return;
    }
    setWallet({
      currency: txtCurrency === '' ? 'USD' : txtCurrency.currencyCode,
      name: txtWallet,
      value: Number(txtAmount),
    });
    onClose();
  };
  const onClose = () => {
    setFocusInput();
    setTxtAmount(0);
    setTxtWallet('');
    setOpenWallet(false);
    setTxtCurrency('');
  };
  return (
    <Modal
      visible={openWallet}
      animationType="fade"
      transparent
      statusBarTranslucent>
      <View style={{flex: 1}}>
        <Pressable style={styles.back_drop} onPress={onClose} />
        <ScrollView
          style={{flex: 1, backgroundColor: '#fff'}}
          nestedScrollEnabled={true}>
          <ScrollView
            horizontal
            ref={Ref}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}>
            <View style={styles.modal_container}>
              <View style={styles.headerModal}>
                <Feather
                  name="x"
                  size={30}
                  color={ColorCustom.red}
                  onPress={onClose}
                />
                <Text style={[styles.text, {marginLeft: 0, fontSize: 20}]}>
                  {language.wallet}
                </Text>
                <Feather
                  name="plus"
                  size={30}
                  color={'#AB77FF'}
                  onPress={() => {
                    if (netInfo.isConnected) {
                      Ref.current?.scrollTo({
                        x: WIDTH_SCREEN,
                        y: 0,
                        animated: true,
                      });
                    }
                  }}
                />
              </View>
              <View style={{marginTop: 10}}>
                {WALLET.map((item, index) => {
                  return (
                    <Pressable
                      key={index}
                      onPress={() => {
                        setWallet(item);
                      }}
                      style={styles.pressable_wallet}>
                      <View
                        style={[
                          styles.headerModal,
                          {
                            paddingHorizontal: 0,
                            width: '90%',
                          },
                        ]}>
                        <Text
                          style={[styles.text_button, {color: '#000'}]}
                          adjustsFontSizeToFit>
                          {item.name}
                        </Text>
                        <Text
                          style={[styles.text_button, {color: '#000'}]}
                          adjustsFontSizeToFit>
                          {`${item.value} ${item.currency}`}
                        </Text>
                      </View>
                      {wallet.name === item.name && (
                        <View style={{marginLeft: 10}}>
                          <AntDesign
                            name="checkcircle"
                            size={20}
                            color={'#25A90F'}
                          />
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <View style={styles.modal_container}>
              <View style={styles.headerModal}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons
                    name="ios-arrow-back"
                    size={30}
                    color={'#000000'}
                    onPress={() => {
                      Ref.current?.scrollTo({
                        x: -WIDTH_SCREEN,
                        y: 0,
                        animated: true,
                      });
                    }}
                  />
                  <Text style={[styles.text, {fontSize: 20}]}>
                    {language.newWallet}
                  </Text>
                </View>
                <Ionicons
                  name="ios-checkmark-sharp"
                  size={30}
                  color={'#25A90F'}
                  onPress={() => {
                    onCheck();
                  }}
                />
              </View>
              <View style={styles.styleTextInput}>
                <Text style={styles.style_textinput}>{language.name}</Text>
                <TextInput
                  style={[styles.styleInput, styles.small_textinput]}
                  defaultValue={txtWallet}
                  onChangeText={setTxtWallet}
                />
              </View>
              <View style={styles.styleTextInput}>
                <Text style={styles.style_textinput}>{language.balance}</Text>
                <TextInput
                  style={[styles.styleInput, styles.small_textinput]}
                  defaultValue={txtAmount}
                  onChangeText={setTxtAmount}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.styleTextInput, {paddingBottom: 200}]}>
                <Text style={styles.style_textinput}>{language.currency}</Text>
                <DropdownImageComponent
                  width={WIDTH_SCREEN - 60}
                  height={50}
                  typeMoney={txtCurrency}
                  setTypeMoney={setTxtCurrency}
                  open={openCurrency}
                  setOpen={setOpenCurrency}
                  placeHolder={'United States Dollar'}
                />
              </View>
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default React.memo(ModalWallet);
