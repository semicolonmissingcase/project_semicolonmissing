import multer from "multer";
import path from "path";
import fs from "fs";

// 업로드 폴더가 없으면 생성 (서버 실행 시 자동 확인)
const uploadDir = "uploads/profiles";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // 파일이 저장될 경로
  },
  filename: (req, file, cb) => {
    // 파일명 중복을 방지하기 위해 타임스탬프 추가
    const ext = path.extname(file.originalname);
    cb(null, `profile-${Date.now()}${ext}`);
  },
});

// 이미지 파일만 허용하는 필터 (선택 사항)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("jpg, jpeg, png 파일만 업로드 가능합니다."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기 제한 (5MB)
});

export default upload;