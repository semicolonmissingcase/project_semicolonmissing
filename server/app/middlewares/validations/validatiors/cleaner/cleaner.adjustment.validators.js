
import { reservationId, settlementAmount, bank, accountNumber } from '../../fields/cleaner/cleaner.adjustment.field.js';

// 1. 정산 요청 시 유효성 검사
export const requestAdjustmentValidator = [
  reservationId,
  settlementAmount, 
  bank, 
  accountNumber
];

//   2. 계좌 정보 저장/수정 시 유효성 검사 (POST /accountinfo) 추가
export const saveAccountValidator = [
  // 계좌 정보를 저장/수정하는 데 필요한 필드만 포함
  bank,
  accountNumber
];


export default {
  requestAdjustmentValidator,
  saveAccountValidator //  
};