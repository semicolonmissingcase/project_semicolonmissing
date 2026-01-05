/**
 * @file auth.cleaner.middleware.js
 * @description 기사님 전용 JWT 인증 미들웨어
 */
import jwt from 'jsonwebtoken';
import db from '../../models/index.js';
import myError from '../../errors/customs/my.error.js';

const authCleanerMiddleware = async (req, res, next) => {
  try {
    // 1. 헤더에서 토큰 추출
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // myError 함수가 정의되어 있지 않다면 일반 에러를 던지거나 res.status로 처리하세요
      return res.status(401).json({ message: '인증 토큰이 없습니다.' });
    }

    const token = authHeader.split(' ')[1];

    // 2. 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');

    // 3. DB에서 기사님 정보 조회 (수정된 부분)
    // findByPk는 Primary Key(ID)로 데이터를 바로 찾는 가장 빠른 방법입니다.
    const cleaner = await db.Cleaner.findByPk(decoded.id);

    if (!cleaner) {
      return res.status(401).json({ message: '유효하지 않은 기사님 계정입니다.' });
    }

    // 4. req 객체에 기사님 정보 저장
    req.user = cleaner; 
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '토큰이 만료되었습니다.' });
    }
    // 토큰이 위조되었거나 잘못된 경우
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
    next(error);
  }
};

export default authCleanerMiddleware;