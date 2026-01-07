/**
 * @file app/repositories/owner/cleaner.quotations.repository.js
 * @description cleaner quotations Repository
 * 260106 v1.0.0 yh init
 */

import db from '../../models/index.js';
const { sequelize, Reservation, Store, Owner } = db;

async function findAllPrioritizedReservationsPagination(t = null, {limit, offset}) {
  return await Reservation.findAndCountAll(
    {
      include: [
        {
          model: Store,
          as: 'store',
          required: false,
          include: [
            {
              model: Owner,
              as: 'owner',
              required: false,
            }
          ],
        }
      ],
      order: [
        ['isAssign', 'ASC']
        ,['createdAt', 'DESC']
      ],
      limit,
      offset,
    },
    {
      transaction: t,
    }
  );
}

export default {
  findAllPrioritizedReservationsPagination,
}