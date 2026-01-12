/**
 * @file app/middlewares/validations/validators/cleaner/cleaner.quotations.validator.js
 * @description 신규 요청서 요청 수락 유효성 체크
 * 260107 v1.0.0 yh init
 */

import cleanerField from "../../fields/cleaner.field.js";

const quotationsStore = [cleanerField.reservationId, cleanerField.estimatedAmount, cleanerField.description];


export default {
  quotationsStore,
}