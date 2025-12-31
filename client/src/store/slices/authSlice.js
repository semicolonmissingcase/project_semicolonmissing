import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, reissueThunk, getMeThunk, logoutThunk, updateOwnerInfoThunk, uploadProfileImageThunk } from "../thunks/authThunk.js";

const initialState = {
 user: null,
 isLoggedIn: false,
 isLoading: true,
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.isLoading = false;
    },

    setCredentials(state, action) {
      const { user } = action.payload;
      state.user = user;
      state.isLoggedIn = !!user;
      state.isLoading = false;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.fulfilled, (state, action) => {
        const { user } = action.payload.data;
        state.user = user; //  user (점주, 기사)객체 저장
        state.isLoggedIn = true;
        state.isLoading = false;
      })
      .addCase(getMeThunk.fulfilled, (state, action) => {
        const { user } = action.payload.data; // 서버 응답 구조에 맞게 조정 (data.user 등)
        state.user = user;
        state.isLoggedIn = true;
        state.isLoading = false;
      })
      // getMeThunk 실패 시 (토큰이 없거나 만료된 경우)
      .addCase(getMeThunk.rejected, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.isLoading = false;
       })
      // 점주 정보 수정용
      .addCase(updateOwnerInfoThunk.fulfilled, (state, action) => {
        const { user } = action.payload.data;
        state.user = user;
        state.isLoading = false;
      })
      // 점주 프로필 이미지 업로드
      .addCase(uploadProfileImageThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadProfileImageThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const newImageUrl = action.payload.data.profileImageUrl;
        // user 상태 존재, 새로운 이미지 경로 유효
        if(state.user && newImageUrl) {
          state.user.profile = newImageUrl;
        }
      })
      .addCase(uploadProfileImageThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // 토큰 재발급 성공 시
      .addCase(reissueThunk.fulfilled, (state, action) => {
        const { user } = action.payload.data;
        state.user = user;
        state.isLoggedIn = true;
        state.isLoading = false;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.isLoading = false;
      }) 
  },
});

export const {
  clearAuth, setCredentials, setLoading
} = slice.actions;

export default slice.reducer; // slice 자체를 반환, store에서 받아서 사용