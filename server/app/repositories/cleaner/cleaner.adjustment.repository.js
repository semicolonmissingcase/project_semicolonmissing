import db from "../../models/index.js";
const { Adjustment, Reservation } = db;

async function create(t = null, data) {
  return await Adjustment.create(data, { transaction: t });
}

async function findAllByCleanerId(cleanerId) {
  return await Adjustment.findAll({
    where: { cleanerId },
    order: [['created_at', 'DESC']],
    include: [{ model: Reservation, attributes: ['date', 'title'] }]
  });
}

// 특정 예약이 이미 정산 신청되었는지 확인
async function findExistingByReservationId(reservationId) {
  return await Adjustment.findOne({
    where: { reservationId }
  });
}

export default {
  create,
  findAllByCleanerId,
  findExistingByReservationId
};