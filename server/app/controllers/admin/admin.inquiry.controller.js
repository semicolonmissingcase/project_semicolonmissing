/**
 * @file app/controllers/admin/admin.inquiry.controller.js
 * @description 관리자 문의 관리 Controller
 * 260112 v1.0.0 seon init
 */

import adminInquiryService from "../../services/admin/admin.inquiry.service.js";
import { SUCCESS } from "../../../configs/responseCode.config.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";

/**
 * 문의 목록 및 상단 통계 데이터 통합 조회
 */
async function getInquiryData(req, res, next) {
  try {
    const { page, limit, search } = req.query;
    const result = await adminInquiryService.getInquiryManagementData({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      search: search || ""
    });
    return res.status(SUCCESS.status).send(
      createBaseResponse(SUCCESS, result)
    );
    
  } catch (error) {
    console.error('getInquiryData Error:', error);
    next(error); // 에러 핸들러로 전달
  }
}
/**
 * 문의 상세 데이터 조회 (답변 팝업용)
 */
async function getInquiryDetail(req, res, next) {
  try {
    const { inquiryId } = req.params;
    const result = await adminInquiryService.getInquiryDetail(inquiryId);
    return res.status(SUCCESS.status).send(
      createBaseResponse(SUCCESS, result)
    );
  } catch (error) {
    console.error('getInquiryDetail Error:', error);
    next(error);
  }
}

/**
 * 문의 답변 등록 처리
 */
async function postInquiryReply(req, res, next) {
  try {
    const { inquiryId } = req.params; 
    const { content } = req.body;
    const adminId = req.admin?.id || 1; 
    const result = await adminInquiryService.saveInquiryAnswer(inquiryId, adminId, content);
    return res.status(SUCCESS.status).send(
      createBaseResponse(SUCCESS, result)
    );
  } catch (error) {
    console.error('postInquiryReply Error:', error);
    next(error);
  }
}

export default {
  getInquiryData,
  postInquiryReply,
  getInquiryDetail
};