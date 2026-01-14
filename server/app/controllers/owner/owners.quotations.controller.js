/**
 * @file app/controllers/owner/owners.quotations.controller.js
 * @description 점주 견적서 관련 컨트롤러
 * 251229 v1.0.0 jh init
 */

import { BAD_REQUEST_ERROR, SUCCESS } from "../../../configs/responseCode.config.js";
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

/**
 * 새로운 견적 요청서 작성
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
async function createReservation(req, res, next) {
  try {
    const { storeId, date, time, cleanerId } = req.body;
    let submissions = req.body.submissions;

    if(typeof submissions === 'string') {
      submissions = JSON.parse(submissions);
    }

    const files = req.files;

    if(!storeId || !date || !time) {
      return res.status(BAD_REQUEST_ERROR.status).send(createBaseResponse(BAD_REQUEST_ERROR, '매장, 날짜, 시간은 필수 입력 항목입니다.'));
    }

    const result = await ownersQuotationsService.createReservation(
      null,
      {
        ownerId: req.user.id,
        storeId,
        date,
        time,
        cleanerId,
        submissions,
        files,
      }
    );

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    next(error);
  }
}

/**
 * 견적 요청서 질문 목록 조회
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
async function getQuestions(req, res, next) {
  try {
    const questions = await ownersQuotationsService.getQuestions();

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, { questions }));
  } catch (error) {
    next(error);
  }
}

export default {
  show,
  createReservation,
  getQuestions,
};