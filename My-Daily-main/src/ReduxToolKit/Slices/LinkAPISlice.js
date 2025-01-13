import {createSlice} from '@reduxjs/toolkit';
const initialState = '';
const LinkSlice = createSlice({
  name: 'LinkAPISlice',
  initialState,
  reducers: {
    updateLink(state, action) {
      if (action.payload) {
        state = action.payload;
      }
      return state;
    },
  },
});
export const {updateLink} = LinkSlice.actions;
export default LinkSlice.reducer;
