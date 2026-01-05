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
import jwt from 'jsonwebtoken';
import authCleanerMiddleware from '../app/middlewares/auth/auth.cleaner.middleware.js';
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

// 기사 로그인
usersRouter.post('/login/cleaner', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. 이메일로 기사 찾기
    const cleaner = await db.Cleaner.findOne({ where: { email } });
    if (!cleaner) {
      return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
    }

    // 2. 비밀번호 비교
    // bcrypt.compare(입력비밀번호, DB저장비밀번호)
    const isMatch = await bcrypt.compare(password, cleaner.password);
    if (!isMatch) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    // 3. 로그인 성공 시 처리 (JWT 토큰 예시)
    // 실제 서비스에서는 env 파일에 SECRET_KEY를 관리해야 합니다.
    const token = jwt.sign(
      { id: cleaner.id, email: cleaner.email, role: 'cleaner' },
      'your_jwt_secret_key', 
      { expiresIn: '1d' }
    );

    // 4. 비밀번호를 제외한 정보와 토큰 반환
    const result = cleaner.toJSON(); // 모델에서 이미 password 제거되도록 설정하셨으므로 안전합니다.

    return res.status(200).json({
      success: true,
      message: "로그인 성공",
      token,
      user: result
    });

  } catch (error) {
    console.error("로그인 에러:", error);
    return res.status(500).json({ message: "서버 오류", error: error.message });
  }
});

usersRouter.get('/cleaner/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "토큰이 없습니다." });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'your_jwt_secret_key'); // 로그인 때 쓴 시크릿 키와 동일해야 함

    const cleaner = await db.Cleaner.findByPk(decoded.id);
    if (!cleaner) return res.status(404).json({ message: "유저를 찾을 수 없습니다." });

    return res.status(200).json({ success: true, user: cleaner });
  } catch (error) {
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
});


usersRouter.get('/me', authCleanerMiddleware, async (req, res) => {
  try {
    // 미들웨어에서 성공하면 req.user에 이미 유저 정보를 담아두었습니다.
    // 그래서 DB를 다시 조회할 필요 없이 바로 사용하면 됩니다.
    const cleaner = req.user;

    return res.status(200).json({
      success: true,
      user: {
        id: cleaner.id,
        name: cleaner.name,
        email: cleaner.email,
        gender: cleaner.gender,
        phoneNumber: cleaner.phoneNumber,
        // 비밀번호(password)는 보안상 제외하고 보내는 것이 좋습니다.
      }
    });
  } catch (error) {
    console.error("getMe 에러:", error);
    return res.status(500).json({ message: "서버 오류 발생" });
  }
});

export default usersRouter;