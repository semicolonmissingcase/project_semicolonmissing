/**
 * @file app/middlewares/validations/validators/owner/review.create.validator.js
 * @description 리뷰 작성 유효성 체크 
 * 260107 v1.0.0 ck init 
 */

import reviewField from "../../fields/review.field.js";

const { cleanerId, reservationId, star, content } = reviewField;

export default [
  cleanerId, 
  reservationId, 
  star, 
  content
];