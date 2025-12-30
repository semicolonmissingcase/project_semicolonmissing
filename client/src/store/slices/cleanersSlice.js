import { createSlice } from "@reduxjs/toolkit";
import cleanersThunk from "../thunks/cleanersThunk.js";

const initialState = {
  cleanerLike: null,
  reservation: null,
  submissions: null,
}

const slice = createSlice({
  name: 'cleaners',
  initialState,
  reducers: {
    clearCleaners(state) {
      state.cleanerLike = null;
      state.reservation = null;
      state.submissions = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cleanersThunk.showThunk.fulfilled, (state, action) => {
        const { cleanerLike, reservation, submissions } = action.payload.data;
        state.cleanerLike = cleanerLike;
        state.reservation = reservation;
        state.submissions = submissions;
      });
  },
});

export const {
  clearCleaners,
} = slice.actions; // redcuer에서 한 actions를 export, import할 때 구조 분해 해서 사용

export default slice.reducer; // slice 자체를 반환, store에서 받아서 사용