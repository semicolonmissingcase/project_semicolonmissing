import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

export const loginThunk = createAsyncThunk(
  'auth/loginThunk',
  async (args, { rejectWithValue }) => {
    try {
      const url = '/api/auth/login';
      const { email, password } = args;

      const response = await axiosInstance.post(url, {email, password }); 

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 토큰 재발급
export const reissueThunk = createAsyncThunk(
  'auth/reissueThunk',
  async (_, {rejectWithValue}) => {
    try {
      const url = '/api/auth/reissue';

      const response = await axiosInstance.post(url);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 로그 아웃
export const logoutThunk = createAsyncThunk(
  'auth/logoutThunk',
  async (_, {rejectWithValue}) => {
    try {
      const url = '/api/auth/logout';

      const response = await axiosInstance.post(url);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 내 정보 가져오기 Thunk (새로고침 시 필수)
export const getMeThunk = createAsyncThunk(
  'auth/getMeThunk',
  async(_, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get('/api/auth/me');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);