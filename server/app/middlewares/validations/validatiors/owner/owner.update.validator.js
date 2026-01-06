/**
 * @file app/middlewares/validations/validators/owner/owner.update.validator.js
 * @description 점주 정보수정 유효성 체크
 * 251230 v1.0.0 CK init
 */

import ownerField from "../../fields/owner.field.js";

const { phone } = ownerField;

export default [
  phone, 
];