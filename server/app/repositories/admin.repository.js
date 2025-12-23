/**
 * @file app/repositories/admin.repository.js
 * @description Admin Repository
 * 251222 v1.0.0 jae init
 */

import db from '../models/index.js';
const { Admin } = db;

async function findByEmail(t = null, email) {
  // SELECT = FROM cleaners WHERE email = ? AND deleted_at IS NULL;
  return await Admin,findOne(
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