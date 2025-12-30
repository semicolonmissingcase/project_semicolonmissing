import { configureStore } from "@reduxjs/toolkit";
import authRouter from './slices/authSlice.js';
import cleanersReducer from './slices/cleanersSlice.js';

export default configureStore({
  reducer: {
    auth: authRouter,
    cleaners: cleanersReducer,
  }
});