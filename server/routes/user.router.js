/**
 * @file routes/user.router.js
 * @description 회원가입 관련 라우터
 * 251223 v1.0.0 CK init
 */

import express from 'express';
import ownerUserController from "../app/controllers/owner/owner.user.controller.js";
import validationHandler from "../app/middlewares/validations/validationHandler.js";
import ownerUserValidators from '../app/middlewares/validations/validatiors/owner/owner.user.validators.js';
import db from '../app/models/index.js';
import bcrypt from 'bcrypt';
// import cleanerUserValidators from '../app/middlewares/validations/validatiors/cleaner/cleaner.user.validators.js';
// import cleanerUserController from "../app/controllers/cleaner/cleaner.user.controller.js";


const usersRouter = express.Router();

// 점주 회원가입
usersRouter.post('/owner', ownerUserValidators, validationHandler, ownerUserController.registerOwner);

// 여기에 기사님도 하면 될듯
usersRouter.post('/cleaner', async (req, res) => {
  // 1. 요청이 들어오는지 확인 (서버 터미널 확인용)
  console.log("===> 기사 가입 요청 수신:", req.body);

  try {
    const { name, gender, email, password, phone, locations } = req.body;

    // 2. DB 객체 확인
    if (!db.Cleaner || !db.Location || !db.DriverRegion) {
      throw new Error("DB 모델을 찾을 수 없습니다. (Cleaner, Location, DriverRegion 확인 필요)");
    }

    // 3. 기존 로직 실행
    const exists = await db.Cleaner.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: "이미 가입된 이메일입니다." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCleaner = await db.Cleaner.create({
      name,
      gender: gender === 'male' ? 'M' : 'F',
      email,
      password: hashedPassword,
      phoneNumber: phone,
      provider: 'LOCAL',
    });

    if (locations && locations.length > 0) {
      for (const locName of locations) {
        const [city, district] = locName.split(' ');
        const locationRecord = await db.Location.findOne({ where: { city, district } });

        if (locationRecord) {
          await db.DriverRegion.create({
            cleanerId: newCleaner.id,
            locationId: locationRecord.id
          });
        }
      }
    }

    return res.status(201).json({ success: true, message: "가입 완료" });

  } catch (error) {
  console.error("!!!! 서버 에러 발생 !!!!", error); // 서버 터미널에 다시 확인
  return res.status(500).json({ 
    message: "백엔드에서 에러가 났어요!", 
    debugMessage: error.message, // 이제 undefined가 아니라 에러 내용이 보일 겁니다.
    errorStack: error.stack 
  });
}
});

export default usersRouter;