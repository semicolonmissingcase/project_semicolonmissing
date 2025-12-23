/**
 * @file app/middlewares/validations/validators/owner/owner.store.validator.js
 * @description 회원가입용 유효성 체크
 * 251223 v1.0.0 CK init
 */

import userFields from "../../fields/user.field.js";

const { email, password, passwordChk, nick, profile } = userFields;

export default [email, password, passwordChk, nick, profile];