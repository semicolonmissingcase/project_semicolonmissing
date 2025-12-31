/**
 * @file app/controllers/cleaner/cleaner.account.controller.js
 * @description cleaner account 관련 컨트롤러
 * 251230 v1.0.0 yh init
 */
import { SUCCESS } from "../../../configs/responseCode.config.js";
import cleanerAccountService from "../../services/cleaner/cleaner.account.service.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";

async function createAccountInfo(req, res, next) {
  try {
    const data = {
      id: req.body.id,
      cleanerId: req.body.cleaner_id,
      bank: req.body.bank,
      depositor: req.body.depositor,
      accountNumber: req.body.account_number,
      isPrimary: req.body.is_primary,
    };

    await cleanerAccountService.accountinfo(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS));

  }
  catch(error) {
    return next(error)
  }

}

export default {
  createAccountInfo,
}