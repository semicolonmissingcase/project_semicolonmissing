import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, reissueThunk } from "../thunks/authThunk.js";

const initialState = {
  accessToken: null,
  user: null, // 점주, 기사
  isLoggedIn: false,
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
      state.isLoggedIn = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.fulfilled, (state, action) => {
        const { accessToken, user } = action.payload.data;
        state.accessToken = accessToken;
        state.user = user; //  user (점주, 기사)객체 저장
        state.isLoggedIn = true;

        if(accessToken) {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('user', JSON.stringify(user));
        }
      })
      .addCase(reissueThunk.fulfilled, (state, action) => {
        const { accessToken, user } = action.payload.data;
        state.accessToken = accessToken;
        state.user = user;
        state.isLoggedIn = true;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
      }); 
  },
});

export const {
  clearAuth,
} = slice.actions; // redcuer에서 한 actions를 export, import할 때 구조 분해 해서 사용

export default slice.reducer; // slice 자체를 반환, store에서 받아서 사용