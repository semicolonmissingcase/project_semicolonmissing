/**
 * @file app/controllers/auth.controller.js
 * @description 인증 관련 컨트롤러
 * 251222 v1.0.0 jae init
 */

import { SUCCESS } from "../../configs/responseCode.config.js";
import authService from "../services/auth.service.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

// ------------------
// -----public-------
// ------------------
/**
 * 로그인 컨틀로러 처리
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체
 */
async function ownerLogin(req, res, next) {
    const body = req.body;
    
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, body));
  }

async function cleanerLogin(req, res, next) {
  const body = req.body;

  return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, body));
}

async function adminLogin(req, res, next) {
  const body = req.body;

  return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, body));
}

// ------------
// export 
// ------------
export const authController = {
  ownerLogin,
  cleanerLogin,
  adminLogin,
};