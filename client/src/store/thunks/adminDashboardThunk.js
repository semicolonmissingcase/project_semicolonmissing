/**
 * @file src/store/thunks/adminDashboardsThunk.js
 * @description adminDashboardsThunk
 * 260111 v1.0.0 jae init
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

/**
 * 통합 모니터링(대시보드) 데이터 조회 Thunk
 */
const getDashboardData = createAsyncThunk(
  'adminPagination/getDashboardData',
  async (date, { rejectWithValue }) => {
    try {
      const params = date ? { date } : {};

      // 2. 통합 모니터링 API 호출
      const url = '/api/admin/monitoring'; 
      const response = await axiosInstance.get(url, { params });

      // 서버 응답 구조
      return response.data;
    } catch (error) {
      // 에러 발생 시 메시지 반환
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export default {
  getDashboardData,
};