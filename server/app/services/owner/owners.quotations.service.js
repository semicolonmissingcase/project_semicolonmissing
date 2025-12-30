/**
 * @file app/services/owner/owners.quotations.service.js
 * @description owner quotations Service
 * 251229 jh init
 */

import { ALREADY_PROCESSED_ERROR } from "../../../configs/responseCode.config.js";
import myError from "../../errors/customs/my.error.js";
import ownersQuotationsRepository from "../../repositories/owner/owners.quotations.repository.js"

/**
 * 견적 요청서 상세
 * @param {number} id Reservation PK
 * @returns {import("../../models/index.js").Reservation}
 */
async function show(id) {
  // 예약 정보 획득
  const reservation = await ownersQuotationsRepository.reservationFindByIdAndStatusIsRequest(null, id);

  // 예약 정보 없을 경우 예외 처리
  if(!reservation) {
    throw myError('이미 처리된 견적서', ALREADY_PROCESSED_ERROR)
  }

  // 질문정보 획득
  const submissions = await ownersQuotationsRepository.submissionFindByReservationId(null, id);

  return {reservation, submissions};
}

export default {
  show,
}