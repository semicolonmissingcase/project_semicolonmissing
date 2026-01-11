/**
 * @file app/controllers/cleaner/cleaner.account.controller.js
 * @description 클리너 계좌 관리 컨트롤러
 */

import { BAD_REQUEST_ERROR, SUCCESS } from "../../../configs/responseCode.config.js";
import cleanerAccountService from "../../services/cleaner/cleaner.account.service.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";

/**
 * 계좌 정보 상세 조회
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */// cleaner.account.controller.js

async function getAccounts(req, res, next) {
  try {

    const cleanerId = req.user?.id;

    if (!cleanerId) {

      return res.status(BAD_REQUEST_ERROR.status)
        .send(createBaseResponse(BAD_REQUEST_ERROR, '인증 정보가 없습니다.'));
    }

    const result = await cleanerAccountService.getAccounts(cleanerId);
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    next(error);
  }
}

/**
 * 계좌 등록 및 수정 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function createAccount(req, res, next) {
  try {
    const cleanerId = req.user?.id;
    const body = req.body || {};
    const { bankCode, accountNumber, depositor } = body;

    if (!cleanerId) {
      return res.status(UNAUTHORIZED_ERROR.status)
        .send(createBaseResponse(UNAUTHORIZED_ERROR, '인증 정보가 없습니다.'));
    }

    if (!bankCode || !accountNumber || !depositor) {
      // 데이터가 없으면 400 에러를 반환하게 해서 500 에러(서버 다운)를 방지합니다.
      return res.status(400).json({ msg: "필수 입력 정보가 누락되었습니다." });
    }

    const result = await cleanerAccountService.saveAccount({
      cleanerId,
      bankCode,
      accountNumber,
      depositor
    });

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    console.error('Create Account Error:', error); // 에러 로그 기록
    next(error);
  }
}

/**
 * 계좌 삭제
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function deleteAccount(req, res, next) {
  try {
    const cleanerId = req.user?.id;

    if (!cleanerId) {
      return res.status(BAD_REQUEST_ERROR.status)
        .send(createBaseResponse(BAD_REQUEST_ERROR, '클리너 식별 정보를 찾을 수 없습니다.'));
    }


    await cleanerAccountService.deleteAccount(cleanerId);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, '계좌 정보가 성공적으로 삭제되었습니다.'));
  } catch (error) {
    console.error('Delete Account Error:', error);
    next(error);
  }
}

export default {
  getAccounts,
  createAccount,
  deleteAccount,
};