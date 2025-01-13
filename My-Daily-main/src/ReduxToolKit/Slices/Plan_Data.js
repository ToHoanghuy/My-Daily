import {createSlice} from '@reduxjs/toolkit';
import {resetStore} from '../Actions/resetAction';
const object = {
  budget: 0,
  current: 0,
  currency: 'USD',
  dateFinish: new Date(),
  dateStart: new Date(),
  isIncomePlan: true,
  planId: '',
  planName: '',
};
const PlanData = createSlice({
  name: 'PlanData',
  initialState: [],
  reducers: {
    // addPlan(state, action) {
    //   state.push(action.payload);
    // },
    addPlan(state, action) {
      state.splice(action.payload.position, 0, action.payload.plan);
    },
    deletePlan(state, action) {
      return state.filter(plan => plan.planId !== action.payload);
    },
    updatePlan(state, action) {
      let index = state.findIndex(value => value.planId === action.payload.id);
      let tmp = [...state];
      tmp[index] = action.payload.plan;
      return tmp;
    },
    uploadPlan(state, action) {
      state = [...action.payload];
      return state;
    },
    updateCurrent(state, action) {
      const currentVal = -action.payload.old + action.payload.new;
      let index = state.findIndex(p => p.planId === action.payload.id);
      if (index !== -1) {
        state[index].current += currentVal;
      }
      return state;
    },
  },
  extraReducers: builder => {
    builder.addCase(resetStore, (state, action) => {
      return [];
    });
  },
});

export const {addPlan, deletePlan, updatePlan, uploadPlan, updateCurrent} =
  PlanData.actions;
export default PlanData.reducer;
