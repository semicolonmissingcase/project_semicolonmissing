import { createSlice } from "@reduxjs/toolkit";
import { adminLoginThunk, adminLogoutThunk, adminReissueThunk } from "../thunks/adminAuthThunk.js";

const initialState = {
  admin: null,          // 관리자 프로필 정보
  isLoggedIn: false,    // 로그인 여부
  isLoading: false,     // 통신 중 로딩 상태
  error: null,          // 에러 메시지
}

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    clearAuth(state) {
      state.admin = null;
      state.isLoggedIn = false;
      state.isLoading = null;
    },
  },
  extraReducers: (builder) => {
    builder
    // 로그인 처리
      .addCase(adminLoginThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminLoginThunk.fulfilled, (state, action) => {
        const { admin } = action.payload.data;
        state.admin = {
          ...admin,
          role: 'ADMIN'
        };
        state.isLoggedIn = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(adminLoginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.msg || "로그인 실패";
      })
      
      // 로그아웃 처리
      .addCase(adminLogoutThunk.rejected, (state) => {
        state.admin = null;
        state.isLoggedIn = false;
        state.error = null;
      })

      // 토큰 재발급 (새로 고침 시 로그인 유지)
      .addCase(adminReissueThunk.fulfilled, (state, action) => {
        const { admin } = action.payload.data;
        state.admin = {
          ...admin,
          role: 'ADMIN'
        };
        state.isLoggedIn = true;
      })
      .addCase(adminReissueThunk.rejected, (state) => {
        // 재발급 실패 시 세션 만료로 간주하고 비우는 처리
        state.admin = null;
        state.isLoggedIn = false;
      });
  },
});

export const {
  clearAuth,
} = adminAuthSlice.actions; // redcuer에서 한 actions를 export, import할 때 구조 분해 해서 사용

export default adminAuthSlice.reducer; // slice 자체를 반환, store에서 받아서 사용