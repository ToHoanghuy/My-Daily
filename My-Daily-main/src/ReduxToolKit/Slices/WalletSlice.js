import {createSlice} from '@reduxjs/toolkit';
import {resetStore} from '../Actions/resetAction';
const object = {
  currency: 'USD',
  name: 'ACB',
  value: 1000000,
};
const WalletSlice = createSlice({
  name: 'Wallet',
  initialState: [],
  reducers: {
    addWallet: (state, action) => {
      const newWallet = {
        name: action.payload.name,
        value: +action.payload.value,
        currency: action.payload.currency,
      };
      state.push(newWallet);
    },
    loadDataWallet: (state, action) => {
      state = [...action.payload];
      return state;
    },
    deleteWalletRedux: (state, action) => {
      return state.filter(wallet => wallet.name !== action.payload);
    },
    sortWallet: (state, action) => {
      if (action.payload !== 0) {
        let tmp = state.filter(
          value => value.name !== state[action.payload].name,
        );
        tmp.unshift(state[action.payload]);
        return tmp;
      }
    },
    addWalletValue: (state, action) => {
      let index = state.findIndex(w => w.name === action.payload.name);
      state[index].value += Number(action.payload.value);
    },
  },
  extraReducers: builder => {
    builder.addCase(resetStore, (state, action) => {
      return [];
    });
  },
});
export const {
  addWallet,
  loadDataWallet,
  sortWallet,
  addWalletValue,
  deleteWalletRedux,
} = WalletSlice.actions;
export default WalletSlice.reducer;
