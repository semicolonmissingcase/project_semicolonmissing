import { createSlice } from "@reduxjs/toolkit";
import cleanersThunk from "../thunks/cleanersThunk.js";

const initialState = {
  cleanerLike: null,
  reservation: null,
  submissions: null,
  accountInfo: null,
}

const slice = createSlice({
  name: 'cleaners',
  initialState,
  reducers: {
    clearCleaners(state) {
      state.cleanerLike = null;
      state.reservation = null;
      state.submissions = null;
      state.accountInfo = null; //  clear 시 계좌 정보도 초기화
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 기존 showThunk 처리
      .addCase(cleanersThunk.showThunk.fulfilled, (state, action) => {
        const { cleanerLike, reservation, submissions } = action.payload.data;
        state.cleanerLike = cleanerLike;
        state.reservation = reservation;
        state.submissions = submissions;
        state.loading = false;
        state.error = null;
      })
      
      // =======================================================
      // ✅ accountInfoThunk 처리 로직 추가
      // =======================================================
      .addCase(cleanersThunk.accountInfoThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cleanersThunk.accountInfoThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        
        // 서버 응답 형태가 { rows: [...] }라고 가정하고 첫 번째 객체만 저장합니다.
        if (action.payload && action.payload.rows && action.payload.rows.length > 0) {
          state.accountInfo = action.payload.rows[0];
        } else {
          // 데이터가 없으면 null로 설정하거나 빈 객체로 설정합니다.
          state.accountInfo = null; 
        }
      })
      .addCase(cleanersThunk.accountInfoThunk.rejected, (state, action) => {
        state.loading = false;
        // 에러 페이로드를 저장하여 컴포넌트에서 상태를 활용할 수 있게 합니다.
        state.error = action.payload || '계좌 정보 로드 실패'; 
        state.accountInfo = null;
      });
      // =======================================================
  },
});

export const {
  clearCleaners,
} = slice.actions;

export default slice.reducer;