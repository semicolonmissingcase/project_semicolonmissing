import { body } from "express-validator";

export const reservationId = body('reservationId')
  .notEmpty().withMessage("예약 ID는 필수입니다.")
  .isInt().withMessage("유효한 숫자 형식이어야 합니다.");

export const answers = body('answers')
  .isArray({ min: 1 }).withMessage("최소 하나 이상의 답변이 필요합니다.");

// 옵션은 선택 사항이므로 유효성 검사에서 에러를 내지 않도록 설정
export const questionId = body('answers.*.questionId').optional({ nullable: true });
export const questionOptionId = body('answers.*.questionOptionId').optional({ nullable: true });
export const answerText = body('answers.*.answerText').optional({ nullable: true });

export default {
  reservationId,
  answers,
  questionId,
  questionOptionId,
  answerText
};