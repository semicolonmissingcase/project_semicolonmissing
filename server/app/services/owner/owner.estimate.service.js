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

/**
 * 특정 예약 ID에 대한 '수락' 상태의 견적 목록 조회
 * @param {number} reservationId
 * @param {number} ownerId 
 */
async function getAcceptedEstimatesByReservationId(reservationId, ownerId) {
  const estimates = await ownerEstimateRepository.findAcceptedEstimatesByOwnerId(reservationId, ownerId);
  return estimates;
}

/**
 * 점주 ID에 대한 '수락' 상태의 견적 목록 조회
 * @param {number} reservationId
 * @param {number} ownerId 
 */
async function getAcceptedEstimatesByOwnerId(ownerId) {
  const estimates = await ownerEstimateRepository.findAcceptedEstimatesByOwnerId(ownerId);
  return estimates;
}

export default {
  getOwnerReservations,
  getAcceptedEstimatesByReservationId,
  getAcceptedEstimatesByOwnerId,
}