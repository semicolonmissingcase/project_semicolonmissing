/**
 * @file app/middlewares/validations/validators/auth/cleanerLogin.validator.js
 * @description 로그인용 유효성 체크 
 * 251222 v1.0.0 yeon init 
 */

import cleanerField from "../../fields/cleaner.field.js";
export default [cleanerField.email, cleanerField.password];