/**
 * @file app/controllers/cleaners/cleaner.user.controller.js
 * @description user 관련 컨트롤러
 * 251230 v1.0.0 yh init
 */

import { SUCCESS } from "../../../configs/responseCode.config.js";
import { createBaseResponse } from "../../../app/utils/createBaseResponse.util.js";
import usersService from "../../services/cleaner/cleaners.user.service.js";
 

/**
 * 회원가입 작성
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체 
 * @returns
 */
async function registerCleaner(req, res, next) {
  try {

    const data = {
      
      phone: req.body.phone,
      gender: req.body.gender,
      email: req.body.email,
      password: req.body.password,
      provider: req.body.provider,
      passwordChk: req.body.passwordChk,
      name: req.body.name,
      profile: req.body.profile,
      locationId: req.body.locationId, 
    };

    await usersService.store(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS));
  } catch(error) {
    return next(error);
  }
}

export default {
  registerCleaner
}