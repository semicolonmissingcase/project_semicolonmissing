/**
 * @file /app/middlewares/uploads/profileupload.middleware.js
 * @description 프로필 이미지 업로드 미들웨어
 * 251231 v1.0.0 ck init
 */

import path from 'path';
import { randomUUID } from 'crypto';
import multer from 'multer';
import fs from 'fs';
import dayjs from 'dayjs'
import myError from '../../errors/customs/my.error.js'
import { BAD_FILE_ERROR } from '../../../configs/responseCode.config.js';
import pathUtil from '../../utils/path/path.util.js';


/**
 * 프로필 이미지 업로드
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
export default function(req, res, next) {
  const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, callback) {
        // 이미지 경로
        const fullPath = pathUtil.getProfilesImagePath();

        // 해당 경로에 디렉토리가 없으면 생성
        if(!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, {recursive: true, mode: 0o755});
        }
        callback(null, fullPath);
      },
      filename(req, file, callback) {
        // 파일명 생성
        const uniqueFileName = `${dayjs().format('YYYYMMDD')}_${randomUUID()}`;
        const extension = path.extname(file.originalname).toLowerCase();

        callback(null, `${uniqueFileName}${extension}`);
      }
    }),
    fileFilter(req, file, callback) {
      // 파일 타입이 imgae가 아닐 경우 에러
      if (!file.mimetype.startsWith('image/')) {
        return callback(myError('이미지 파일 형식만 업로드 가능합니다.', BAD_FILE_ERROR));
      }
      callback(null, true);
    },
    limits: {
      fileSize: parseInt(process.env.FILE_USER_PROFILE_SIZE)
    }
  }).single('profile');

  // 예외처리
  upload(req, res, err => {
    if(err) {
      if(err instanceof multer.MulterError) {
        return next(myError(err.message, BAD_FILE_ERROR));
      }
      return next(err);
    }
    next();
  });
}