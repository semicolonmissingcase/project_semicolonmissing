
import db from '../../models/index.js';

//  조회 
async function findAllByCleanerId(cleanerId, t = null) {
  return await db.CleanerAccount.findAll({
    where: { cleanerId },
    order: [
      ['isDefault', 'DESC'],
      ['createdAt', 'DESC']
    ],
    transaction: t
  });
}

//  저장 
async function create(accountData, t = null) {
  return await db.CleanerAccount.create(accountData, {
    transaction: t
  });
}

//  수정 
async function update(id, updateData, t = null) {
  return await db.CleanerAccount.update(updateData, {
    where: { id }, 
    transaction: t
  });
}

//  삭제 
async function deleteById(cleanerId, t = null) {
  return await db.CleanerAccount.destroy({
    where: { cleanerId }, 
    transaction: t
  });
}

async function resetDefaultStatus(cleanerId, t = null) {
  return await db.CleanerAccount.update(
    { isDefault: false },
    {
      where: { cleanerId, isDefault: true },
      transaction: t
    }
  );
}

export default {
  findAllByCleanerId,
  create,
  update,
  deleteById,
  resetDefaultStatus
};