/**
 * @file app/controllers/admin/admin.owner.controller.js
 * @description 관리자 owners Controller
 * 260110 v1.0.0 jae init
 */

import { SUCCESS } from "../../../configs/responseCode.config.js";
import adminOwnersService from "../../services/admin/admin.owners.service.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";

/**
 * 점주 프로필 리스트
 */
async function ownerProfileIndex(req, res, next) {
  try {
    // 페이지네이션 설정
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.offset ? Number(req.query.offset) : 10;
    const offset = (page - 1) * limit;

    // 점주 서비스 호출
    const { rows, count } = await adminOwnersService.ownerGetProfiles({ limit, offset });

    return res.status(SUCCESS.status).send(
      createBaseResponse(SUCCESS, {
        total: count,
        currentPage: page,
        profiles: rows // 서비스에서 가공된 [이름, 전화번호, 매장수, 가입경로] 데이터가 포함됨
      })
    );
  } catch (error) {
    next(error);
  }
}

/**
 * 점주 통계 데이터
 */
async function ownerStatisticsIndex(req, res, next) {
  try {
    // 점주 서비스의 통계 함수 호출
    const statistics = await adminOwnersService.ownerGetStatistics();
    
    return res.status(SUCCESS.status).send(
      createBaseResponse(SUCCESS, { statistics })
    );
  } catch (error) {
    next(error);
  }
}

export default {
  ownerProfileIndex,
  ownerStatisticsIndex,
};