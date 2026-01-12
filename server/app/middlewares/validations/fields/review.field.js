/**
 * @file app/middlewares/validations/fields/review.field.js
 * @description 리뷰 정보 유효성 검토 필드
 * 260107 v1.0.0 ck init 
 */

import { body } from "express-validator";

// cleanerId 
const cleanerId = body('cleanerId')
  .notEmpty()
  .withMessage('기사님 ID는 필수입니다.')
;

const reservationId = body('reservationId')
  .notEmpty()
  .withMessage('예약 ID는 필수입니다.')
;

const star = body('star')
  .notEmpty()
  .withMessage('별점은 필수입니다.')
;

const content = body('content')
  .notEmpty()
  .withMessage('리뷰 내용은 필수입니다.')
  .isString()
  .withMessage('리뷰 내용은 문자열이어야 합니다.')
  .isLength({ min: 10, max: 500 })
  .withMessage('리뷰 내용은 10자 이상 500자 이하로 작성해주세요.');
;

export default {
  cleanerId,
  reservationId,
  star,
  content,
}