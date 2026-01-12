/**
 * @file app/controllers/admin/admin.reservations.controller.js
 * @description 관리자 reservations Controller
 * 260113 v1.0.0 jae init
 */

import { SUCCESS } from "../../../configs/responseCode.config.js";
import adminReservationsService from "../../services/admin/admin.reservations.service.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";

/**
 * 예약 리스트 조회 컨트롤러 (하단 테이블용)
 */
async function reservationIndex(req, res, next) {
  try {
    // 페이지네이션 설정: 기본 페이지 1, 기본 출력 개수 10 (예약은 데이터가 많으므로 10으로 권장)
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.offset ? Number(req.query.offset) : 10;
    const offset = (page - 1) * limit;

    const { rows, count } = await adminReservationsService.getReservations({ limit, offset });

    // 프로필 대신 reservations라는 키로 데이터를 전달합니다.
    return res.status(SUCCESS.status).send(
      createBaseResponse(SUCCESS, { 
        total: count, 
        currentPage: page, 
        reservations: rows 
      })
    );
  } catch (error) {
    next(error);
  }
}

/**
 * 예약 통계 조회 컨트롤러 (상단 통계 카드용 - 한 달 기준)
 */
async function statisticsIndex(req, res, next) {
  try {
    const statistics = await adminReservationsService.getStatistics();
    
    // 서비스에서 계산된 totalCnt, cancelCnt 등이 담긴 객체를 반환합니다.
    return res.status(SUCCESS.status).send(
      createBaseResponse(SUCCESS, { statistics })
    );
  } catch (error) {
    next(error);
  }
}

export default {
  reservationIndex,
  statisticsIndex,
};