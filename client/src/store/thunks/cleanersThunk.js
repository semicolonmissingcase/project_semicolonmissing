import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

const locationThunk = createAsyncThunk(
  'cleaners/locationThunk',
  async (_, { rejectWithValue }) => {
    try {
      const url = '/api/users/locations';
      const response = await axiosInstance.get(url);

      return response.data;
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

// 계좌 목록 조회
const fetchAccounts = createAsyncThunk(
  'cleaners/fetchAccounts',
  async function (_, { rejectWithValue }) {
    try {
      const url = `/api/cleaners/accountedit`;
      const response = await axiosInstance.get(url);

      return response.data;
    } catch (error) {

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 계좌 등록 및 수정
export const saveAccount = createAsyncThunk(
  'cleaners/saveAccount',
  async function (accountData, { rejectWithValue }) {
    try {
      const url = `/api/cleaners/accountedit`;

      const response = await axiosInstance.post(url, accountData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// 계좌 삭제
const deleteAccount = createAsyncThunk(
  'cleaners/deleteAccount',
  async function (_, { rejectWithValue }) {
    try {
      const url = `/api/cleaners/accountedit`;
      const response = await axiosInstance.delete(url);

      return response.data;
    } catch (error) {

      return rejectWithValue(error.response?.data || error.message);
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
  saveAccount,
  fetchAccounts,
  deleteAccount,
  quotationStore,
};