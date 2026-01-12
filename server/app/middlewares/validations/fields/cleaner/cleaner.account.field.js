import { body, param } from "express-validator";

  export const id = body('id')
    .trim()
    .notEmpty()
    .withMessage("필수 항목입니다.")

  export const cleanerId = body('cleanerId')
    .trim()
    .notEmpty()
    .withMessage("필수 항목입니다.")

  export const bankCode = body('bankCode')
    .trim()
    .notEmpty()
    .withMessage("필수 항목입니다.")

  export const depositor = body('depositor')
    .trim()
    .notEmpty()
    .withMessage("필수 항목입니다.")

  export const accountNumber = body('accountNumber')
    .trim()
    .notEmpty()
    .withMessage("필수 항목입니다.")

  export const isDefault = body('isDefault')
    .trim()
    .notEmpty()
    .withMessage("필수 항목입니다.")

    export default {
     id,
     cleanerId,
     bankCode,
     depositor,
     accountNumber,
     isDefault
    }
    