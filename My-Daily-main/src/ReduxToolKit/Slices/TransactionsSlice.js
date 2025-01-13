import {createSlice} from '@reduxjs/toolkit';
import {resetStore} from '../Actions/resetAction';

const transaction = createSlice({
  name: 'transaction',
  initialState: [],
  reducers: {
    uploadDataTransaction: (state, action) => {
      let index = state.findIndex(t => t.key === action.payload.key);
      if (index !== -1) {
        state[index].data = action.payload.data;
      } else {
        state.push({key: action.payload.key, data: action.payload.data});
      }
      return state;
    },
    addTransaction: (state, action) => {
      let date = action.payload.date;
      let month = action.payload.month;
      let year = action.payload.year;

      let wallet = action.payload.wallet;
      let indexWallet = state.findIndex(t => t.key === wallet);
      if (indexWallet >= 0) {
        if (state[indexWallet].data.length === 0) {
          if (action.payload.isIncome === 'Income') {
            state[indexWallet].data.push({
              date: date,
              month: month,
              year: year,
              income: action.payload.value,
              outcome: 0,
            });
          } else {
            state[indexWallet].data.push({
              date: date,
              month: month,
              year: year,
              income: 0,
              outcome: action.payload.value,
            });
          }
        } else {
          let initial = state[indexWallet].data.findIndex(d => {
            if (d.date == date && d.month == month && d.year == year)
              return true;
            return false;
          });
          if (initial >= 0) {
            if (action.payload.isIncome === 'Income') {
              state[indexWallet].data[initial].income += action.payload.value;
            } else {
              state[indexWallet].data[initial].outcome += action.payload.value;
            }
          } else {
            if (
              state[indexWallet].data[0].month === month &&
              state[indexWallet].data[0].year === year
            ) {
              if (action.payload.isIncome === 'Income') {
                state[indexWallet].data.push({
                  date: date,
                  month: month,
                  year: year,
                  income: action.payload.value,
                  outcome: 0,
                });
              } else {
                state[indexWallet].data.push({
                  date: date,
                  month: month,
                  year: year,
                  income: 0,
                  outcome: action.payload.value,
                });
              }
            }
          }
        }
      }
    },
    updateDataTransaction: (state, action) => {
      if (action.payload.value !== 0) {
        let walletName = action.payload.walletName.name;
        let value = action.payload.value;
        let date = action.payload.date;
        let indexWallet = state.findIndex(t => t.key === walletName);

        let indexData = state[indexWallet].data.findIndex(t => t.date === date);
        if (action.payload.isIncome === 'Income') {
          let data = state[indexWallet].data[indexData];
          data.income += value;

          state[indexWallet].data[indexData] = {...data};
        } else {
          let data = state[indexWallet].data[indexData];
          data.outcome += value;

          state[indexWallet].data[indexData] = {...data};
        }
        if (
          state[indexWallet].data[indexData].income === 0 &&
          state[indexWallet].data[indexData].outcome === 0
        ) {
          state[indexWallet].data.splice(indexData, 1);
        }
      }
    },
    deleteTransaction: (state, action) => {
      return state.filter(trans => trans.key !== action.payload);
    },
  },
  extraReducers: builder => {
    builder.addCase(resetStore, (state, action) => {
      return [];
    });
  },
});
export const {
  uploadDataTransaction,
  updateDataTransaction,
  addTransaction,
  deleteTransaction,
} = transaction.actions;
export default transaction.reducer;
