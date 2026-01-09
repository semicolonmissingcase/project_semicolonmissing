import { createSlice } from "@reduxjs/toolkit";
import cleanersThunk from "../thunks/cleanersThunk.js";

const initialState = {
  // 회원가입 관련
  locations: [],
  isInitialized: false,

  // 계좌 관련
  accounts: [],
  id: null,
  cleanerId: null,
  bankCode: null,
  accountNumber: null,
  depositor: null,
  isDefault: null,

  // Show 관련
  submissions: null,
  reservation: null,

  // index 관련
  reservations: null,
  page: 0,
  offset: 4,
  isLasted: false,

  // 기타
  loading: true,
  error: null,
};

const slice = createSlice({
  name: 'cleaners',
  initialState,
  reducers: {
    clearCleaners(state) {
      state.reservation = null;
      state.submissions = null;
      state.reservations = null;
      state.isLasted = false;
      state.page = 0;
      state.accounts = [];
      state.id = null;
      state.cleanerId = null;
      state.bankCode = null;
      state.accountNumber = null;
      state.depositor = null;
      state.isDefault = null;
      state.locations = [];
      state.isInitialized = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 견적 상세 조회
      .addCase(cleanersThunk.showThunk.fulfilled, (state, action) => {
        const { reservation, submissions, locations } = action.payload.data;
        state.reservation = reservation;
        state.submissions = submissions;
        state.locations = locations;
        state.loading = false;
        state.error = null;
      })
      // 견적 목록 조회
      .addCase(cleanersThunk.indexThunk.fulfilled, (state, action) => {
        const { total, currentPage, reservations } = action.payload.data;
        if (state.reservations) {
          state.reservations = [...state.reservations, ...reservations];
        } else {
          state.reservations = reservations;
        }
        if (currentPage === Math.ceil(total / state.offset)) {
          state.isLasted = true;
        }
        state.page = currentPage;
        state.loading = false;
      })
      // 활동 지역 정보 (Pending)
      .addCase(cleanersThunk.locationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // 활동 지역 정보 (Fulfilled)
      .addCase(cleanersThunk.locationThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
        state.locations = action.payload;
        state.error = null;
      })
      // 활동 지역 정보 (Rejected)
      .addCase(cleanersThunk.locationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '활동 지역 정보 로드 실패';
      })
      /* 조회 */
      .addCase(cleanersThunk.fetchAccounts.pending, (state) => { state.loading = true; })
      .addCase(cleanersThunk.fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      /* 등록/수정 시 */
      .addCase(cleanersThunk.createAccount.fulfilled, (state, action) => {
        state.accounts.push(action.payload);
      })
      .addCase(cleanersThunk.updateAccount.fulfilled, (state, action) => {
        const index = state.accounts.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
      })
      .addCase(cleanersThunk.deleteAccount.fulfilled, (state, action) => {
        state.accounts = state.accounts.filter(a => a.id !== action.payload);
      })
      /* 에러 처리 공통 */
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.msg || "오류가 발생했습니다.";
        }
      );
  },
});

export const { clearCleaners } = slice.actions;
export default slice.reducer;