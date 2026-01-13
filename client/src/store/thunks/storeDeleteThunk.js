import axiosInstance from "../../api/axiosInstance.js";
import { createAsyncThunk } from "@reduxjs/toolkit";

// 매장 삭제 관련
export const storeDeleteThunk = createAsyncThunk(
  'storeDelete/storeDeleteThunk',
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/api/stores/${storeId}`);
      return response.data.data;
    } catch (error) {
      if(error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);