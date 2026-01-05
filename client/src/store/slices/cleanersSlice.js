import { createSlice } from "@reduxjs/toolkit";
import cleanersThunk from "../thunks/cleanersThunk.js";
import { fetchLocations, registerCleaner, loginCleaner, getMe, titleThunk } from "../thunks/cleanersThunk";

const initialState = {
  registrationSuccess: false, // 가입 성공 여부 플래그
  locationData: {},
  cleaner: null,      // 로그인한 기사님 정보
  isLoggedIn: false,  // 로그인 여부
  isLoading: false,   // 로딩 상태
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
  clearCleaners: (state) => {
    state.cleaner = null;
    state.cleanerLike = null;
    state.reservation = null;
    state.submissions = null;
    state.accountInfo = null;
    state.templates = []; // 템플릿 초기화 포함
    state.loading = false;
    state.error = null;
  },
  logout: (state) => {
    state.cleaner = null;
    state.isLoggedIn = false;
    localStorage.removeItem('token');
  }
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

    // 2. 견적서 리스트(titleThunk) 처리
    .addCase(titleThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(titleThunk.fulfilled, (state, action) => {
      state.loading = false;
      // 서버에서 온 리스트 데이터 저장
      // 구조가 { data: { submissions: [] } } 인지 확인 필요
      state.submissions = action.payload?.data?.submissions || action.payload?.submissions || action.payload;
      console.log("✅ 리스트 저장 완료:", state.submissions);
    })
    .addCase(titleThunk.rejected, (state) => {
      state.loading = false;
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
    })

  // --- 로그인 유지 (getMe) ---
  .addCase(getMe.pending, (state) => {
    state.isLoading = true;
  })
    // cleanersSlice.js 내부 extraReducers
    // 1. auth/getMe가 성공하면 기사 정보를 여기에 복사
  .addCase(getMe.fulfilled, (state, action) => {
  state.isLoading = false;
  state.isLoggedIn = true;
  
  console.log("getMe 성공 페이로드:", action.payload); 

  const payloadData = action.payload.data || action.payload;

  // cleaner 정보와 submissions 정보를 함께 저장합니다.
  state.cleaner = payloadData.user || payloadData;
  state.submissions = payloadData.submissions || [];
})
.addCase(getMe.rejected, (state, action) => {
  state.isLoading = false;
  state.cleaner = null;

  if (action.payload?.status === 401) {
    state.isLoggedIn = false;
    localStorage.removeItem("cleanerToken");
  }
  })

  // --- 로그인 처리 ---
  .addCase(loginCleaner.pending, (state) => {
    state.isLoading = true;
    state.error = null;
  })
  .addCase(loginCleaner.fulfilled, (state, action) => {
    state.isLoading = false;
    state.isLoggedIn = true;
    // 여기도 데이터 구조 확인!
    state.cleaner = action.payload.data || action.payload.user; 
    state.error = null;
  })
  .addCase(loginCleaner.rejected, (state, action) => {
    state.isLoading = false;
    state.isLoggedIn = false;
    state.error = action.payload?.message || '로그인에 실패했습니다.';
  });
  },
});


export const {
  clearCleaners, clearRegistrationStatus, logout
} = slice.actions;

export default slice.reducer;