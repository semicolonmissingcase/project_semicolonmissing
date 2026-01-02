import { CONFLICT_ERROR, SUCCESS } from "../../../configs/responseCode.config.js";
import myError from "../../errors/customs/my.error.js";
import { reservationId } from "../../middlewares/validations/fields/cleaner/cleaner.adjustment.field.js";
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

    const adjustmentData = {
      cleanerId,
      reservationId,
      estimateId: 1, 
      paymentId: 1,
      bank: bank, 
      depositor,
      accountNumber,
      settlementAmount: settlementAmount, 
      status: 'PENDING',
      depositor,
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

async function saveAccount(data) {
    await db.Adjustment.upsert({ 
        cleanerId: data.cleanerId,
        bank: data.bank,
        accountNumber: data.accountNumber,
        estimateId: 1,
        reservationId: 1,
        paymentId: 1,
        depositor: data.depositor,
        status: 'completed',
        settlementAmount : '25000'
    });

    return {
        code: '00',
        msg: 'NORMAL_CODE',
        info: '계좌 정보가 임시 테이블에 저장되었습니다.',
        status: 200
    };
}

async function getAccount(cleanerId) {
  // 💡 DB 처리: 해당 cleanerId의 계좌 정보를 DB에서 조회
  // 예: return db.CleanerAccount.findOne({ where: { cleanerId } });
}

export default {
  createRequest,
  getHistory,
  saveAccount,
  getAccount,
};