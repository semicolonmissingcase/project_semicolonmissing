import axiosInstance from "../../api/axiosInstance.js";
import { createAsyncThunk } from "@reduxjs/toolkit";

// 점주 회원가입 관련
export const ownerStoreThunk = createAsyncThunk(
  'ownerCreate/ownerStoreThunk',
  async (ownerData, { rejectWithValue }) => {
    try {
      const url = '/api/users/owner';
      const response = await axiosInstance.post(url, ownerData);
      return response.data;
    } catch (error) {
      if(error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

// 기사님 회원가입 관련