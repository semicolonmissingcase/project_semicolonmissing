import { createSlice } from "@reduxjs/toolkit";
import cleanersThunk from "../thunks/cleanersThunk.js";

const initialState = {
  submissions: null,
  reservation: null,
  cleanerLike: null,
  accounts: [],
  locations: [],
  loading: false,
};

const slice = createSlice({
  name: 'cleaners',
  initialState,
  reducers: {
    clearCleaners(state) {
      state.cleanerLike = null;
      state.reservation = null;
      state.submissions = null;
      state.accounts = [];
      state.locations = null;
      state.loading = false;
      state.locations = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(cleanersThunk.titleThunk.fulfilled, (state, action) => {
          console.log("Slice에 도착한 실제 페이로드:", action.payload);

          // 데이터 구조가 action.payload.data.result 또는 action.payload.result 일 수 있습니다.
          // 안전하게 데이터를 추출하기 위해 아래와 같이 작성합니다.
          const result = action.payload.data || action.payload;

          // 만약 result가 서버에서 보낸 { submissions, reservation } 등을 직접 가지고 있다면:
          state.submissions = result.submissions || [];
          
          // 만약 리스트(배열)로 들어온다면 첫 번째 예약을 저장하거나 배열 전체를 저장
          state.reservation = result.reservation || null;
          state.cleanerLike = result.cleanerLike || null;
          
          state.loading = false;
          state.error = null;
        })

      // 기존 showThunk 처리
      .addCase(cleanersThunk.showThunk.fulfilled, (state, action) => {
        const { cleanerLike, reservation, submissions } = action.payload.data;
        state.cleanerLike = cleanerLike;
        state.reservation = reservation;
        state.submissions = submissions;
        state.loading = false;
        state.error = null;
      })

      .addCase(cleanersThunk.locationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cleanersThunk.locationThunk.fulfilled, (state, action) => {
        state.loading = false;
        
        state.locations = action.payload || []; 
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