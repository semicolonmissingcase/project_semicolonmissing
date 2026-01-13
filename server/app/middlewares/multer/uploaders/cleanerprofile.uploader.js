/**
 * @file app/middlewares/multer/uploaders/cleanerprofile.uploader.js
 * @description 기사 자격증, 프로필 이미지 업로더
 * 260109 ck init
 */

import multer from 'multer';
import fs from 'fs';
import dayjs from 'dayjs';
import myError from '../../../errors/customs/my.error.js';
import { BAD_FILE_ERROR } from '../../../../configs/responseCode.config.js';

/**
 * 클리너 프로필 이미지 및 자격증 업로더 처리 미들웨어
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
export default function (req, res, next) {
  // multer 객체 인스턴스
  const upload = multer({
    // storage: 파일을 저장할 위치를 상세하게 제어하는 프로퍼티
    storage: multer.diskStorage({
      // 파일 저장 경로 설정
      destination(req, file, callback) {
        let fullPath;

        if (file.fieldname === 'profileImage') {
          fullPath = pathUtil.getCleanerProfileImagePath();
        } else if (file.fieldname === 'certificateFiles') {
          fullPath = pathUtil.getCleanerCertificatesPath();
        }

        // 저장 디렉토리 설정
        if (!fs.existsSync(fullPath)) {
          // 해당 디렉토리 없으면 생성 처리
          fs.mkdirSync(
            fullPath,
            {
              recursive: true, // 중간 디렉토리까지 모두 생성
              mode: 0o755 // 권한 설정 rwxr-xr-x
            }
          );
        }

        callback(null, fullPath);
      },
      // 파일명 설정
      filename(req, file, callback) {
        // 저장할 파일명 생성
        const uniqueFileName = `${dayjs().format('YYYYMMDD')}_${crypto.randomUUID()}`;
        const fileNameParts = file.originalname.split('.');
        const ext = fileNameParts[fileNameParts.length - 1].toLowerCase();

        callback(null, `${uniqueFileName}.${ext}`);
      }
    }),
    // fileFilter: 파일 필터링 처리를 제어하는 프로퍼티
    fileFilter(req, file, callback) {
      if (!file.mimetype.startsWith('image/')) {
        return callback(myError('이미지 파일만 업로드 가능합니다.', BAD_FILE_ERROR));
      }
      callback(null, true);
    },
    // limits: 파일 사이즈 제한, 파일 개수 제한
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB
    }
  }).fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'certificateFiles', maxCount: 10 }
  ]);

  // 예외 처리
  upload(req, res, err => {
    if (err instanceof multer.MulterError || err) {
      next(myError(err.message, BAD_FILE_ERROR));
    }
    next();
  });
}