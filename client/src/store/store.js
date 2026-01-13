import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice.js';
import cleanersReducer from './slices/cleanersSlice.js';
import storeReducer from './slices/storeSlice.js';
import adminAuthReducer from './slices/adminAuthSlice.js';
import adminPaginationReducer from './slices/adminPaginationSlice.js';
import banksReducer from './slices/banksSlice.js';

export default configureStore({
  reducer: {
    auth: authReducer,
    adminAuth: adminAuthReducer,
    adminPagination: adminPaginationReducer,
    cleaners: cleanersReducer,
    cleanersLocation: cleanersReducer,
    store: storeReducer,
    banks: banksReducer,
  }
});