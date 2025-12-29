import { createSlice } from "@reduxjs/toolkit";
import { storeCreateThunk } from "../thunks/storeCreateThunk.js";
import { storeGetThunk } from "../thunks/storeGetThunk.js";
import { storeDeleteThunk } from "../thunks/storeDeleteThunk.js";


const initialState = {
  store: [],
  status: 'idle',
  error: null,
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    resetStoreStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 매장 생성 처리
      .addCase(storeCreateThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(storeCreateThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stores.push(action.payload); // 새로 생성된 매장을 목록에 추가
      })
      .addCase(storeCreateThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

      // 매장 목록 조회
      .addCase(storeGetThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(storeGetThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stores = action.payload; // 조회된 매장 목록으로 상태 업뎃
      })
      .addCase(storeGetThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

      // 매장 삭제
      .addCase(storeDeleteThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(storeDeleteThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // 삭제된 매장 목록에서 제거
        state.stores = state.stores.filter(store => store.id !== action.payload.id);
      })
      .addCase(storeDeleteThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
  }
})

export const { 
  resetStoreStatus 
} = storeSlice.actions;

export default storeSlice.reducer;