/**
 * @file src/store/thunks/adminOwnersThunk.js
 * @description adminOwnersThunk
 * 260111 v1.0.0 jae init
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/**
 * 점주 프로필 리스트 획득 Thunk
 */
const adminOwnerProfileThunk = createAsyncThunk(
  'adminPagination/adminOwnerProfileThunk',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { adminPagination } = getState();
      const { page, offset } = adminPagination;
      
      const params = {
        page: page,
        offset: offset
      };

      // 점주 리스트 조회를 위한 백엔드 API 주소
      const url = '/api/admin/owners/profiles'; 
      const response = await axiosInstance.get(url, { params });

      return response.data; // 성공 시 데이터 반환 (Slice의 fulfilled로 전달)
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * 점주 관리 상단 통계 데이터 획득 Thunk
 */
const adminOwnerProfileStatisticsThunk = createAsyncThunk(
  'adminPagination/adminOwnerProfileStatisticsThunk',
  async (_, { rejectWithValue }) => {
    try {
      // 점주 통계 조회를 위한 백엔드 API 주소
      const url = '/api/admin/owners/profiles/statistics';
      const response = await axiosInstance.get(url);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export default {
  adminOwnerProfileThunk,
  adminOwnerProfileStatisticsThunk,
};