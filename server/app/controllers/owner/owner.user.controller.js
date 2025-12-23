/**
 * @file app/controllers/owner/owner.user.controller.js
 * @description 점주 로그인 관련 컨트롤러
 * 251223 v1.0.0 ck init
 */

import { SUCCESS } from "../../../configs/responseCode.config.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";
import ownerUserService from "../../services/owner/owner.user.service.js";

/**
 * 점주 회원가입 요청 처리
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
async function registerOwner(req, res, next) {
  try {
    const data = {
      name: req.body.name,
      gender: req.body.gender,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      storeName: req.body.storeName,
      storePhone: req.body.storePhone,
      address: req.body.address,
      addressDetail: req.body.addressDetail,
    }

    await ownerUserService.store(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS));
  } catch (error) {
    return next(error);
  }
}

export default {
  registerOwner,
}