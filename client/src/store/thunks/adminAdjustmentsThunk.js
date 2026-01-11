/**
 * @file src/store/thunks/adminAdjustmentsThunk.js
 * @description adminAdjustmentsThunk
 * 260112 v1.0.0 jae init
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

/**
 * 1. 정산 목록 조회 Thunk
 * 현재 리덕스 상태의 page와 offset을 사용하여 목록을 가져옵니다.
 */
const adminAdjustmentThunk = createAsyncThunk(
  'adminPagination/adminAdjustmentThunk',
  async (_, { rejectWithValue, getState }) => {
    try {
      // 리덕스 state에서 현재 페이지와 페이지 당 출력 개수를 가져옴
      const { page, offset } = getState().adminPagination;
      
      const response = await axiosInstance.get('/api/admin/adjustments/view', {
        params: { page, offset }
      });

      // 백엔드 createBaseResponse 규격에 맞춰 response.data 반환
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * 2. 정산 통계 조회 Thunk
 * 상단 통계 카드(전체, 정산 대기, 완료 등) 수치를 가져옵니다.
 */
const adminAdjustmentStatisticsThunk = createAsyncThunk(
  'adminPagination/adminAdjustmentStatisticsThunk',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/admin/adjustments/view/statistics');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * 3. 정산 상태 업데이트 Thunk
 * '정산 대기' 상태인 항목을 '정산 완료'로 변경 후 목록과 통계를 자동 갱신합니다.
 */
const adminUpdateAdjustmentStatusThunk = createAsyncThunk(
  'adminPagination/adminUpdateAdjustmentStatusThunk',
  async ({ id, status }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post(`/api/admin/adjustments/${id}/status`, { status });

      // ✅ 업데이트 성공 후 목록과 통계를 다시 불러와 UI를 동기화합니다.
      dispatch(adminAdjustmentThunk());
      dispatch(adminAdjustmentStatisticsThunk());

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export default {
  adminAdjustmentThunk,
  adminAdjustmentStatisticsThunk,
  adminUpdateAdjustmentStatusThunk,
};