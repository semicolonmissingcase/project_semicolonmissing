/**
 * @file app/middlewares/validations/validators/owner/owner.user.validator.js
 * @description 회원가입용 유효성 체크
 * 251223 v1.0.0 CK init
 */

import ownerField from "../../fields/owner.field.js";
import storeField from "../../fields/store.field.js";

const { email, password, passwordChk, name, gender, phone } = ownerField;
const { storeName, storeAddr1, storeAddr2, storeAddr3, storePhoneNumber } = storeField

export default [
  email, 
  password, 
  passwordChk, 
  name, 
  gender, 
  phone, 
  storeName, 
  storeAddr1, 
  storeAddr2, 
  storeAddr3, 
  storePhoneNumber
];