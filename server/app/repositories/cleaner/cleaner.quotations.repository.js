/**
 * @file app/repositories/owner/cleaner.quotations.repository.js
 * @description cleaner quotations Repository
 * 260106 v1.0.0 yh init
 */

import modelsConstants from '../../constants/models.constants.js';
import db from '../../models/index.js';
const { sequelize, Reservation, Store, Owner, Estimate } = db;

async function findAllPrioritizedReservationsPagination(t = null, {limit, offset}) {
  return await Reservation.findAndCountAll(
    {
      where: {
        status: modelsConstants.ReservationStatus.REQUEST
      },
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

async function store(t = null, data) {
  return await Estimate.create(data);
}

async function findByPkOnReservation(t = null, id) {
  return await Reservation.findByPk(id, { transaction: t });
}

async function saveReservation(t= null, reservation) {
  await reservation.save({transaction: t});
}

export default {
  findAllPrioritizedReservationsPagination,
  store,
  findByPkOnReservation,
  saveReservation,
}