/**
 * @file app/middlewares/validations/validators/owner/store.destroy.validator.js
 * @description 매장 삭제 유효성 체크
 * 251229 v1.0.0 CK init
 */

import storeField from "../../fields/store.field.js";

const { id } = storeField

export default [
  id
];