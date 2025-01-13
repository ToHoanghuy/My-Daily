import {createSlice} from '@reduxjs/toolkit';
const initialState = {isChangePass: false};
const SignalSlice = createSlice({
  name: 'SignalSlice',
  initialState,
  reducers: {
    changeSignalPass(state, action) {
      state.isChangePass = action.payload;
    },
  },
});
export const {changeSignalPass} = SignalSlice.actions;
export default SignalSlice.reducer;
