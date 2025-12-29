import { configureStore } from "@reduxjs/toolkit";
import authRouter from './slices/authSlice.js';
import storeReducer from './slices/storeSlice.js';

export default configureStore({
  reducer: {
    auth: authRouter,
    store: storeReducer,
  }
});