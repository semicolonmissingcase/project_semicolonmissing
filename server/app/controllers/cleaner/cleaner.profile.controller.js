import { createBaseResponse } from "../../utils/createBaseResponse.util.js";
import cleanerProfileService from "../../services/cleaner/cleaner.profile.service.js";
import { SUCCESS, UNAUTHORIZED_ERROR } from "../../../configs/responseCode.config.js";

/**
 * 기사님 정보 수정
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
async function updateInfo(req, res, next) {
  try {
    const { id, role } = req.user;
    const updateData = req.body;
    const files = req.files;

    if (!id || !role) {
      return res.status(UNAUTHORIZED_ERROR.status).send(createBaseResponse(UNAUTHORIZED_ERROR));
    }
    
    const updatedCleaner = await cleanerProfileService.updateCleaner(id, role, updateData, files);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, { user: updatedCleaner }));
  } catch (err) {
    next(err);
  }
};

/**
 * 기사님 비밀번호 수정
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
async function changePassword(req, res, next) {
  try {
    const { id } = req.user;
    const { currentPassword, newPassword } = req.body;

    // 유효성 걱ㅁ사
    if(!currentPassword || !newPassword) {
      return res.status(400).send(createBaseResponse({ code: 'BAD_REQUEST', info: '필수 정보가 누락되었습니다'}));
    }

    // 서비스에서 비밀번호 변경 요청
    await cleanerProfileService.changePassword(id, currentPassword, newPassword);

    // 성공
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS));
  } catch (error) {
    next(error);
  }
}

/**
 * 기사님 여러 정보 한번에 불러오기
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
async function getCleanerProfile(req, res, next) {
  try {
    const { id } = req.user;

    const cleanerProfile = await cleanerProfileService.getCleanerProfile(id);

    // 성공
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, { cleaner: cleanerProfile }));
  } catch (error) {
    next(error);
  }
}

export default { 
  updateInfo,
  changePassword,
  getCleanerProfile,
};