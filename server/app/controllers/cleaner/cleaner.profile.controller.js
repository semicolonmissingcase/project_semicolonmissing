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
    const { id, role } = req.user.id;
    const updateData = req.body;

    if (!id || !role) {
      return res.status(UNAUTHORIZED_ERROR.status)
        .send(createBaseResponse(null, false, "인증 정보가 없습니다.", UNAUTHORIZED_ERROR));
    }
    
    const updatedCleaner = await cleanerProfileService.updateCleaner(id, role, updateData);

    return res.status(SUCCESS.status)
      .send(createBaseResponse({ user: updatedCleaner }, true, "기사 정보가 성공적으로 업데이트되었습니다.", SUCCESS));
  } catch (err) {
    next(err);
  }
};

export default { 
  updateInfo,
};