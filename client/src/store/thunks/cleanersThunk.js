import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

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

//   계좌 목록 조회
const fetchAccounts = createAsyncThunk(
  'cleaners/fetchAccounts',
  async function (cleanerId, thunkAPI) {
    try {
      const response = await axiosInstance.get(`/api/cleaners/accounts/${cleanerId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.msg || "계좌 정보를 불러오지 못했습니다.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//   계좌 등록
const createAccount = createAsyncThunk(
  'cleaners/createAccount',
  async function ({ cleanerId, accountData }, thunkAPI) {
    try {
      // URL 파라미터로 cleanerId를 전달
      const response = await axiosInstance.post(`/api/cleaners/accounts/${cleanerId}`, accountData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.msg || "계좌 등록에 실패했습니다.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//   계좌 수정
const updateAccount = createAsyncThunk(
  'cleaners/updateAccount',
  async function ({ cleanerId, updateData }, thunkAPI) {
    try {
      // updateData 안에 계좌의 PK(id)가 포함되어 있어야 백엔드에서 특정 계좌를 수정합니다.
      const response = await axiosInstance.put(`/api/cleaners/accounts/${cleanerId}`, updateData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.msg || "계좌 수정에 실패했습니다.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//   계좌 삭제
const deleteAccount = createAsyncThunk(
  'cleaners/deleteAccount',
  async function (cleanerId, thunkAPI) {
    try {
      // 서버로 DELETE 요청
      await axiosInstance.delete(`/api/cleaners/accounts/${cleanerId}`);

      return cleanerId;
    } catch (error) {
      const message = error.response?.data?.msg || "삭제 중 오류가 발생했습니다.";
      return thunkAPI.rejectWithValue(message);
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
  createAccount,
  updateAccount,
  deleteAccount,
  quotationStore,
};