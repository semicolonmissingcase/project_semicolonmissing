import { createSlice } from "@reduxjs/toolkit";
import cleanersThunk from "../thunks/cleanersThunk.js";

const initialState = {
  submissions: [], // null 대신 빈 배열로 초기화하면 map 에러를 방지합니다.
  reservation: null,
  cleanerLike: null,
  accountInfo: null,
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
      //  accountInfoThunk 처리 로직 추가
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
      })
      // =======================================================

    // 2. 요청 성공
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
      
      state.loading = false; // 로딩을 여기서 확실히 꺼줘야 합니다.
      state.error = null;
    })
  },  
});

export const {
  clearCleaners,
} = slice.actions;

export default slice.reducer;