/**
 * @file app/services/cleaner/cleaner.accounts.service.js
 * 260107 yh init
 */
import db from "../../models/index.js";
import accountsRepository from "../../repositories/cleaner/cleaner.account.repository.js";

const CleanerAccount = db.CleanerAccount;

/**
 * 기사 계좌 목록 불러오기
 * @param {number} cleanerId
 */
async function getAccounts(cleanerId) {
  const rows = await accountsRepository.findAllByCleanerId(cleanerId);
  return { rows };
}

/**
 * 특정 계좌 상세 정보 불러오기
 */
async function getAccountDetail(accountId) {
  const account = await CleanerAccount.findByPk(accountId);
  return account;
}

export default {
  getAccounts,
  getAccountDetail
}



