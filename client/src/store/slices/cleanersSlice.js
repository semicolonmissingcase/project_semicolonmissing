import { createSlice } from "@reduxjs/toolkit";
import cleanersThunk from "../thunks/cleanersThunk.js";

const initialState = {
  // 회원가입 관련
  locations: [],
  isInitialized: false,

  // 계좌 관련
  account: null,

  // Show 관련
  submissions: null,
  reservation: null,
  stores: [],

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
      state.account = null
      state.locations = [];
      state.isInitialized = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cleanersThunk.indexThunk.pending, (state) => {
        state.loading = true;
      })
      // 견적 목록 가져오기 실패 
      .addCase(cleanersThunk.indexThunk.rejected, (state) => {
        state.loading = false;
      })

      // 견적 상세 조회
      .addCase(cleanersThunk.showThunk.fulfilled, (state, action) => {
        const { reservation, submissions, locations } = action.payload.data;
        state.reservation = reservation;
        state.submissions = submissions;
        state.locations = locations;
        state.loading = false;
        state.error = null;
      })
      // 견적 목록 조회 성공
      .addCase(cleanersThunk.indexThunk.fulfilled, (state, action) => {
        // 1. 서버 응답 구조에서 데이터 추출 
        // (서버 응답이 action.payload.data 안에 total, currentPage, reservations가 있다고 가정)
        const { total, currentPage, reservations } = action.payload.data;

        // 2. 데이터 합치기 로직
        if (state.page === 0 || !state.reservations) {
          // 첫 페이지이거나 기존 데이터가 없으면 새로 할당
          state.reservations = reservations;
        } else {
          // 다음 페이지라면 기존 데이터 뒤에 추가
          state.reservations = [...state.reservations, ...reservations];
        }

        // 3. 페이징 상태 업데이트
        state.page = currentPage;

        // 전체 개수(total)를 offset으로 나눠서 마지막 페이지인지 확인
        if (currentPage >= Math.ceil(total / state.offset)) {
          state.isLasted = true;
        } else {
          state.isLasted = false;
        }

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
      /* 계좌 조회 */
      .addCase(cleanersThunk.fetchAccounts.pending, (state) => {
        state.loading = true;
      })
      .addCase(cleanersThunk.fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;

        const responseData = action.payload?.data || action.payload;
        const account = Array.isArray(responseData) ? responseData[0] : responseData;

        if (account && account.id) {
          state.account = account;
        } else {
          state.account = null;
        }
      })

      /* 계좌 등록/수정 시 */
      .addCase(cleanersThunk.saveAccount.fulfilled, (state, action) => {
        state.loading = false;

        const responseData = action.payload?.data || action.payload;
        const newAccount = Array.isArray(responseData) ? responseData[0] : responseData;

        if (newAccount && newAccount.id) {
          // 1인 1계좌이므로 최신 데이터로 덮어쓰기
          state.account = [newAccount];
        }
      })

      /* 계좌 삭제 시 */
      .addCase(cleanersThunk.deleteAccount.fulfilled, (state) => {
        state.loading = false;
        state.account = null;
      })
  },
});

export const { clearCleaners } = slice.actions;
export default slice.reducer;