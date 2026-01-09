/**
 * @file src/store/thunks/adminCleanersThunk.js
 * @description adminCleanersThunk
 * 260108 v1.0.0 pbj init
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

const adminCleanerProfileThunk = createAsyncThunk(
  'adminPagination/adminCleanerProfileThunk',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { adminPagination } = getState();
      const { page, offset } = adminPagination;
      const params = {
        page: page,
        offset
      };

      const url = '/api/admin/cleaners/profiles';
      const response = await axiosInstance.get(url, { params }); 

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const adminCleanerProfileStatisticsThunk = createAsyncThunk(
  'adminPagination/adminCleanerProfileStatisticsThunk',
  async (_, { rejectWithValue }) => {
    try {
      const url = '/api/admin/cleaners/profiles/statistics';
      const response = await axiosInstance.get(url); 

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export default {
  adminCleanerProfileThunk,
  adminCleanerProfileStatisticsThunk,
}