import db from '../../models/index.js';
import cleanerAccountRepository from '../../repositories/cleaner/cleaner.account.repository.js';

const getAccounts = async (cleanerId) => {
  return await cleanerAccountRepository.findAllByCleanerId(cleanerId);
};

async function saveAccount({ cleanerId, bankCode, accountNumber, depositor }) {

  const existingAccount = await db.CleanerAccount.findOne({
    where: { cleanerId }
  });

  const accountData = {
    cleanerId,
    bankCode,
    accountNumber,
    depositor,
    deletedAt: null
  };

  if (existingAccount) {

    return await db.CleanerAccount.update(accountData, {
      where: { cleanerId }
    });
  } else {

    return await db.CleanerAccount.create(accountData);
  }
}

const deleteAccount = async (cleanerId) => {
  return await cleanerAccountRepository.deleteById(cleanerId);
};

export default {
  getAccounts,
  saveAccount,
  deleteAccount
};