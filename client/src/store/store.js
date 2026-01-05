import { configureStore } from "@reduxjs/toolkit";
import authRouter from './slices/authSlice.js';
import cleanersReducer from './slices/cleanersSlice.js';
import adminAuthReducer from './slices/adminAuthSlice.js';

export default configureStore({
  reducer: {
    auth: authRouter,
    adminAuth: adminAuthReducer,
    cleaners: cleanersReducer,
  }
});