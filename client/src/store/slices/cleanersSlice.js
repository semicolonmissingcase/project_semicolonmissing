import { createSlice } from "@reduxjs/toolkit";
import cleanersThunk from "../thunks/cleanersThunk.js";

const initialState = {
  // 회원가입 관련
  locations: [],
  isInitialized: false,
  accounts: [],

  // Show 관련
  submissions: null, // null 대신 빈 배열로 초기화하면 map 에러를 방지합니다.
  reservation: null,

  // index 관련
  reservations: null,
  page: 0,
  offset: 4,
  isLasted: false,
  
  // 기타
  loading: true,
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
      state.locations = [];
      state.isInitialized = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cleanersThunk.showThunk.fulfilled, (state, action) => {
        const { reservation, submissions, locations } = action.payload.data;
        state.reservation = reservation;
        state.submissions = submissions;
        state.locations = locations;
        state.loading = false;
        state.error = null;
      })
      .addCase(cleanersThunk.indexThunk.fulfilled, (state, action) => {
        const { total, currentPage, reservations } = action.payload.data;

        // 예약 정보 리스트
        if(state.reservations) {
          state.reservations = [...state.reservations, ...reservations];
        } else {
          state.reservations = reservations;
        }

        // 마지막 페이지 플래그
        if(currentPage === Math.ceil(total / state.offset)) {
          state.isLasted = true;
        }

        // 현재 페이지
        state.page = currentPage;

        state.loading = false;
      }).addCase(cleanersThunk.locationThunk.pending, (state) => {
        state.loading = false;
        state.isInitialized = false;
        state.error = null;
      })
      .addCase(cleanersThunk.locationThunk.fulfilled, (state, action) => {
        console.log('Fulfilled Payload:', action.payload);
        state.loading = false;
        state.isInitialized = true;
        state.locations = action.payload;
        state.error = null;
      })
      .addCase(cleanersThunk.locationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '활동 지역 정보 로드 실패';
      })

      // 계좌 목록 불러오기
      .addCase(cleanersThunk.fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cleanersThunk.fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload; // Thunk에서 리턴한 rows 저장
      })
      .addCase(cleanersThunk.fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },  
});

export const {
  clearCleaners
} = slice.actions;

export default slice.reducer;