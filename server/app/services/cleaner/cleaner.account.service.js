import db from './../../models/index.js'; 
import cleanerAccountsRepository from './../../repositories/cleaner/cleaner.account.repository.js';

/**
 * 특정 클리너의 모든 계좌 조회
 */
async function getAccounts(cleanerId) {
  return await cleanerAccountsRepository.findAllByCleanerId(cleanerId);
}

/**
 * 새 계좌 등록
 */
async function saveAccount(accountData) {
  const t = await db.sequelize.transaction();

  try {
    if (accountData.isDefault) {
      await cleanerAccountsRepository.resetDefaultStatus(accountData.cleanerId, t);
    }

    const newAccount = await cleanerAccountsRepository.create(accountData, t);

    await t.commit();
    return newAccount;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

/**
 * 계좌 정보 수정
 */
async function updateAccount(id, updateData) {
  const t = await db.sequelize.transaction();

  try {
    if (updateData.isDefault) {
      await cleanerAccountsRepository.resetDefaultStatus(updateData.cleanerId, t);
    }

    await cleanerAccountsRepository.update(id, updateData, t);

    await t.commit();
    return { success: true };
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

/**
 * 계좌 삭제
 */
async function deleteAccount(id) {
  return await cleanerAccountsRepository.deleteById(id);
}

export default {
  getAccounts,
  saveAccount,
  updateAccount,
  deleteAccount
};