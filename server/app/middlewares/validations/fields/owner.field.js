/**
 * @file app/middlewares/validations/fields/owner.field.js
 * @description 점주 정보 유효성 검토 필드
 * 251222 v1.0.0 yeon init 
 */

import { body, param } from "express-validator";
import PROVIDER from "../../auth/configs/provider.enum.js";

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

// 회원가입용으로 추가
const passwordChk = body('passwordChk')
  .trim()
  .custom((val, {req}) => {
    if(val !== req.body.password) {
      return false;
    }
    return true;
  })
  .withMessage('비밀번호와 비밀번호 체크가 다릅니다.')
;

const name = body('name')
  .trim()
  .notEmpty()
  .withMessage('이름은 필수 항목입니다.')
  .bail()
;

const gender = body('gender')
  .trim()
  .notEmpty()
  .withMessage('성별은 필수 항목입니다.')
;

const phone = body('phone')
  .trim()
  .notEmpty()
  .withMessage('휴대폰 번호는 필수 항목입니다.')
  .bail()
  .matches(/^\d{3}-\d{3,4}-\d{4}$/)
  .withMessage('유효한 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)')
;

const provider = param('provider')
  .trim()
  .notEmpty()
  .withMessage('필수 항목입니다.')
  .bail()
  .custom(val => {
    return PROVIDER[val.toUpperCase()] ? true : false;
  })
  .withMessage('허용하지 않는 값입니다.')
;

export default {
  email,
  password,
  passwordChk,
  name,
  gender,
  phone,
  provider
};