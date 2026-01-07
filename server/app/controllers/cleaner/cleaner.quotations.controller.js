/**
 * @file app/controllers/cleaner/cleaner.quotations.controller.js
 * @description 기사님 신규 요청 컨트롤러
 * 260106 yh init
 */

import { SUCCESS } from "../../../configs/responseCode.config.js";
import cleanerQuotationsService from "../../services/cleaner/cleaner.quotations.service.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";

async function index(req, res, next) {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.offset ? Number(req.query.offset) : 4;
    const offset = (page - 1) * limit;

    const { count, rows } = await cleanerQuotationsService.getPrioritizedReservations({limit, offset});

    const responseData = {
      total: count,
      currentPage: page,
      reservations: rows
    }

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, responseData));
  } catch (error) {
    return next(error);
  }
}

async function store(req, res,next) {
  try {
    const cleanerId = req.user.id;
    const reservationId = Number(req.body.reservationId);
    const estimatedAmount = Number(req.body.estimatedAmount);
    const description = req.body.description;

    await cleanerQuotationsService.storeQuotation({ cleanerId, reservationId, estimatedAmount, description });

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS));
  } catch (error) {
    return next(error);
  }
}

export default {
  index,
  store,
}