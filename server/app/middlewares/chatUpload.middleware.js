/**
 * @file app/middlewares/chatUpload.middleware.js
 * @description 채팅 이미지 전송을 위한 Multer 미들웨어
 * 251223 v1.0.0 seon init
 */
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 1. 저장 폴더 존재 확인 및 생성
const uploadDir = 'uploads/chat';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. 저장소 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // 파일이 저장될 경로
  },
  filename: (req, file, cb) => {
    // 파일명 중복 방지를 위해 [타임스탬프-랜덤숫자.확장자] 형태로 저장
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `CHAT-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// 3. 파일 필터링 (이미지만 허용)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('이미지 파일(jpg, png, gif, webp)만 업로드 가능합니다!'), false);
  }
};

// 4. 멀터 설정 및 용량 제한 (예: 5MB)
const chatUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

export default chatUpload;