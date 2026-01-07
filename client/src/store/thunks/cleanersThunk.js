import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

const locationThunk = createAsyncThunk(
  'cleaners/locationThunk',
  async (_, { rejectWithValue }) => {
    try {
      const url = '/api/locations';
      const response = await axiosInstance.get(url);
      

      return response.data.rows;
    } catch (error) {

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const indexThunk = createAsyncThunk(
  'cleaners/indexThunk',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { cleaners } = getState();
      const { page, offset } = cleaners;
      const url = `/api/cleaners/quotations`;
      const params = {
        page: page + 1,
        offset
      };

      const response = await axiosInstance.get(url, { params });

      return response.data;
    } catch (error) {
      // 에러 처리 시, HTTP 응답의 데이터를 포함하여 디버깅에 용이하게 합니다.
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const showThunk = createAsyncThunk(
  'cleaners/showThunk',
  async (id, { rejectWithValue }) => {
    try {
      
      const url = `/api/owners/quotations/${id}`;

      const response = await axiosInstance.get(url);

      return response.data;
    } catch (error) {
      
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const fetchAccounts = createAsyncThunk(
  'cleaners/fetchAccounts',
  async (cleanerId, { rejectWithValue }) => {
    try {
      
      const response = await axiosInstance.get(`/api/users/cleaner/accountinfo/${cleanerId}`);
      
      
      return response.data.data.rows; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || "계좌 정보를 불러오지 못했습니다.");
    }
  }
);

const quotationStore = createAsyncThunk(
  'cleaners/quotationStore',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/cleaners/quotations`, data);
      
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || "견적서 요청 승락 실패");
    }
  }
);

export default {
  indexThunk,
  showThunk,
  locationThunk,
  fetchAccounts,
  quotationStore,
};