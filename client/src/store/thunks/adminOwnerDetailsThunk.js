/**
 * @file src/store/thunks/adminOwnerDetailsThunk.js
 * @description adminOwnerDetailsThunk
 * 260113 v1.0.0 jae init
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

/**
 * 1. 점주 상세 통합 정보 조회 Thunk
 * (상단 통계 + 점주 기본 정보 + 매장 목록)
 */
const getAdminOwnerDetailThunk = createAsyncThunk(
  'adminOwnerDetail/getAdminOwnerDetailThunk',
  async (ownerId, { rejectWithValue }) => {
    try {
      // 위에서 만든 라우터 주소: /api/admin/owners/profiles/:ownerId
      const url = `/api/admin/owners/profiles/${ownerId}`;
      const response = await axiosInstance.get(url);

      return response.data; // { statistics, ownerInfo } 반환
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * 2. 점주 예약 이력 조회 Thunk (페이징 적용)
 */
const getAdminOwnerReservationHistoryThunk = createAsyncThunk(
  'adminOwnerDetail/getAdminOwnerReservationHistoryThunk',
  async (ownerId, { rejectWithValue, getState }) => {
    try {
      // 기존 pagination state 활용 (없을 경우 기본값 설정 가능)
      const { adminPagination } = getState();
      const { page, offset } = adminPagination;
      
      const params = {
        page: page,
        offset: offset
      };

      // 위에서 만든 라우터 주소: /api/admin/owners/profiles/:ownerId/reservations
      const url = `/api/admin/owners/profiles/${ownerId}/reservations`;
      const response = await axiosInstance.get(url, { params });

      return response.data; // { total, currentPage, reservations } 반환
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export default {
  getAdminOwnerDetailThunk,
  getAdminOwnerReservationHistoryThunk,
};