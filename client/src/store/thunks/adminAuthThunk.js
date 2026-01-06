import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

// 로그인
export const adminLoginThunk = createAsyncThunk(
  'adminAuth/loginThunk',
  async (args, { rejectWithValue }) => {
    try {
      const url = '/api/admin/login';
      const { email, password } = args;

      const response = await axiosInstance.post(url, {email, password }); 

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 토큰 재발급
export const adminReissueThunk = createAsyncThunk(
  'adminAuth/reissue',
  async (_, {rejectWithValue}) => {
    try {
      const url = '/api/admin/reissue';

      const response = await axiosInstance.post(url);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 로그 아웃
export const adminLogoutThunk = createAsyncThunk(
  'adminAuth/logout',
  async (_, {rejectWithValue}) => {
    try {
      const url = '/api/admin/logout';

      const response = await axiosInstance.post(url);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);