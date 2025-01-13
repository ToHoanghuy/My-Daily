import {combineReducers, configureStore} from '@reduxjs/toolkit';
import UserSetting from './Slices/UserSetting';
import Plan_Data from './Slices/Plan_Data';
import WalletSlice from './Slices/WalletSlice';
import StatisticSlice from './Slices/StatisticSlice';
import ExchangeRecentSlice from './Slices/ExchangeRecentSlice';
import NotificationSlice from './Slices/NotificationSlice';
import TransactionsSlice from './Slices/TransactionsSlice';
import SignalSlice from './Slices/SignalSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';
import LinkAPISlice from './Slices/LinkAPISlice';

const rootReducer = combineReducers({
  UserSetting: UserSetting,
  PlanData: Plan_Data,
  Wallet: WalletSlice,
  Statistics: StatisticSlice,
  Transactions: TransactionsSlice,
  ExchangeRecent: ExchangeRecentSlice,
  Notification: NotificationSlice,
  Signal: SignalSlice,
  LinkAPI: LinkAPISlice,
});
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
