/**
 * @file app/middlewares/multer/uploaders/reservationImage.uploader.js
 * @description 요청서 업로더
 * 260105 ck init
 */

import multer from 'multer';
import fs from 'fs';
import dayjs from 'dayjs';
import myError from '../../../errors/customs/my.error.js';
import { BAD_FILE_ERROR } from '../../../../configs/responseCode.config.js';
import pathUtil from '../../../utils/path/path.util.js';
import path from 'path';

const uploadDir = 'uploads/reservation_images';
const destination = path.join(process.cwd(), uploadDir);

if (!fs.existsSync(destination)) {
  fs.mkdirSync(destination, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, destination); },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const uniqueFileName = `${dayjs().format('YYYYMMDD')}_${randomUUID()}`;
    cb(null, `${uniqueFileName}${extname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) { cb(null, true); }
  else { cb(new Error('이미지 파일만 업로드할 수 있습니다.'), false); }
};

const reservationImageUploader = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
}).any();

export default reservationImageUploader;