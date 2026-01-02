/**
 * @file app/controllers/owner/owner.estimate.controller.js
 * @description 견적서 관리 관련 컨트롤러
 * 260102 v1.0.0 ck init
 */

import { SUCCESS } from "../../../configs/responseCode.config.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";
import ownerEstimateService from "../../services/owner/owner.estimate.service.js";

/**
 * 견적 목록 조회
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
async function getEstimatesByReservationId(req, res, next) {
  try {
    const { reservationId } = req.params;
    const ownerId = req.user.id;
    const result = await ownerEstimateService.getOwnerReservations(reservationId, ownerId);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    return next(error);
  }
}

export default {
  getEstimatesByReservationId,
}