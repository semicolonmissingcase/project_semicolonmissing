/**
 * @file app/repositories/banks.repository.js
 * @description banks repository
 * 260112 v1.0.0 yh init
 */
import db from '../models/index.js';
const { sequelize, BankCode } = db;

async function findAllBankCodes(t = null) {
  return BankCode.findAll({
    order: [
      ['name', 'ASC'],
    ],
    transaction: t
  });
}

export default {
  findAllBankCodes,
}