/**
 * @file app/middlewares/validations/validators/auth/ownerLogin.validator.js
 * @description 로그인용 유효성 체크 
 * 251222 v1.0.0 yeon init 
 */

import ownerField from "../../fields/owner.field.js";
export default [ownerField.email, ownerField.password];