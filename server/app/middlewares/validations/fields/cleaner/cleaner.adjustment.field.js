import { body } from "express-validator";

export const reservationId = body('reservationId')
  .notEmpty()
  .withMessage("정산할 예약 ID는 필수입니다.")
  .isInt()
  .withMessage("유효한 예약 ID 형식이 아닙니다.");

export const settlementAmount = body('settlementAmount')
  .notEmpty()
  .withMessage("정산 금액은 필수 항목입니다.")
  .isInt({ min: 1000 })
  .withMessage("정산 최소 금액은 1,000원 이상이어야 합니다.");

export const bank = body('bank')
  .trim()
  .notEmpty()
  .withMessage("은행명은 필수 항목입니다.");

export const accountNumber = body('accountNumber')
  .trim()
  .notEmpty()
  .withMessage("계좌번호는 필수 항목입니다.");

export default {
  reservationId,
  settlementAmount,
  bank,
  accountNumber
};