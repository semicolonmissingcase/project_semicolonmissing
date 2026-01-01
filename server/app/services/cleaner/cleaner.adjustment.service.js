import { CONFLICT_ERROR, BAD_REQUEST } from "../../../configs/responseCode.config.js";
import myError from "../../errors/customs/my.error.js";
import db from "../../models/index.js";
import adjustmentRepository from "../../repositories/cleaner/adjustment.repository.js";

/**
 * 정산 요청 저장
 */
async function createRequest(data) {
  const { cleanerId, reservationId, settlementAmount, bank, accountNumber } = data;

  return await db.sequelize.transaction(async t => {
    // 1. 이미 해당 예약에 대한 정산 신청이 있는지 확인
    const existing = await adjustmentRepository.findExistingByReservationId(reservationId);
    if (existing) {
      throw myError('이미 정산 신청이 완료된 건입니다.', CONFLICT_ERROR);
    }

    // 2. 정산 데이터 생성
    const adjustmentData = {
      cleanerId,
      reservationId,
      settlementAmount,
      bank,
      accountNumber,
      status: 'PENDING' // 기본 상태: 대기중
    };

    const result = await adjustmentRepository.create(t, adjustmentData);
    return result;
  });
}

/**
 * 내역 가져오기
 */
async function getHistory(cleanerId) {
  return await adjustmentRepository.findAllByCleanerId(cleanerId);
}

export default {
  createRequest,
  getHistory
};