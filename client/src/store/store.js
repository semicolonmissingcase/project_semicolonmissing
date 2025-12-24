import { configureStore } from "@reduxjs/toolkit";
import authRouter from './slices/authSlice.js';

export default configureStore({
  reducer: {
    auth: authRouter,
  }
});