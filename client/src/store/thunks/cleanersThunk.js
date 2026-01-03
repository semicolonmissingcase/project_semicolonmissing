import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

const titleThunk = createAsyncThunk(
  'cleaners/titleThunk',
  async (_, { rejectWithValue }) => { // ⬅️ 리스트 조회이므로 id 파라미터를 제거해보세요
    try {
      // ⚠️ 만약 백엔드에서 '목록 조회' API 주소가 따로 있다면 그 주소를 써야 합니다.
      const url = `/api/owners/quotations`; 
      const response = await axiosInstance.get(url);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const submitQuotation = createAsyncThunk(
  "cleaners/submitQuotation",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/cleaners/quotations", formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const showThunk = createAsyncThunk(
  'cleaners/showThunk',
  async (id, { rejectWithValue }) => {
    try {
      // 기존 URL: 견적서(quotations) 정보를 가져오는 엔드포인트
      const url = `/api/owners/quotations/${id}`;

      const response = await axiosInstance.get(url);

      return response.data;
    } catch (error) {
      // 에러 처리 시, HTTP 응답의 데이터를 포함하여 디버깅에 용이하게 합니다.
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const accountInfoThunk = createAsyncThunk(
  // Thunk 액션 타입: accounts 슬라이스에서 계정 정보 조회
  'accounts/fetchAccountInfo',
  // id는 accountinfo/:id 경로에서 사용될 ID (예: cleaner_id)
  async (id, { rejectWithValue }) => {
    try {
      // 새로운 URL: 계좌 정보(adjustments)를 가져오는 엔드포인트
      const url = `/api/cleaners/accountinfo/${id}`; 

      const response = await axiosInstance.get(url);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export default {
  titleThunk,
  submitQuotation,
  showThunk,         
  accountInfoThunk, 
};