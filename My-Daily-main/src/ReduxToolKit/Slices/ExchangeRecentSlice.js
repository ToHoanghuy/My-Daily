import {compose, createSlice} from '@reduxjs/toolkit';
import {resetStore} from '../Actions/resetAction';
import {changeWalletAction} from '../Actions/changeWalletAction';

const exchangeRecent = createSlice({
  name: 'exchangeRecent',
  initialState: {
    income: [],
    outcome: [],
  },
  reducers: {
    uploadDataExchange: (state, action) => {
      state.income = action.payload.income;
      state.outcome = action.payload.outcome;
    },
    insertDataExchange: (state, action) => {
      if (action.payload?.reset === 1) {
        state.income = [];
        state.outcome = [];
      }
      if (action.payload.isIncome === 'Income') {
        let indexItem = state.income.findIndex(
          item => item.name.EN === action.payload.name.EN,
        );
        if (indexItem >= 0) {
          state.income[indexItem].value += action.payload.value;
        } else state.income.push(action.payload);
      } else {
        let indexItem = state.outcome.findIndex(
          item => item.name.EN === action.payload.name.EN,
        );
        if (indexItem >= 0) {
          state.outcome[indexItem].value += action.payload.value;
        } else state.outcome.push(action.payload);
      }
    },
    updateDataExchange: (state, action) => {
      if (action.payload.isIncome === 'Income') {
        let index = state.income.findIndex(
          i => i.name.EN === action.payload.name.EN,
        );
        if (index >= 0) {
          state.income[index].value += action.payload.money;
          if (state.income[index].value === 0) {
            state.income.splice(index, 1);
          }
        }
      } else {
        let index = state.outcome.findIndex(
          i => i.name.EN === action.payload.name.EN,
        );
        if (index >= 0) {
          state.outcome[index].value += action.payload.money;
          if (state.outcome[index].value === 0) {
            state.outcome.splice(index, 1);
          }
        }
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(resetStore, (state, action) => {
      return {
        income: [],
        outcome: [],
      };
    });
    builder.addCase(changeWalletAction, (state, action) => {
      state = {
        income: [],
        outcome: [],
      };
    });
  },
});
export const {uploadDataExchange, insertDataExchange, updateDataExchange} =
  exchangeRecent.actions;
export default exchangeRecent.reducer;
