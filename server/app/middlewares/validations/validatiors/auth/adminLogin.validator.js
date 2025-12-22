/**
 * @file app/middlewares/validations/validators/auth/adminLogin.validator.js
 * @description 로그인용 유효성 체크 
 * 251222 v1.0.0 yeon init 
 */

import adminField from "../../fields/admin.field.js";
export default [adminField.email, adminField.password];