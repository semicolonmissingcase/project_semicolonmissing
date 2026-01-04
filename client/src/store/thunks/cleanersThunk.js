import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";
import axios from "axios";

// 신규: 클리너 회원가입 Thunk
export const registerCleaner = createAsyncThunk(
  "cleaners/registerCleaner",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("보내는 데이터(Payload):", payload); // 1. 내가 보내는 값 확인
      
      const response = await axiosInstance.post("/api/users/cleaner", payload); 
      
      console.log("서버 응답 성공:", response.data); // 2. 성공 시 응답 확인
      return response.data;
    } catch (error) {

  return rejectWithValue(err.response?.data ?? { message: "unknown" });
    }
  }
);


export const fetchLocations = createAsyncThunk(
  "cleaners/fetchLocations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/cleaners/locations`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const titleThunk = createAsyncThunk(
  'cleaners/titleThunk',
  async (cleanerId, { rejectWithValue }) => { // 컴포넌트에서 cleanerId를 보낸다고 가정
    try {

      const url = `/api/owners/quotations`; 
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const showThunk = createAsyncThunk(
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

export const accountInfoThunk = createAsyncThunk(
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

// 예시: thunk 내부 구조 확인
// cleanersThunk.js (또는 해당 thunk가 정의된 곳)
export const fetchTemplateThunk = createAsyncThunk(
  'cleaners/fetchTemplates',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/api/cleaners/templates'); 
      
      // 여기서 response가 undefined이거나 response.data가 없을 때 에러가 납니다.
      if (!response || !response.data) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      }

      return response.data; 
    } catch (error) {
      // 에러를 catch해서 rejected 상태로 보냅니다.
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 템플릿 신규 저장 (DB에 INSERT)
export const createTemplateThunk = createAsyncThunk(
  "cleaners/createTemplate",
  async (templateData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/cleaners/templates", {
        estimatedAmount: templateData.estimatedAmount, 
        description: templateData.description,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "저장 실패");
    }
  }
);

// 템플릿 수정 저장 (DB에 UPDATE)
// 템플릿 수정 (객체를 통째로 받음)
export const updateTemplateThunk = createAsyncThunk(
  "cleaners/updateTemplate",
  async (templateData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/cleaners/templates/${templateData.id}`, {
        estimatedAmount: templateData.estimatedAmount,
        description: templateData.description,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "수정 에러");
    }
  }
);

// 템플릿 삭제 (ID만 받음)
export const deleteTemplateThunk = createAsyncThunk(
  "cleaners/deleteTemplate",
  async (templateId, { rejectWithValue }) => {
    try {
      // 주소 끝에 templateId가 확실히 붙는지 확인
      await axios.delete(`/api/cleaners/templates/${templateId}`);
      return templateId;
    } catch (err) {
      return rejectWithValue(err.response?.data || "삭제 실패");
    }
  }
  );

// 견적서 제출 (POST) Thunk
export const submitQuotationThunk = createAsyncThunk(
  "cleaners/submitQuotation",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.post("/api/cleaners/quotations", payload);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);


export default {
  registerCleaner,
  fetchLocations,
  titleThunk,
  showThunk,        
  accountInfoThunk,
  fetchTemplateThunk,
  createTemplateThunk,
  updateTemplateThunk,
  deleteTemplateThunk,
  submitQuotationThunk
};