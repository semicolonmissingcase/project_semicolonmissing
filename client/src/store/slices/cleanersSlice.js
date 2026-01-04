import { createSlice } from "@reduxjs/toolkit";
import cleanersThunk from "../thunks/cleanersThunk.js";
import { fetchLocations, registerCleaner } from "../thunks/cleanersThunk";

const initialState = {
  registrationSuccess: false, // 가입 성공 여부 플래그
  locationData: {},
  submissions: [],
  reservation: null,
  cleanerLike: null,
  accountInfo: null,
  templates: [],
  loading: false,
};

const slice = createSlice({
  name: 'cleaners',
  initialState,
  reducers: {
    clearRegistrationStatus: (state) => {
      state.registrationSuccess = false;
      state.error = null;
    },  
    clearCleaners(state) {
      state.cleanerLike = null;
      state.reservation = null;
      state.submissions = null;
      state.accountInfo = null; //  clear 시 계좌 정보도 초기화
      state.loading = false;
      state.error = null;
    },
    clearCleaners: (state) => {
      // 초기화 로직
      state.templates = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // --- 클리너 회원가입 ---
      .addCase(registerCleaner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCleaner.fulfilled, (state) => {
        state.loading = false;
        state.registrationSuccess = true;
      })
      .addCase(registerCleaner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchLocations.fulfilled, (state, action) => {
        const rawData = action.payload;
        console.log("받은 데이터:", rawData);

        // [수정] 서버 데이터가 이미 객체 형식이므로 분기 처리
        if (rawData && typeof rawData === 'object' && !Array.isArray(rawData)) {
          state.locationData = rawData;
        } else if (Array.isArray(rawData)) {
          state.locationData = rawData.reduce((acc, curr) => {
            const city = curr.city || curr.si;
            const district = curr.district || curr.gu;
            if (!acc[city]) acc[city] = [];
            acc[city].push(district);
            return acc;
          }, {});
        }
      }) // <--- 이 닫는 괄호와 점(.) 연결 확인
      
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

    //templates 슬라이스
    .addCase(cleanersThunk.fetchTemplateThunk.pending, (state) => {
      console.log("로딩 시작...");
    })
    // cleanersSlice.js
    .addCase(cleanersThunk.fetchTemplateThunk.fulfilled, (state, action) => {
      console.log("Slice에 도착한 실제 페이로드:", action.payload);

      // 1. 만약 action.payload 자체가 배열이라면 (현재 로그 상황)
      if (Array.isArray(action.payload)) {
        state.templates = action.payload;
      } 
      // 2. 만약 기존처럼 data.templates 안에 들어있을 경우를 대비
      else if (action.payload?.data?.templates) {
        state.templates = action.payload.data.templates;
      }
      // 3. 그 외 예외 처리
      else {
        console.warn("데이터를 찾을 수 없습니다.");
      }
    })
  .addCase(cleanersThunk.fetchTemplateThunk.rejected, (state, action) => {
;
    console.error("실패 사유:", action.error.message);
  })
  .addCase(cleanersThunk.createTemplateThunk.fulfilled, (state, action) => {
    console.log("실패 상세 사유(payload):", action.payload);
    console.log("실패 에러 객체(error):", action.error)
    state.templates.unshift(action.payload); 
  })
  .addCase(cleanersThunk.updateTemplateThunk.fulfilled, (state, action) => {
    // 수정된 데이터로 기존 목록 업데이트
    const index = state.templates.findIndex(t => t.id === action.payload.id);
    if (index !== -1) {
      state.templates[index] = action.payload;
    }
  })
  .addCase(cleanersThunk.deleteTemplateThunk.fulfilled, (state, action) => {
  state.templates = state.templates.filter(t => t.id !== action.payload);
  });

  },  

});


export const {
  clearCleaners, clearRegistrationStatus
} = slice.actions;

export default slice.reducer;