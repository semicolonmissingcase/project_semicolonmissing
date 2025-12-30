import axiosInstance from "../../api/axiosInstance.js";
import { createAsyncThunk } from "@reduxjs/toolkit";

// 매장 불러오기 관련
export const storeGetThunk = createAsyncThunk(
  'storeGet/storeGetThunk',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/stores');
      return response.data.data;
    } catch (error) {
      if(error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);