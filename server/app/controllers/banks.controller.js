/**
 * @file app/controllers/banks.controller.js
 * @description banks 컨트롤러 
 * 260112 v1.0.0 yh init
 */

import { SUCCESS } from "../../configs/responseCode.config.js";
import banksService from "../services/banks.service.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

async function banksIndex(req, res, next) {
  try {
    const banks = await banksService.getBankList();

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, banks));
  } catch (error) {
    return next(error);
  }
}

export default {
  banksIndex,
}