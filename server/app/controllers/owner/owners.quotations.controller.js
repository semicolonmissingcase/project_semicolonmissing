/**
 * @file app/controllers/owner/owners.quotations.controller.js
 * @description 점주 견적서 관련 컨트롤러
 * 251229 v1.0.0 jh init
 */

import { SUCCESS } from "../../../configs/responseCode.config.js";
import ownersQuotationsService from "../../services/owner/owners.quotations.service.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";

/**
 * 점주 견적서 상세
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
async function show(req, res, next) {
  const id = req.params.id;

  const result = await ownersQuotationsService.show(id);

  return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
}


export default {
  show,
};