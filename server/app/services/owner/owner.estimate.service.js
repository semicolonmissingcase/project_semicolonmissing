/**
 * @file app/services/owner/owner.estimate.service.js
 * @description 견적서 Service
 * 260102 CK init
 */

import ownerEstimateRepository from "../../repositories/owner/owner.estimate.repository.js";

/**
 * 점주 예약 목록 조회
 * @param {number} reservationId
 * @param {number} ownerId 
 */
async function getOwnerReservations(reservationId, ownerId) {
  return await ownerEstimateRepository.getEstimatesByReservationId(reservationId, ownerId);
}

export default {
  getOwnerReservations,
}