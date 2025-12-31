/**
 * @file app/controllers/payment.controller.js
 * @description 결제 컨트롤러 처리
 * 251231 v1.0.0 jae init
 */

import { UNAUTHORIZED_ERROR, SUCCESS } from "../../configs/responseCode.config.js";
import paymentService from "../services/payment.service.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

/**
 * 결제 승인 컨트롤러
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 * @returns 
 */
async function payment(req, res, next) {
  try {
    const { paymentKey, orderId, amount } = req.body;
    const user = req.user; 

    // 사용자 인증 정보 확인
    if(!user) {
      return res.status(401).send(createBaseResponse(UNAUTHORIZED_ERROR, error));
    }
    const result = await paymentService.confirmPayment({
      paymentKey,
      orderId,
      amount,
      userId: user.id
    });

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    next(error);
  }
}

export const paymentController = {
  confirmPayment,
};