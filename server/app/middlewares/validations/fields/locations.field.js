import { body, param } from "express-validator";

export const cleanerId = body('cleanerId')
  .trim()
  .notEmpty()
  .withMessage('필수 항목입니다.');

export const locationId = body('locationId')
  .trim()
  .notEmpty()
  .withMessage('필수 항목입니다.')
  .bail()
  .custom((val) => {
    
  })