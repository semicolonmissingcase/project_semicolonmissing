/**
 * @file src/store/thunks/adminAdjustmentsThunk.js
 * @description adminAdjustmentsThunk
 * 260112 v1.0.0 jae init
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

/**
 * 1. 기사 작업 목록 조회 Thunk
 */
const getTasks = createAsyncThunk(
  'adminPagination/getCleanerTasks',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { page, offset } = getState().adminPagination;

      const response = await axiosInstance.get('/api/admin/cleaners/tasks', {
        params: { page, offset }
      });

      // 서버 컨트롤러에서 { total, currentPage, reservations } 형태로 보냄
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * 2. 기사 작업 통계 조회 Thunk
 */
const getStatistics = createAsyncThunk(
  'adminPagination/getCleanerTasksStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/admin/cleaners/tasks/statistics');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export default {
  getTasks,
  getStatistics,
};