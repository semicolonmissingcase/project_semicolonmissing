import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";
import axios from "axios";

const titleThunk = createAsyncThunk(
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
  const createTemplateThunk = createAsyncThunk(
  "cleaners/createTemplate",
  async (templateData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/cleaners/templates", {
        // 백엔드 DB 컬럼명이 estimated_amount라면 백엔드에서 변환해주거나 
        // 여기서 백엔드가 받는 이름으로 보내야 합니다.
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
 const updateTemplateThunk = createAsyncThunk(
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
  const deleteTemplateThunk = createAsyncThunk(
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
 const submitQuotationThunk = createAsyncThunk(
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
  titleThunk,
  showThunk,        
  accountInfoThunk,
  fetchTemplateThunk,
  createTemplateThunk,
  updateTemplateThunk,
  deleteTemplateThunk,
  submitQuotationThunk
};