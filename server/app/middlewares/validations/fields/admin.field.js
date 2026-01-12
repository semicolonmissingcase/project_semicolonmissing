/**
 * @file app/middlewares/validations/fields/admin.field.js
 * @description 관리자 정보 유효성 검토 필드
 * 251222 v1.0.0 yeon init 
 */

import { body } from "express-validator";

const email = body('email')
  .trim()
  .notEmpty()
  .withMessage('이메일은 필수 항목입니다.')
  .bail()
  .isEmail()
  .withMessage('유효한 이메일을 입력해 주세요')
;

const password = body('password')
  .trim()
  .notEmpty()
  .withMessage('비밀번호는 필수 항목입니다.')
  .bail()
  .matches(/^[a-zA-Z0-9!@#$]{8,20}$/) // 정규식 활용
  .withMessage('영어대소문자·숫자·!·@·#·$, 8~20자 허용') 
;

export default {
  email,
  password,
};