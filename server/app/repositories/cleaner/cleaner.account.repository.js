/**
 * @file app/services/cleaner/cleaner.account.repository.js
 * @description cleaner account Repository
 * 251230 yh init
 */

import db from '../../models/index.js';

const { Adjustment } = db;

async function adjustmentsAccountInfo(t = null, {id, cleanerId}) {
  return await Adjustment.findOne(
    {
      attributes: ['id', 'cleanerId', 'bank', 'depositor', 'accountNumber', 'isPrimary'],
      where: {
        cleaner_id: cleanerId,
      }
    },
    {
      transaction: t
    }
  );
}
    
export default {
  adjustmentsAccountInfo  
}