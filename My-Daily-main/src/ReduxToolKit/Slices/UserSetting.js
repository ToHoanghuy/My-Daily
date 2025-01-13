import {createSlice} from '@reduxjs/toolkit';
import {resetStore} from '../Actions/resetAction';
const UserSetting = createSlice({
  name: 'UserSetting',
  initialState: {
    id: '',
    language: 'English',
    currency: '',
    isNotification: false,
    isTouch: false,
    email: '',
    password: '',
    userImage: '',
    userName: '',
    isFirstVisit: false,
  },
  reducers: {
    changeLanguage: (state, action) => {
      state.language = action.payload;
    },
    changeCurrency: (state, action) => {
      state.currency = action.payload;
    },
    changeNotification: (state, action) => {
      state.isNotification = action.payload;
    },
    changeTouch: (state, action) => {
      state.isTouch = action.payload;
    },
    changeData: (state, action) => {
      state = {...action.payload};
      return state;
    },
  },
  extraReducers: builder => {
    builder.addCase(resetStore, (state, action) => {
      return {
        language: '',
        currency: '',
        isNotification: false,
        isTouch: false,
        email: '',
        password: '',
        userImage: '',
        userName: '',
        isFirstVisit: false,
      };
    });
  },
});
export const {
  changeLanguage,
  changeCurrency,
  changeNotification,
  changeTouch,
  changeData,
} = UserSetting.actions;
export default UserSetting.reducer;
