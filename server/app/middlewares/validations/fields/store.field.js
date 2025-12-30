/**
 * @file app/middlewares/validations/fields/store.field.js
 * @description 매장 정보 유효성 검토 필드
 * 251224 v1.0.0 ck init 
 */

import { body, param } from "express-validator";

// 매장 PK
const id = param('storeId')
  .trim()
  .notEmpty()
  .withMessage('필수 항목입니다.')
  .bail()
  .isNumeric()
  .withMessage('숫자만 허용합니다.')
  .toInt()
;

const storeName = body('store.name')
  .optional({ checkFalsy: true }) // 이 필드는 선택 사항입니다.
  .trim()
  .notEmpty()
  .withMessage('매장 이름을 입력해주세요.')
  .bail()
  .isLength({ max: 50 })
  .withMessage('매장 이름은 50자를 초과할 수 없습니다.')
;

const storeAddr1 = body('store.addr1')
  .optional({ checkFalsy: true }) // 이 필드는 선택 사항입니다.
  .trim()
  .notEmpty()
  .withMessage('시/도 주소를 입력해주세요.')
  .bail()
  .isLength({ max: 20 })
  .withMessage('시/도 주소는 20자를 초과할 수 없습니다.')
;

const storeAddr2 = body('store.addr2')
  .optional({ checkFalsy: true }) // 이 필드는 선택 사항입니다.
  .trim()
  .notEmpty()
  .withMessage('상세 주소(군/구/읍/면/동)를 입력해주세요.')
  .bail()
  .isLength({ max: 40 })
  .withMessage('상세 주소는 40자를 초과할 수 없습니다.')
;

const storeAddr3 = body('store.addr3')
  .optional({ checkFalsy: true }) // 이 필드는 선택 사항입니다.
  .trim()
  .notEmpty()
  .withMessage('상세 주소를 입력해주세요.')
  .bail()
  .isLength({ max: 100 })
  .withMessage('상세 주소는 100자를 초과할 수 없습니다.')
;

const storePhoneNumber = body('store.phoneNumber')
  .optional({ checkFalsy: true }) // 빈 문자열도 optional로 처리
  .trim()
  .matches(/^\d{2,3}\d{3,4}\d{4}$/)
  .withMessage('유효한 전화번호 형식이 아닙니다. (예: 0212345678)')
;

export default {
  id,
  storeName,
  storeAddr1,
  storeAddr2,
  storeAddr3,
  storePhoneNumber,
}