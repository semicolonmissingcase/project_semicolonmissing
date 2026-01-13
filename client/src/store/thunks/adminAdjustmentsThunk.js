/**
 * @file src/store/thunks/adminAdjustmentsThunk.js
 * @description adminAdjustmentsThunk
 * 260112 v1.0.0 jae init
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

/**
 * 1. 정산 목록 조회 Thunk
 */
const adminAdjustmentThunk = createAsyncThunk(
  'adminPagination/adminAdjustmentThunk',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { page, offset } = getState().adminPagination;

      const response = await axiosInstance.get('/api/admin/adjustments/view', {
        params: { page, offset }
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * 2. 정산 통계 조회 Thunk
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
 */
const adminUpdateAdjustmentStatusThunk = createAsyncThunk(
  'adminPagination/adminUpdateAdjustmentStatusThunk',
  async ({ id, status }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post(`/api/admin/adjustments/${id}/status`, { status });

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