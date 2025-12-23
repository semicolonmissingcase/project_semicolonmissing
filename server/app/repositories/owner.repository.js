/**
 * @file app/repositories/owner.repository.js
 * @description Owner Repository
 * 251222 v1.0.0 jae init
 */

import db from '../models/index.js';
const { Owner } = db;

async function findByEmail(t = null, email) {
  // SELECT = FROM owners WHERE email = ? AND deleted_at IS NULL;
  return await Owner,findOne(
    {
      where: {
        email: email
      }
    },
    {
      transaction: t
    }
  );
}

export default {
  findByEmail,
}