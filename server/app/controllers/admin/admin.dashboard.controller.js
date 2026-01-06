/**
 * @file app/controllers/admin/admin.dashboard.controller.js
 * @description 관리자 대시보드 Controller
 * 260106 v1.0.0 jae init
 */

import adminDashboardService from "../../services/admin/admin.dashboard.service.js";
import { SUCCESS } from "../../../configs/responseCode.config.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";

/**
 * 통합 모니터링 데이터 조회
 */
async function getMonitoringData(req, res, next) {
  try {
    // 1. 쿼리 스트링에서 날짜를 받아올 수 있도록 설정 (예: ?date=2025-12-15)
    const { date } = req.query;

    // 2. 서비스 호출
    const dashboardData = await adminDashboardService.getDashboardData(date);

    // 3. 성공 응답 전송
    return res.status(SUCCESS.status).send(
      createBaseResponse(SUCCESS, dashboardData)
    );
    
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export default {
  getMonitoringData,
};