/**
 * @file app/repositories/cleaner.repository.js
 * @description Cleaner Repository
 * 251222 v1.0.0 jae init
 */

import db from '../models/index.js';
const { Cleaner } = db;

async function findByEmail(t = null, email) {
  // SELECT = FROM cleaners WHERE email = ? AND deleted_at IS NULL;
  return await Cleaner,findOne(
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