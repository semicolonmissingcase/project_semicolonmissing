import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, reissueThunk } from "../thunks/authThunk.js";

const savedUser = localStorage.getItem('user');
const savedToken = localStorage.getItem('accessToken');

const initialState = {
  accessToken: savedToken || null,
  user: savedUser ? JSON.parse(savedUser) : null, 
  isLoggedIn: !!savedToken,
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
      state.isLoggedIn = null;

      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },

    setCredentials(state, action) {
      const { accessToken, user } = action.payload;
      state.accessToken = accessToken;
      state.user = user;
      state.isLoggedIn = true;
    }
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
  clearAuth, setCredentials
} = slice.actions; // redcuer에서 한 actions를 export, import할 때 구조 분해 해서 사용

export default slice.reducer; // slice 자체를 반환, store에서 받아서 사용