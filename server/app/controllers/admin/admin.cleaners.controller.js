/**
 * @file app/controllers/admin/admin.cleaners.controller.js
 * @description 관리자 cleaners Controller
 * 260107 v1.0.0 pbj init
 */

import { SUCCESS } from "../../../configs/responseCode.config.js";
import adminCleanersService from "../../services/admin/admin.cleaners.service.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";

async function profileIndex(req, res, next) {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.offset ? Number(req.query.offset) : 4;
    const offset = (page - 1) * limit;

    const { rows, count } = await adminCleanersService.getProfiles({limit, offset});

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, {total: count, currentPage: page, profiles: rows}));
  } catch (error) {
    next(error);
  }
}

async function statisticsIndex(req, res, next) {
  try {
    const statistics = await adminCleanersService.getStatistics();
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, {statistics}));
  } catch (error) {
    next(error);
  }
}

export default {
  profileIndex,
  statisticsIndex,
}