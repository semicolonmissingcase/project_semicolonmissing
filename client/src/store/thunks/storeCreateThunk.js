import axiosInstance from "../../api/axiosInstance.js";
import { createAsyncThunk } from "@reduxjs/toolkit";

// 매장 추가 관련
export const storeCreateThunk = createAsyncThunk(
  'storeCreate/storeCreateThunk',
  async (storeData, { rejectWithValue }) => {
    try {
      const url = '/api/stores';
      const response = await axiosInstance.post(url, { store: storeData });
      return response.data.result;
    } catch (error) {
      if(error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);