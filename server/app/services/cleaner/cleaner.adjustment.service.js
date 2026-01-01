import { CONFLICT_ERROR } from "../../../configs/responseCode.config.js";
import myError from "../../errors/customs/my.error.js";
import db from "../../models/index.js";
import adjustmentRepository from '../../repositories/cleaner/cleaner.adjustment.repository.js';

/**
 * 정산 요청 저장
 */
async function createRequest(data) {
  // Postman에서 들어오는 값들
  const { 
    cleanerId, 
    reservationId, 
    settlementAmount,       
    bank,     
    accountNumber, 
    depositor 
  } = data;

  return await db.sequelize.transaction(async t => {
    // 1. 중복 확인
    const existing = await adjustmentRepository.findExistingByReservationId(reservationId);
    if (existing) {
      throw myError('이미 정산 신청이 완료된 건입니다.', CONFLICT_ERROR);
    }

    // 2. DB 로그에 찍힌 실제 컬럼명(Not Null 필드)에 맞춰 데이터 구성
    const adjustmentData = {
      cleanerId,
      reservationId,
      estimateId: 1, 
      paymentId: 1,
      bank: bank, 
      depositor,
      accountNumber,
      settlementAmount: settlementAmount, 
      status: 'PENDING'
    };

    // 3. 저장
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