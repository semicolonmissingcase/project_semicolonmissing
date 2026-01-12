/**
 * @file app/services/banks.service.js
 * @description banks service
 * 260112 v1.0.0 yh init
 */

import banksRepository from "../repositories/banks.repository.js"

async function getBankList() {
  return await banksRepository.findAllBankCodes();
}

export default {
  getBankList,
}