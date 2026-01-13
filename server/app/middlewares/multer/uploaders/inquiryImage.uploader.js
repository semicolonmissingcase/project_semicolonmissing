/**
 * @file app/middlewares/multer/uploaders/inquiryImage.uploader.js
 * @description 이미지 업로드용
 * 260104 v1.0.0 ck init
 */

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dayjs from 'dayjs';
import { randomUUID } from 'crypto';
import myError from '../../../errors/customs/my.error.js';
import { BAD_FILE_ERROR } from '../../../../configs/responseCode.config.js';

const inquiryImageStorage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadPath = process.env.FILE_INQUIRY_IMAGE_PATH;
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${dayjs().format('YYYYMMDD')}_${randomUUID()}${ext}`;
    cb(null, `${uniqueName}${ext}`);
  },
});

// 문의글 이미지 업로드
const inquiryImageUploader = multer({
  storage: inquiryImageStorage,
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(myError('이미지 파일 형식만 업로드 가능합니다.', BAD_FILE_ERROR));
    }
    cb(null, true);
  },
  limits: Number(process.env.FILE_INQUIRY_IMAGE_SIZE), // 5mb
}).fields([
  { name: 'inquiryPicture1', maxCount: 1 },
  { name: 'inquiryPicture2', maxCount: 1 }
]);

export default inquiryImageUploader;