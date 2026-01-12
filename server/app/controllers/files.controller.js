/**
 * @file app/controllers/files.controller.js
 * @description 파일 업로드 관련 컨트롤러 (게시글, 프로필, 채팅 공용)
 * 260102 v1.1.0 seon init
 */

import { BAD_FILE_ERROR, SUCCESS } from "../../configs/responseCode.config.js";
import myError from "../errors/customs/my.error.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

// ----------------
// ---- public ----
// ----------------

/**
 * 게시글 이미지 업로드 컨트롤러
 */
async function storePost(req, res, next) {
  try {
    if(!req.file) {
      throw myError('파일 없음', BAD_FILE_ERROR);
    }

    const result = {
      path: `${process.env.APP_URL}/${process.env.FILE_POST_IMAGE_PATH}/${req.file.filename}`
    };

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch(error) {
    next(error);
  }
}

/**
 * 유저 프로필 업로드 컨트롤러
 */
async function storeProfile(req, res, next) {
  try {
    if(!req.file) {
      throw myError('파일 없음', BAD_FILE_ERROR);
    }

    const result = {
      path: `${process.env.APP_URL}/${process.env.FILE_USER_PROFILE_PATH}/${req.file.filename}`
    };

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch(error) {
    next(error);
  }
}

/**
 * 채팅 이미지 업로드 컨트롤러 (추가됨)
 * @description 채팅방 내 이미지 전송 및 의뢰서 사진 첨부 공용
 */
async function storeChat(req, res, next) {
  try {
    // 1. 파일 존재 여부 체크 (멀터 미들웨어에서 걸러지지만 한 번 더 확인)
    if(!req.file) {
      throw myError('파일이 전송되지 않았습니다.', BAD_FILE_ERROR);
    }

    // 2. 결과 주소 생성
    // .env에 ACCESS_FILE_CHAT_IMAGE_PATH 가 정의되어 있어야 합니다 (예: /files/chat)
    const result = {
      path: `${process.env.APP_URL}/${process.env.FILE_CHAT_IMAGE_PATH}/${req.file.filename}`
    };

    // 3. 공통 포맷으로 응답
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch(error) {
    // 에러 핸들러 미들웨어로 전달
    next(error);
  }
}

export default {
  storePost,
  storeProfile,
  storeChat,
}