/**
 * @file app/controllers/admin/admin.cleanerTasks.controller.js
 * @description 관리자 cleanerTasks Controller
 * 260113 v1.0.0 jae init
 */

import { SUCCESS } from "../../../configs/responseCode.config.js";
import adminCleanerTasksService from "../../services/admin/admin.cleanerTasks.service.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";

/**
 * 기사 작업 리스트 조회 컨트롤러
 */
async function tasksIndex(req, res, next) {
  try {
    /**
     * 페이지네이션 설정: 기본 페이지 1, 기본 출력 개수 10개
     */
    const page = req.query.paage ? Number(req.query.page) : 1;
    const limit = req.query.offset ? Number(req.query.offset) : 10;
    const offset = (page - 1) * limit;

    /**
     * 서비스에서 가공된 데이터 가져옴
     */
    const { total, tasks } = await adminCleanerTasksService.getCleanerTasks({ limit, offset });

    return res.status(SUCCESS.status).send(
      createBaseResponse(SUCCESS, {
        total: total,
        currentPage: page,
        reservations: tasks
      })
    );
  } catch (error) {
    next(error);
  }
}

/**
 * 기사 작업 통계 조회 컨트롤러
 */
async function statisticsIndex(req, res, next) {
  try {
    const statistics = await adminCleanerTasksService.getStatistics();

    return res.status(SUCCESS.status).send(
      createBaseResponse(SUCCESS, { statistics })
    );
  } catch (error) {
    next(error);
  }
}

export default {
  tasksIndex,
  statisticsIndex,
};