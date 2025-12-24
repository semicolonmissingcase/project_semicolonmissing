import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, reissueThunk } from "../thunks/authThunk.js";

const initialState = {
  accessToken: null,
  owner: null,
  cleaner: null,
  admin: null,
  isLoggedIn: false,
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth(state) {
      state.accessToken = null;
      state.owner = null;
      state.cleaner = null;
      state.admin = null;
      state.isLoggedIn = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.fulfilled, (state, action) => {
        const { accessToken, owner, cleaner, admin } = action.payload.data;
        state.accessToken = accessToken;
        state.owner = owner;
        state.cleaner = cleaner;
        state.admin = admin;
        state.isLoggedIn = true;
      });
  },
});

export const {
  clearAuth,
} = slice.actions;

export default slice.reducer;