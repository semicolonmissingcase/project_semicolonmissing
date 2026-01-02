/**
 * @file app/controllers/payment.controller.js
 * @description 결제 컨트롤러 처리
 * 251231 v1.0.0 jae init
 */

import { SUCCESS, UNAUTHORIZED_ERROR } from '../../configs/responseCode.config.js';
import myError from '../errors/customs/my.error.js';
import paymentService from '../services/payment.service.js';
import { createBaseResponse } from '../utils/createBaseResponse.util.js';

/**
 * 결제 준비 컨트롤러 
 * @description 클라이언트 결제 요청 시, 서버에서 결제 정보를 미리 생성하고 검증하는 단계
 *              성공 시, 클라이언트에서 토스 페이먼츠를 호출하기 위해 필요한 정보(orderId, amount 등)을 반환
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
async function readyPayment(req, res, next) {
  try {
    const { reservationId } = req.body;

    const user = req.user;

    const result = await paymentService.readyPayment({
      reservationId,
      userId: user.id,
    });

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    return next(error);
  }
}

/**
 * 결제 승인 컨트롤러 
 * @description 토스 페이먼츠 창에서 사용자가 결제를 완료하면, 
 *              클라이언트에서 반환받은 paymentKey, orderId, amount를 보내와서 최종 승인 요청
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
async function confirmPayment(req, res, next) {
  try {
    const { paymentKey, orderId, amount } = req.body;

    if(!req.user) {
      throw myError("인증 정보가 없습니다. 로그인을 다시 해주세요.", UNAUTHORIZED_ERROR);
    }

    const result = await paymentService.confirmPayment({
      paymentKey,
      orderId,
      amount,
      userId: req.user.id,
    });

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    return next(error);
  }
}


export default {
  readyPayment,
  confirmPayment,
};