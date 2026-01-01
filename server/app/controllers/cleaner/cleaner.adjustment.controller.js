import { SUCCESS } from "../../../configs/responseCode.config.js";
import adjustmentService from "../../services/cleaner/adjustment.service.js";

/**
 * 정산 신청하기
 */
async function requestAdjustment(req, res, next) {
  try {
    const data = {
      cleanerId: req.user.id, // 인증 미들웨어에서 넘어온 ID
      ...req.body
    };
    const result = await adjustmentService.createRequest(data);
    return res.status(SUCCESS).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * 정산 내역 조회
 */
async function getAdjustmentHistory(req, res, next) {
  try {
    const cleanerId = req.user.id;
    const result = await adjustmentService.getHistory(cleanerId);
    return res.status(SUCCESS).json(result);
  } catch (err) {
    next(err);
  }
}

export default {
  requestAdjustment,
  getAdjustmentHistory
};