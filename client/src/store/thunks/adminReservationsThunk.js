/**
 * @file src/store/thunks/adminReservationsThunk.js
 * @description adminReservationsThunk
 * 260113 v1.0.0 jae init
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

/**
 * 1. 예약 상세 목록 Thunk (하단 테이블 데이터)
 */
const adminReservationThunk = createAsyncThunk(
  'adminPagination/adminReservationThunk',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { adminPagination } = getState();
      const { page, offset } = adminPagination;
      
      const params = {
        page: page,
        offset: offset // 페이지당 노출 개수
      };

      const url = '/api/admin/reservations';
      const response = await axiosInstance.get(url, { params });

      // 백엔드 컨트롤러에서 { reservations: rows, total: count } 형태로 보내므로 이를 반환
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * 2. 예약 통계 데이터 Thunk (상단 카드 데이터)
 */
const adminReservationStatisticsThunk = createAsyncThunk(
  'adminPagination/adminReservationStatisticsThunk',
  async (_, { rejectWithValue }) => {
    try {
      const url = '/api/admin/reservations/statistics';
      const response = await axiosInstance.get(url);

      // 백엔드 컨트롤러에서 { statistics: { totalCnt, cancelCnt ... } } 형태로 반환
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export default {
  adminReservationThunk,
  adminReservationStatisticsThunk,
};