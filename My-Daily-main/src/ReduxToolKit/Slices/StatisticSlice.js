import {configureStore, createSlice} from '@reduxjs/toolkit';
import {resetStore} from '../Actions/resetAction';
import {changeWalletAction} from '../Actions/changeWalletAction';
const initialState = {
  year: [],
  month: {
    income: [],
    outcome: [],
    month: 1,
    year: 1,
    sumIncome: 0,
    sumOutcome: 0,
  },
  quarter: [],
  monthIncome: {},
  monthOutcome: {},
  monthIO: {},
};
const statisticSlice = createSlice({
  name: 'statisticSlice',
  initialState: {
    year: [],
    month: {
      income: [],
      outcome: [],
      month: 1,
      year: 1,
      sumIncome: 0,
      sumOutcome: 0,
    },
    monthDetail: {},
    quarter: [],
    customize: [],
    notifyUpdate: {},
    notifyChange: {},
    monthIncome: {},
    monthOutcome: {},
    monthIO: {},
  },
  reducers: {
    uploadDataYear: (state, action) => {
      state.year = [...action.payload];
    },

    uploadDataMonth: (state, action) => {
      if (action.payload) {
        state.month.year = action.payload.year;
        state.month.month = action.payload.month;
        state.month.income = [...action.payload.income];
        state.month.outcome = [...action.payload.outcome];
        state.month.sumIncome = action.payload.sumIncome;
        state.month.sumOutcome = action.payload.sumOutcome;
      } else {
        state.month = {
          income: [],
          outcome: [],
          month: 1,
          year: 1,
          sumIncome: 0,
          sumOutcome: 0,
        };
      }
    },
    updateDataMonth: (state, action) => {
      if (
        action.payload.year == state.month.year &&
        action.payload.month == state.month.month
      ) {
        if (action.payload.isIncome === 'Income') {
          let index = state.month.income.findIndex(
            t => t.name.EN === action.payload.name.EN,
          );
          if (index >= 0) {
            state.month.income[index].value += action.payload.value;
            if (state.month.income[index].value === 0) {
              state.month.income.splice(index, 1);
            }
          } else {
            state.month.income.push({
              iconName: action.payload.iconName,
              color: action.payload.color,
              isIncome: action.payload.isIncome,
              name: action.payload.name,
              value: +action.payload.value,
            });
          }
          state.month.sumIncome += action.payload.value;
        } else {
          let index = state.month.outcome.findIndex(
            t => t.name.EN === action.payload.name.EN,
          );
          if (index >= 0) {
            state.month.outcome[index].value += action.payload.value;
            if (state.month.outcome[index].value === 0) {
              state.month.outcome.splice(index, 1);
            }
          } else {
            state.month.outcome.push({
              iconName: action.payload.iconName,
              color: action.payload.color,
              isIncome: action.payload.isIncome,
              name: action.payload.name,
              value: +action.payload.value,
            });
          }
          state.month.sumOutcome += action.payload.value;
        }
      } else {
        if (action.payload.update !== 1) {
          state.month = {
            income: [],
            outcome: [],
            month: 1,
            year: 1,
            sumIncome: 0,
            sumOutcome: 0,
          };
          if (action.payload.isIncome === 'Income') {
            state.month.income.push({...action.payload});
            state.month.sumIncome += action.payload.value;
          } else {
            state.month.outcome.push({...action.payload});
            state.month.sumOutcome += action.payload.value;
          }
          state.month.month = action.payload.month;
          state.month.year = action.payload.year;
        }
      }
    },

    insertDataMonth: (state, action) => {
      state.month.income = [...action.payload];
      state.month.outcome = [...action.payload];
    },

    insertDataQuarter: (state, action) => {
      if (state.quarter.length === 3) {
        state.quarter = [];
      }
      const tmp = {...action.payload};
      state.quarter.push(tmp);
      return state;
    },
    uploadDataQuarter: (state, action) => {
      state.quarter = [...action.payload];
      return;
    },
    resetDataQuarter: (state, action) => {
      state.quarter = [];
      return;
    },
    changeStatistic: (state, action) => {
      if (
        state.year.length > 0 ||
        Object.keys(state.monthIncome).length !== 0 ||
        Object.keys(state.monthOutcome).length !== 0 ||
        state.quarter.length > 0 ||
        Object.keys(state.customize).length !== 0
      )
        state.notifyUpdate = action.payload;
    },
    changeStatisticDetail: (state, action) => {
      if (
        state.year.length > 0 ||
        Object.keys(state.monthIncome).length !== 0 ||
        Object.keys(state.monthOutcome).length !== 0 ||
        state.quarter.length > 0 ||
        Object.keys(state.customize).length !== 0
      )
        state.notifyChange = action.payload;
    },
    updateYear: (state, action) => {
      if (state.year.length === 0) {
        if (action.payload.isIncome === 'Income') {
          state.year.push({
            income: action.payload.value,
            outcome: 0,
            month: action.payload.month,
          });
        } else {
          state.year.push({
            income: 0,
            outcome: action.payload.value,
            month: action.payload.month,
          });
        }
      } else {
        if (action.payload.isIncome === 'Income') {
          state.year[action.payload.index].income += action.payload.value;
        } else {
          state.year[action.payload.index].outcome += action.payload.value;
        }
      }
    },
    updateQuarterDetail: (state, action) => {
      if (action.payload.isIncome === 'Income') {
        state.quarter[action.payload.index].sumIncome += action.payload.value;
        let indexItem = state.quarter[action.payload.index].income.findIndex(
          item => item.name.EN === action.payload.name.EN,
        );
        state.quarter[action.payload.index].income[indexItem].value +=
          action.payload.value;
        if (state.quarter[action.payload.index].income[indexItem].value === 0) {
          state.quarter[action.payload.index].income.splice(indexItem, 1);
        }
      } else {
        state.quarter[action.payload.index].sumOutcome += action.payload.value;
        let indexItem = state.quarter[action.payload.index].outcome.findIndex(
          item => item.name.EN === action.payload.name.EN,
        );
        state.quarter[action.payload.index].outcome[indexItem].value +=
          action.payload.value;
        if (
          state.quarter[action.payload.index].outcome[indexItem].value === 0
        ) {
          state.quarter[action.payload.index].outcome.splice(indexItem, 1);
        }
      }
    },
    updateQuarter: (state, action) => {
      if (state.quarter.length > 0) {
        if (action.payload.index < state.quarter.length) {
          if (action.payload.isIncome === 'Income') {
            state.quarter[action.payload.index].sumIncome +=
              action.payload.value;
            state.quarter[action.payload.index].income.push(
              action.payload.data,
            );
          } else {
            state.quarter[action.payload.index].sumOutcome +=
              action.payload.value;
            state.quarter[action.payload.index].outcome.push(
              action.payload.data,
            );
          }
        }
      } else {
        if (action.payload.isIncome === 'Income') {
          state.quarter.push({
            sumIncome: action.payload.value,
            sumOutcome: 0,
            income: [{...action.payload.data}],
            outcome: [],
          });
        } else {
          state.quarter.push({
            sumOutcome: action.payload.value,
            sumIncome: 0,
            outcome: [{...action.payload.data}],
            income: [],
          });
        }
      }
    },
    insertCustomize: (state, action) => {
      const tmp = {...action.payload};
      state.customize.push(tmp);
      return state;
    },
    resetCustomize: (state, action) => {
      state.customize = [];
    },
    updateCustomize: (state, action) => {
      if (action.payload.isIncome === 'Income') {
        state.customize[action.payload.index].income.push(action.payload.data);
      } else {
        state.customize[action.payload.index].outcome.push(action.payload.data);
      }
    },
    updateCustomizeDetail: (state, action) => {
      if (action.payload.isIncome === 'Income') {
        let indexItem = state.customize[action.payload.index].income.findIndex(
          item => item.name.EN === action.payload.name.EN,
        );
        state.customize[action.payload.index].income[indexItem].value +=
          action.payload.value;
        if (
          state.customize[action.payload.index].income[indexItem].value === 0
        ) {
          state.customize[action.payload.index].income.splice(indexItem, 1);
        }
      } else {
        let indexItem = state.customize[action.payload.index].outcome.findIndex(
          item => item.name.EN === action.payload.name.EN,
        );
        state.customize[action.payload.index].outcome[indexItem].value +=
          action.payload.value;
        if (
          state.customize[action.payload.index].outcome[indexItem].value === 0
        ) {
          state.customize[action.payload.index].outcome.splice(indexItem, 1);
        }
      }
    },
    uploadMonthIncome: (state, action) => {
      state.monthIncome = {...action.payload};
    },
    uploadMonthOutcome: (state, action) => {
      state.monthOutcome = {...action.payload};
    },
    uploadMonthIO: (state, action) => {
      state.monthIO = {...action.payload};
    },
  },
  extraReducers: builder => {
    builder.addCase(resetStore, (state, action) => {
      return {
        year: [],
        month: {
          income: [],
          outcome: [],
          month: 1,
          year: 1,
          sumIncome: 0,
          sumOutcome: 0,
        },
        monthDetail: {},
        quarter: [],
        customize: [],
        notifyUpdate: {},
        notifyChange: {},
        monthIncome: {},
        monthOutcome: {},
        monthIO: {},
      };
    });
    builder.addCase(changeWalletAction, (state, action) => {
      state = {
        year: [],
        month: {
          income: [],
          outcome: [],
          month: 1,
          year: 1,
          sumIncome: 0,
          sumOutcome: 0,
        },
        monthDetail: {},
        quarter: [],
        customize: [],
        notifyUpdate: {},
        notifyChange: {},
        monthIncome: {},
        monthOutcome: {},
        monthIO: {},
      };
    });
  },
});
export const {
  insertCustomize,
  uploadDataMonth,
  uploadDataQuarter,
  uploadDataYear,
  insertDataMonth,
  uploadMonthIncome,
  uploadMonthOutcome,
  insertDataQuarter,
  resetDataQuarter,
  updateDataMonth,
  changeStatistic,
  updateYear,
  updateQuarter,
  changeStatisticDetail,
  updateCustomize,
  updateQuarterDetail,
  updateCustomizeDetail,
  uploadMonthIO,
  resetCustomize,
} = statisticSlice.actions;
export default statisticSlice.reducer;
