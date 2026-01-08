/**
 * @file app/controllers/cleaners/cleaner.accounts.controller.js
 * @description accounts 관련 컨트롤러 (getCleanerAccounts, registerOrUpdateAccount 추가)
 */

import { SUCCESS } from "../../../configs/responseCode.config.js";
import { createBaseResponse } from "../../../app/utils/createBaseResponse.util.js";
import accountsService from "../../services/cleaner/cleaner.account.service.js";


/**
 * 1. 로그인한 기사의 계좌 목록 조회
 */
async function getCleanerAccounts(req, res, next) {
  try {

    const cleanerId = req.user?.id || req.params.cleanerId;

    if (!cleanerId) {
      return res.status(400).json({ msg: "기사 정보가 없습니다." });
    }

    const result = await accountsService.getAccounts(cleanerId);

    return res.status(200).json(createBaseResponse(SUCCESS, result));
  } catch (err) {
    next(err);
  }
}

/**
 * 2. 기사의 계좌 정보 등록 또는 수정
 */
async function registerOrUpdateAccount(req, res, next) {
  try {
    const cleanerId = req.user?.id;

    if (!cleanerId) {

      return res.status(401).json({ msg: "로그인된 사용자 정보가 없습니다." });
    }


    const {
      bankName,
      accountNumber,
      accountHolder,
      isPrimary
    } = req.body;


    if (!bankName || !accountNumber || !accountHolder) {
      return res.status(400).json({ msg: "계좌 정보를 모두 입력해주세요." });
    }

    // 서비스 계층으로 데이터 전달
    const result = await accountsService.registerOrUpdate({
      cleanerId,
      bankName,
      accountNumber,
      accountHolder,
      isPrimary: isPrimary || true
    });

    return res.status(201).json(createBaseResponse(SUCCESS, result));
  } catch (err) {
    next(err);
  }
}


export default {
  getCleanerAccounts,
  registerOrUpdateAccount
}