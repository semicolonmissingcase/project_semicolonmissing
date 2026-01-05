import { SUCCESS } from "../../../configs/responseCode.config.js";
import adjustmentService from "../../services/cleaner/cleaner.adjustment.service.js";



/**
 * 정산 신청하기
 */
async function requestAdjustment(req, res, next) {
  try {
    const data = {
      // cleanerId: req.user.id, // 인증 미들웨어에서 넘어온 ID
      cleanerId: req.user ? req.user.id : 2,
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

/**
 *  계좌 정보 저장수정
 *  */

async function saveAccountInfo(req, res, next) {
  try {
    const data = {
      cleanerId: req.user ? req.user.id : 2, // 인증된 사용자 ID
      ...req.body // formData로 넘어온 bank, accountNumber, depositor 등
    };

    // 💡 저장 로직: 계좌 정보는 DB에 UPSERT (INSERT OR UPDATE) 방식으로 저장됩니다.
    // accountService를 사용하는 것이 더 명확하지만, 현재 구조에서는 adjustmentService를 재사용할 수도 있습니다.
    const result = await adjustmentService.saveAccount(data); 
    
    return res.status(result.status).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * 계좌 정보 조회 (GET /accountinfo)
 */
async function getAccountInfo(req, res, next) {
  try {
    const cleanerId = req.user ? req.user.id : 2; 

    // 💡 조회 로직
    const result = await adjustmentService.getAccount(cleanerId);
    
    return res.status(SUCCESS).json(result);
  } catch (err) {
    next(err);
  }
}

export default {
  requestAdjustment,
  getAdjustmentHistory,
  saveAccountInfo,
  getAccountInfo
};