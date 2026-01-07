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
      ...req.body,
  
      provider: req.params.provider || req.body.provider || 'NONE',
    };

    // 데이터가 잘 들어오는지 디버깅용 로그 (나중에 지우세요)
    console.log("전송된 데이터 확인:", data);

    const result = await usersService.store(data);

    return res.json(createBaseResponse(SUCCESS, result));
  } catch (err) {
    next(err);
  }
}

export default {
  registerCleaner
}