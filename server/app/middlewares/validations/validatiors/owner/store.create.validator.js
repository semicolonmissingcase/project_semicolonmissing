/**
 * @file app/middlewares/validations/validators/owner/store.create.validator.js
 * @description 매장 생성 유효성 체크
 * 251229 v1.0.0 CK init
 */

import storeField from "../../fields/store.field.js";

const { storeName, storeAddr1, storeAddr2, storeAddr3, storePhoneNumber } = storeField

export default [
  storeName,
  storeAddr1,
  storeAddr2,
  storeAddr3,
  storePhoneNumber,
];