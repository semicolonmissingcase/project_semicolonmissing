import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

// 1. 기존 Quotation 관련 Thunk (그대로 유지)
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

// 2. 새로운 AccountInfo 관련 Thunk (추가)
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
  showThunk,         // 기존 Thunk
  accountInfoThunk,  // 새로 추가된 Thunk
};