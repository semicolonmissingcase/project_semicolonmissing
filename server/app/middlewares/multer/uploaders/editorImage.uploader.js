/**
 * @file app/middlewares/multer/uploaders/editorImage.uploader.js
 * @description CKEditor 이미지 업로더
 * 260104 v1.0.0 ck init
 */

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dayjs from 'dayjs';
import { randomUUID } from 'crypto';
import myError from '../../../errors/customs/my.error.js';
import { BAD_FILE_ERROR } from '../../../../configs/responseCode.config.js';
import pathUtil from '../../../utils/path/path.util.js';

const editorImageStorage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadPath = pathUtil.getEditorImagePath();
    console.log(`[DEBUG][editorImageUploader] Destination Path: ${uploadPath}`);
    if (!fs.existsSync(uploadPath)) {
      console.log(`[DEBUG][editorImageUploader] Creating directory: ${uploadPath}`);
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${dayjs().format('YYYYMMDD')}_${randomUUID()}${ext}`;
    console.log(`[DEBUG][editorImageUploader] Generated filename: ${uniqueName}`);
    cb(null, uniqueName);
  },
});

const editorImageUploader = multer({
  storage: editorImageStorage,
  fileFilter(req, file, cb) {
    console.log(`[DEBUG][editorImageUploader] fileFilter 호출됨. file.mimetype: ${file.mimetype}`);
    if (!file.mimetype.startsWith('image/')) {
      return cb(myError('이미지 파일 형식만 업로드 가능합니다.', BAD_FILE_ERROR));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, //5mb
}).single('upload');

export default editorImageUploader;