/**
 * @file app/services/cleaner/cleaner.quotations.service.js
 * @description cleaner quotations Service
 * 260106 yh init
 */

import cleanerQuotationsRepository from "../../repositories/cleaner/cleaner.quotations.repository.js";
import modelsConstants from '../../constants/models.constants.js';
const { EstimateStatus, ReservationStatus } = modelsConstants;
import db from '../../models/index.js';
import myError from "../../errors/customs/my.error.js";
import { ALREADY_PROCESSED_ERROR } from "../../../configs/responseCode.config.js";
const { sequelize } = db;

async function getPrioritizedReservations({limit, offset}) {
  return await cleanerQuotationsRepository.findAllPrioritizedReservationsPagination(null, {limit, offset});
}

async function storeQuotation({cleanerId, reservationId, estimatedAmount, description }) {
  return await sequelize.transaction(async t => {
    // 예약 정보 확인
    const reservation = await cleanerQuotationsRepository.findByPkOnReservation(t, reservationId);

    if(!reservation) {
      throw myError('예약 정보 없음', ALREADY_PROCESSED_ERROR);
    } else if(reservation.status !== ReservationStatus.REQUEST) {
      throw myError('이미 처리된 예약', ALREADY_PROCESSED_ERROR);
    }

    // 신규 견적서 작성
    const newEstimate = {
      cleanerId: cleanerId,
      reservationId: reservationId,
      estimatedAmount: estimatedAmount,
      description: description,
      status: EstimateStatus.SENT,
    };

    await cleanerQuotationsRepository.store(t, newEstimate);

    // 예약 상태 변경
    reservation.status = ReservationStatus.APPROVED;
    await cleanerQuotationsRepository.saveReservation(t, reservation);

    return;
  });
}

export default {
  getPrioritizedReservations,
  storeQuotation,
}