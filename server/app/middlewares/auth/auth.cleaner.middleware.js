/**
 * @file auth.cleaner.middleware.js
 * @description 기사님 전용 JWT 인증 미들웨어
 */
import jwt from 'jsonwebtoken';
import db from '../../models/index.js';
import myError from '../../errors/customs/my.error.js';

const authCleanerMiddleware = async (req, res, next) => {
  try {
    // 1. 헤더에서 토큰 추출 (Bearer Token 방식)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw myError('인증 토큰이 없습니다.', 401);
    }

    const token = authHeader.split(' ')[1];

    // 2. 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');

    // 3. DB에서 기사님 정보 조회
    // 토큰의 payload에 들어있는 id가 기사님 ID인지 확인합니다.
    const cleaner = await db.Cleaner.findOne({
      where: { id: decoded.id, deletedAt: null }
    });

    if (!cleaner) {
      throw myError('유효하지 않은 기사님 계정입니다.', 401);
    }

    // 4. req 객체에 기사님 정보 저장 (이제 라우터에서 req.user.id 사용 가능)
    req.user = cleaner; 
    
    next();
  } catch (error) {
    // JWT 만료 등 에러 처리
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '토큰이 만료되었습니다.' });
    }
    next(error);
  }
};

export default authCleanerMiddleware;