/**
 * @file app/controllers/admin/admin.reviews.controller.js
 * @description 관리자 reviews Controller
 * 260113 v1.0.0 jae init
 */

import { SUCCESS } from "../../../configs/responseCode.config.js";
import adminReviewsService from "../../services/admin/admin.reviews.service.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";

/**
 * 리뷰 리스트 조회 컨트롤러
 */
async function reviewIndex(req, res, next) {
  try {
    /**
     * 페이지네이션 설정: 기본 페이지 1, 기본 출력 개수 10개
     */
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.offset ? Number(req.query.offset) : 10;
    const offset = (page - 1) * limit;

    const { total, reviews } = await adminReviewsService.getReviewList({ limit, offset });

    return res.status(SUCCESS.status).send(
      createBaseResponse(SUCCESS, {
        total: total,
        currentPage: page,
        reviews: reviews
      })
    );
  } catch (error) {
    next(error);
  }
}

/**
 * 리뷰 통계 조회 컨트롤러
 */
async function statisticsIndex(req, res, next) {
  try {
    const statistics = await adminReviewsService.getStatistics();

    return res.status(SUCCESS.status).send(
      createBaseResponse(SUCCESS, { statistics })
    );
  } catch (error) {
    next(error);
  }
}

export default {
  reviewIndex,
  statisticsIndex,
};