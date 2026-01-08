import { body } from "express-validator";

export const cleanerId = body('cleanerId')
  .trim()
  .notEmpty()
  .withMessage('필수 항목입니다.');

export const locationId = body('locationId')
  .trim()
  .notEmpty()
  .withMessage('지역 ID (locationId)는 필수 항목입니다.')
  .bail()
  .withMessage('locationId는 유효한 숫자여야 합니다.')
  .bail()
  .custom(async (id) => {

    const location = await db.Location.findOne({
      where: { id: id }
    });

    if (!location) {
      return Promise.reject('해당 ID의 활동 지역이 존재하지 않습니다.');
    }
  });
