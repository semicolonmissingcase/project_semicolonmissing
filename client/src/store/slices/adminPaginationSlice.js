/**
 * @file src/store/slices/adminCleanersSlice.js
 * @description 관리자 사이트 게시판 공통 슬라이스
 * 260108 v1.0.0 pbj init
 */

import { createSlice } from "@reduxjs/toolkit";
import adminCleanersThunk from "../thunks/adminCleanersThunk.js";
import adminInquiryThunk from "../thunks/adminInquiryThunk.js";
import adminOwnersThunk from "../thunks/adminOwnersThunk.js";
import adminDashboardThunk from "../thunks/adminDashboardThunk.js";
import adminAdjustmentsThunk from "../thunks/adminAdjustmentsThunk.js";

const initialState = {
  // index 관련
  data: null,       // 테이블에 출력할 데이터
  statistics: null, // 통계에 출력할 데이터
  chartData: [],    // 차트 데이터
  page: 1,          // 현재 페이지
  offset: 10,       // 출력할 갯수
  totalCount: 0,    // 총 데이터 갯수
  error: null,      // 에러 정보 ( null이 아닐 시, 에러 페이지로 이동용 )
};

const slice = createSlice({
  name: 'adminPagination',
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setOffset(state, action) {
      state.offset = action.payload;
    },
    clearAdminCleaners(state) {
      state.data = [];
      state.statistics = null;
      state.page = 0;
      state.offset = 10;
      state.totalCount = 0;
      state.error = null;
    },
    clearAdminOwners(state) {
      state.data = [];
      state.statistics = null;
      state.page = 0;
      state.offset = 10;
      state.totalCount = 0;
      state.error = null;
    },
    clearAdminDashboards(state) {
      state.data = [];
      state.statistics = null;
      state.chartData = [];
      state.page = 0;
      state.totalCount = 0;
      state.error = null;
    },
    clearAdminAdjustments(state) {
      state.data = [];
      state.statistics = null;
      state.page = 1;
      state.offset = 10;
      state.totalCount = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // -----------------------
      // 통합 모니터링
      // -----------------------
      .addCase(adminDashboardThunk.getDashboardData.fulfilled, (state, action) => {
        const { statistics, profiles, chartData } = action.payload.data;

        state.data = profiles;
        state.statistics = statistics;
        state.chartData = chartData;

        state.totalCount = profiles?.length || 0;
        state.page = 1;
      })


      // ------------------------
      // 기사 프로필 관리
      // ------------------------
      .addCase(adminCleanersThunk.adminCleanerProfileThunk.fulfilled, (state, action) => {
        const { total, currentPage, profiles } = action.payload.data;

        state.data = profiles;
        state.totalCount = total;
        state.page = currentPage;
      })
      .addCase(adminCleanersThunk.adminCleanerProfileStatisticsThunk.fulfilled, (state, action) => {
        const { statistics } = action.payload.data;

        state.statistics = statistics;
      })
      // ------------------------
      // 문의 관리 (Q&A)
      // ------------------------
      .addCase(adminInquiryThunk.getInquiryListThunk.fulfilled, (state, action) => {
        const { total, currentPage, inquiries, statistics } = action.payload.data;

        state.data = inquiries;
        state.totalCount = total;
        state.page = currentPage;
        state.statistics = statistics;
      })
      // ------------------------
      // 각 기능 별로 addCase()추가하여 사용
      // thunk는 달라도 상관없음
      // ------------------------

      // ------------------------
      // 점주 프로필 관리
      // ------------------------
      .addCase(adminOwnersThunk.adminOwnerProfileThunk.fulfilled, (state, action) => {
        const { total, currentPage, profiles } = action.payload.data;

        state.data = profiles;
        state.totalCount = total;
        state.page = currentPage;
      })
      .addCase(adminOwnersThunk.adminOwnerProfileStatisticsThunk.fulfilled, (state, action) => {
        const { statistics } = action.payload.data;

        state.statistics = statistics;
      })

      // ------------------------
      // 정산 관리 내역 조회
      // ------------------------
      .addCase(adminAdjustmentsThunk.adminAdjustmentThunk.fulfilled, (state, action) => {
        const { total, currentPage, adjustments } = action.payload.data;

        state.data = adjustments;
        state.totalCount = total;
        state.page = currentPage;
        state.error = null;
      })

      // ------------------------
      // 정산 통계 조회
      // ------------------------
      .addCase(adminAdjustmentsThunk.adminAdjustmentStatisticsThunk.fulfilled, (state, action) => {
        const { statistics } = action.payload.data;
        state.statistics = statistics;
      })

      // ------------------------
      // 정산 상태 업데이트
      // ------------------------
      .addCase(adminAdjustmentsThunk.adminUpdateAdjustmentStatusThunk.fulfilled, (state, action) => {
        console.log("정산 상태 업데이트 성공");
      })

      // ------------------------
      // 에러 처리
      // ------------------------
      .addMatcher(
        action => action.type.endsWith("/rejected"),
        (state, action) => {
          state.error = action.payload;
          console.log('addMatcher', action, state.error);
        }
      )
      ;
  },
});

export const {
  setPage,
  setOffset,
  clearAdminCleaners,
  clearAdminOwners,
  clearAdminDashboards,
  clearAdminAdjustments,
} = slice.actions;

export default slice.reducer;