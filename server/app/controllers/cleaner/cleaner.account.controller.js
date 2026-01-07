/**
 * @file app/controllers/cleaners/cleaner.accounts.controller.js
 * @description accounts 관련 컨트롤러
 * 260107 yh init
 */

import { SUCCESS } from "../../../configs/responseCode.config.js";
import { createBaseResponse } from "../../../app/utils/createBaseResponse.util.js";
import accountsService from "../../services/cleaner/cleaner.account.service.js";

/**
 * 로그인한 기사의 계좌 목록 조회
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

export default {
  getCleanerAccounts
}