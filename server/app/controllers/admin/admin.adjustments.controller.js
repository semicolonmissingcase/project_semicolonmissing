/**
 * @file app/controllers/admin/admin.adjustments.controller.js
 * @description 관리자 adjustments Controller
 * 260110 v1.0.0 jae init
 */


import { SUCCESS } from "../../../configs/responseCode.config.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";
import adminAdjustmentsService from "../../services/admin/admin.adjustments.service.js";

/**
 * 1. 정산 목록 조회 (Pagination)
 */
async function adjustmentIndex(req, res, next) {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.offset ? Number(req.query.offset) : 10;
    const offset = (page - 1) * limit;

    const { adjustments, total } = await adminAdjustmentsService.getAdjustments({ limit, offset });

    // 기사 프로필 관리와 동일하게 total, currentPage, 리스트를 담아 보냅니다.
    return res.status(SUCCESS.status).send(
      createBaseResponse(SUCCESS, {
        total: total,
        currentPage: page,
        adjustments: adjustments
      })
    );
  } catch (error) {
    next(error);
  }
}

/**
 * 2. 정산 통계 조회
 */
async function adjustmentStatisticsIndex(req, res, next) {
  try {
    const { statistics } = await adminAdjustmentsService.getStatistics();
    
    // 통계 데이터를 반환합니다.
    return res.status(SUCCESS.status).send(
      createBaseResponse(SUCCESS, { statistics })
    );
  } catch (error) {
    next(error);
  }
}

/**
 * 3. 정산 상태 업데이트 (POST)
 */
async function updateAdjustmentStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body; // '정산 완료'

    await adminAdjustmentsService.updateAdjustmentStatus(id, status);

    return res.status(SUCCESS.status).send(
      createBaseResponse(SUCCESS, { message: `정산 상태가 ${status}로 변경되었습니다.` })
    );
  } catch (error) {
    next(error);
  }
}

export default {
  adjustmentIndex,
  adjustmentStatisticsIndex,
  updateAdjustmentStatus,
};