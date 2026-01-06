import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice.js';
import cleanersReducer from './slices/cleanersSlice.js';
import storeReducer from './slices/storeSlice.js';
import adminAuthReducer from './slices/adminAuthSlice.js';

export default configureStore({
  reducer: {
    auth: authReducer,
    adminAuth: adminAuthReducer,
    cleaners: cleanersReducer,
    store: storeReducer,
  }
});