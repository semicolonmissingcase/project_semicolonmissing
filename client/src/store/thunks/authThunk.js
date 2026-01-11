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

// 점주 정보 수정하기
export const updateOwnerInfoThunk = createAsyncThunk(
  'auth/updateOwnerInfoThunk',
  async(updateData, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.put('/api/owners/mypage/profile', updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 기사 정보 수정하기
export const updateCleanerInfoThunk = createAsyncThunk(
  'auth/updateCleanerInfoThunk',
  async(updateData, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.put('/api/cleaners/mypage/info', updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 기사 비밀번호 수정하기
export const changeCleanerPasswordThunk = createAsyncThunk(
  'auth/changeCleanerPasswordThunk',
  async(passwordData, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.put('/api/cleaners/mypage/password', passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const uploadProfileImageThunk = createAsyncThunk(
  'auth/uploadProfileImageThunk',
  async(file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('profile', file);

      const uploadResponse = await axiosInstance.post('/api/files/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      const imageUrl = uploadResponse.data.data.path;

      const updateResponse = await axiosInstance.put(`/api/owners/mypage/profile`, { profile: imageUrl });

      return updateResponse.data;
    } catch (error) {
      console.error("프로필 이미지 업로드 및 업데이트 실패:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
)

// 파일 업로드
export const uploadFileThunk = createAsyncThunk(
  'files/upload',
  async({ file, fieldName }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append(fieldName, file);

      const response = await axiosInstance.post('/api/files/profile', formData);
      return response.data.data.path;
    } catch (error) {
      console.error("파일 업로드 실패:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
)