import {createSlice} from '@reduxjs/toolkit';
import {resetStore} from '../Actions/resetAction';
const object = {
  planId: '',
  notificationId: '',
  content: '',
  isIncome: true,
};
const NotificationSlice = createSlice({
  name: 'Notification',
  initialState: [],
  reducers: {
    addNotificationToRedux(state, action) {
      state.push({...action.payload});
    },
    addNewNotificationToRedux(state, action) {
      state.push(...action.payload);
    },
    updateNotification(state, action) {
      let index = state.findIndex(value => value.planId === action.payload.id);
      let tmp = [...state];
      tmp[index] = action.payload.notification;
      return tmp;
    },
    deleteNotification(state, action) {
      return state.filter(notification => notification.id !== action.payload);
    },
    uploadNotification(state, action) {
      state = [...action.payload];
      return state;
    },
  },
  extraReducers: builder => {
    builder.addCase(resetStore, (state, action) => {
      return [];
    });
  },
});
export const {
  addNotificationToRedux,
  deleteNotification,
  updateNotification,
  uploadNotification,
  addNewNotificationToRedux,
} = NotificationSlice.actions;
export default NotificationSlice.reducer;
