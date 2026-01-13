/**
 * @file src/store/thunks/adminReviewsThunk.js
 * @description adminReviewsThunk
 * 260113 v1.0.0 jae init
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

/**
 * 1. 리뷰 목록 조회 Thunk
 */
const getReviews = createAsyncThunk(
  'adminPagination/getReviews',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { page, offset } = getState().adminPagination;

      const response = await axiosInstance.get('/api/admin/reviews', {
        params: { page, offset }
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * 2. 리뷰 통계 조회 Thunk
 */
const getStatistics = createAsyncThunk(
  'adminPagination/getReviewsStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/admin/reviews/statistics');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export default {
  getReviews,
  getStatistics,
};