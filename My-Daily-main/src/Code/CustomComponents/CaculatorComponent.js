import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  Modal,
  StatusBar,
} from 'react-native';
import React, {useReducer} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {FONT_FAMILY, FONT_SIZE} from '../Assets/Constants/FontCustom';
import ColorCustom from '../Assets/Constants/ColorCustom';
import {BtnCaculator} from '../Assets/Data/ListBtnCaculator';
import {memo} from 'react';
const AC = 'AC';
const DELETE = 'DELETE';
const MODE = '%';
const MULTI = 'x';
const DIVIDE = '/';
const PLUS = '+';
const MINUS = '-';
const EQUAL = '=';
const COMMAS = ',';
const NUMBER = 'NUMBER';
const computeResult = (arr, currValue) => {
  switch (arr[1]) {
    case PLUS:
      return +arr[0] + +currValue;
    case MINUS:
      return +arr[0] - +currValue;

    case MULTI:
      return +arr[0] * +currValue;

    case DIVIDE:
      return +arr[0] / +currValue;

    case MODE:
      return +arr[0] % +currValue;

    default:
      break;
  }
};
const reducer = (state, action) => {
  switch (action.type) {
    case AC:
      return {
        ...state,
        currValue: '0',
        preValue: '0',
        expression: [],
      };
    case DELETE:
      return {
        ...state,
        currValue:
          state.currValue.length === 1 ? '0' : state.currValue.slice(0, -1),
      };
    case PLUS:
      if (state.expression.length === 2) {
        let result = computeResult(state.expression, state.currValue);

        return {
          ...state,
          expression:
            state.preValue !== '0' ? [state.preValue, '+'] : [result, '+'],
          currValue: '0',
          preValue: '0',
        };
      }
      if (state.expression.length === 3) {
        return {
          ...state,
          expression: [state.preValue, '+'],
          currValue: '0',
          preValue: '0',
        };
      }
      return {
        ...state,
        expression: [state.currValue, '+'],
        currValue: '0',
      };
    case MINUS:
      if (state.expression.length === 2) {
        let result = computeResult(state.expression, state.currValue);
        return {
          ...state,
          expression:
            state.preValue !== '0' ? [state.preValue, '-'] : [result, '-'],
          currValue: '0',
          preValue: '0',
        };
      }
      if (state.expression.length === 3) {
        return {
          ...state,
          expression: [state.preValue, '-'],
          currValue: '0',
          preValue: '0',
        };
      }
      return {
        ...state,
        expression: [state.currValue, '-'],
        currValue: '0',
      };
    case MULTI:
      if (state.expression.length === 2) {
        let result = computeResult(state.expression, state.currValue);
        return {
          ...state,
          expression:
            state.preValue !== '0' ? [state.preValue, 'x'] : [result, 'x'],
          currValue: '0',
          preValue: '0',
        };
      }
      if (state.expression.length === 3) {
        return {
          ...state,
          expression: [state.preValue, 'x'],
          currValue: '0',
          preValue: '0',
        };
      }
      return {
        ...state,
        expression: [state.currValue, 'x'],
        currValue: '0',
      };
    case DIVIDE:
      if (state.expression.length === 2) {
        let result = computeResult(state.expression, state.currValue);
        return {
          ...state,
          expression:
            state.preValue === '0' ? [state.preValue, '/'] : [result, '/'],
          currValue: '0',
          preValue: '0',
        };
      }
      if (state.expression.length === 3) {
        return {
          ...state,
          expression: [state.preValue, '/'],
          currValue: '0',
          preValue: '0',
        };
      }
      return {
        ...state,
        expression: [state.currValue, '/'],
        currValue: '0',
      };
    case MODE:
      if (state.expression.length === 2) {
        let result = computeResult(state.expression, state.currValue);
        return {
          ...state,
          expression:
            state.preValue === '0' ? [state.preValue, '%'] : [result, '%'],
          currValue: '0',
          preValue: '0',
        };
      }
      if (state.expression.length === 3) {
        return {
          ...state,
          expression: [state.preValue, '%'],
          currValue: '0',
          preValue: '0',
        };
      }
      return {
        ...state,
        expression: [state.currValue, '%'],
        currValue: '0',
      };
    case COMMAS:
      return {
        ...state,
        currValue: state.currValue + '.',
      };
    case NUMBER:
      return {
        ...state,
        currValue:
          state.currValue === '0'
            ? action.payload === '000'
              ? '0'
              : action.payload
            : state.currValue + action.payload,
        expression:
          state.preValue !== '0'
            ? [
                action.payload === '000'
                  ? state.preValue + action.payload
                  : state.preValue,
              ]
            : [...state.expression],
        preValue: '0',
      };
    case EQUAL:
      if (state.expression.length === 1) {
        return {
          ...state,
          expression: [state.currValue],
        };
      }
      let equal = computeResult(state.expression, action.payload || '0');
      return {
        ...state,
        expression: [...state.expression, state.currValue],
        currValue: equal,
        preValue: equal,
      };
    default:
      break;
  }
};
const CaculatorComponent = ({openModel, setOpenModel, setResultCompute}) => {
  const [state, dispatch] = useReducer(reducer, {
    preValue: '0',
    currValue: '0',
    expression: [],
  });
  const btnOnPress = value => {
    if (isNaN(+value)) {
      switch (value) {
        case 'AC':
          dispatch({type: AC});
          break;
        case 'Delete':
          if (state.preValue === '0') dispatch({type: DELETE});
          break;
        case '%':
          dispatch({type: MODE});
          break;
        case 'x':
          dispatch({type: MULTI});
          break;
        case '/':
          dispatch({type: DIVIDE});
          break;
        case '+':
          dispatch({type: PLUS});
          break;
        case '-':
          dispatch({type: MINUS});
          break;
        case '=':
          if (state.expression.length !== 0 && state.expression.length !== 3)
            dispatch({type: EQUAL, payload: state.currValue});
          break;
        case ',':
          dispatch({type: COMMAS});
          break;
        default:
          break;
      }
    } else {
      dispatch({type: NUMBER, payload: value});
    }
  };
  const renderBtn = ({item, index}) => {
    if (index === 1)
      return (
        <Pressable
          android_ripple={styles.configRiple}
          onPress={() => btnOnPress('Delete')}
          key={index}
          style={styles.pressBtn}>
          <Feather name={item} size={40} color="white" />
        </Pressable>
      );
    return (
      <Pressable
        android_ripple={styles.configRiple}
        onPress={() => btnOnPress(item)}
        key={index}
        style={styles.pressBtn}>
        <Text style={styles.txtBtn}>{item}</Text>
      </Pressable>
    );
  };
  return (
    <Modal
      visible={openModel}
      onRequestClose={() => setOpenModel(!openModel)}
      animationType="slide"
      statusBarTranslucent>
      <View style={styles.container}>
        {/*Header */}
        <View style={styles.header}>
          <Pressable onPress={() => setOpenModel(!openModel)}>
            <Feather name="x" size={34} color="#DF2828" />
          </Pressable>
          <Text style={styles.txt}>Caculator</Text>
          <Pressable
            onPress={() => {
              setResultCompute(state.currValue.toString());
              setOpenModel(!openModel);
            }}>
            <Feather name="check" size={34} color="#25A90F" />
          </Pressable>
        </View>
        {/*Result */}
        <View style={styles.containerResult}>
          <Text
            style={[styles.txt, {fontSize: 20}]}
            numberOfLines={1}
            adjustsFontSizeToFit={true}>
            {state?.expression.join(' ')}
          </Text>
          <Text
            style={[styles.txt, {fontSize: 40}]}
            numberOfLines={1}
            adjustsFontSizeToFit={true}>
            {state.currValue}
          </Text>
        </View>
        {/*List button*/}
        <View
          style={{
            flex: 1,
          }}>
          <FlatList
            data={BtnCaculator}
            renderItem={renderBtn}
            removeClippedSubviews={true}
            numColumns={4}
            columnWrapperStyle={styles.columnStyle}
          />
        </View>
      </View>
    </Modal>
  );
};

export default memo(CaculatorComponent);
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight,
  },
  txt: {
    fontFamily: FONT_FAMILY.Regular,
    fontSize: FONT_SIZE.TXT_LARGE_SIZE,
    letterSpacing: 1,
    color: ColorCustom.black,
  },
  columnStyle: {
    paddingHorizontal: 10,
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  txtBtn: {
    color: ColorCustom.white,
    fontFamily: FONT_FAMILY.Medium,
    fontSize: 20,
  },
  pressBtn: {
    backgroundColor: ColorCustom.green,
    width: 70,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 4,
  },
  configRiple: {
    color: 'hsl(151,82%,72%)',
    borderless: false,
    radius: 40,
  },
  containerResult: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flex: 0.7,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    backgroundColor: ColorCustom.white,
  },
});
