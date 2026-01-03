import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

const titleThunk = createAsyncThunk(
  'cleaners/titleThunk', // 액션 타입 이름 중복 방지
  async (_, { rejectWithValue }) => { // 목록 조회라면 id가 필요 없을 수 있음
    try {
      // 기사님에게 들어온 '요청 의뢰서 목록'을 가져오는 주소로 변경 필요
      // 예: /api/cleaners/quotations 또는 /api/cleaners/requests
      const url = `/api/cleaners/quotations`; 

      const response = await axiosInstance.get(url);
      
      console.log("API Response Data:", response.data); // 데이터 구조 확인용 로그
      return response.data; // 보통 배열 형태여야 함 [{}, {}, {}]
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
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
  showThunk,         
  accountInfoThunk, 
};