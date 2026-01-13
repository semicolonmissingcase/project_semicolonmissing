/**
 * @file src/store/slices/banksSlice.js
 * @description banks Slice
 * 260112 yh init
 */

import { createSlice } from "@reduxjs/toolkit";
import banksThunk from "../thunks/banksThunk.js";

const initialState = {
  bankList: null,
  error: null,
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    clearBankSlice: (state) => {
      state.bankList = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(banksThunk.getBanksThunk.fulfilled, (state, action) => {
        state.bankList = action.payload.data;
      })
      ;
  }
})

export const { 
  clearBankSlice 
} = storeSlice.actions;

export default storeSlice.reducer;