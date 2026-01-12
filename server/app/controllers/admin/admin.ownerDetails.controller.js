/**
 * @file app/controllers/admin/admin.reservations.controller.js
 * @description 관리자 reservations Controller
 * 260113 v1.0.0 jae init
 */

import { SUCCESS } from "../../../configs/responseCode.config.js";
import adminOwnerDetailsService from "../../services/admin/admin.ownerDetails.service.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";

/**
 * 1. 점주 상세 통합 정보 조회 (상단 통계 + 매장 목록)
 */
async function ownerDetailIndex(req, res, next) {
  try {
    const { ownerId } = req.params; // URL 파라미터에서 점주 ID 추출

    // 통계와 상세 정보(매장 포함)를 병렬로 호출
    const [statistics, ownerInfo] = await Promise.all([
      adminOwnerDetailsService.getOwnerStatistics(ownerId),
      adminOwnerDetailsService.getOwnerDetailWithStores(ownerId)
    ]);

    return res.status(SUCCESS.status).send(
      createBaseResponse(SUCCESS, { 
        statistics, 
        ownerInfo 
      })
    );
  } catch (error) {
    next(error);
  }
}

/**
 * 2. 점주 예약 이력 조회 (하단 예약 이력 테이블 - 페이징 적용)
 */
async function ownerReservationHistoryIndex(req, res, next) {
  try {
    const { ownerId } = req.params;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.offset ? Number(req.query.offset) : 10; // 기본 10건
    const offset = (page - 1) * limit;

    const { rows, count } = await adminOwnerDetailsService.getOwnerReservationHistory(ownerId, { limit, offset });

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

export default {
  ownerDetailIndex,
  ownerReservationHistoryIndex,
}