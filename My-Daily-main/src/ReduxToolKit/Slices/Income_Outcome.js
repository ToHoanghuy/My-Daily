import {createSlice} from '@reduxjs/toolkit';
import {resetStore} from '../Actions/resetAction';
const object = {
  IOKey: '',
  name: '',
  value: 0,
  isIncome: true,
  time: new Date(),
  icon_name: '',
  icon_color: 'blue',
  note: '',
  image: [''],
};
const Income_Outcome = createSlice({
  name: 'Income_Outcome',
  initialState: [],
  reducers: {
    addInOut: (state, action) => {
      state.push(action.payload);
    },
    removeInOut: (state, action) => {
      return state.filter(category => category.IOKey !== action.payload);
    },
    changeInOut: (state, action) => {
      // only allow user to change name, value, time, icon_name, note, image
      const index = state.findIndex(
        category => category.IOKey === action.payload.id,
      );
      let tmp = [...state];
      tmp[index] = action.payload.category;
      return tmp;
    },
  },
  extraReducers: builder => {
    builder.addCase(resetStore, (state, action) => {
      return [];
    });
  },
});

export const {addInOut, removeInOut, changeInOut} = Income_Outcome.actions;
export default Income_Outcome.reducer;
