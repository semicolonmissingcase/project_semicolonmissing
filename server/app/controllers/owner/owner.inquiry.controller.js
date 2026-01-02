/**
 * @file app/controllers/owner/owner.inquiry.controller.js
 * @description 문의게시판 관련 컨트롤러
 * 260102 v1.0.0 ck init
 */

import { SUCCESS } from "../../../configs/responseCode.config.js";
import ownerInquiryService from "../../services/owner/owner.inquiry.service.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";

/**
 * 점주 새로운 문의 생성
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function ownerCreateInquiry(req, res, next) {
  try {
    const ownerId = req.user.id;
    const { title, content } = req.body;

    if(!title || !content) {
      throw new Error('제목과 내용은 필수입니다.');
    }

    const newInquiry = await ownerInquiryService.createInquiry(ownerId, title, content);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, newInquiry));
  } catch (error) {
    next(error);
  }
}

/**
 * 점주 내 문의 내역 조회
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function getOwnerInquiries(req, res, next) {
  try {
    const ownerId = req.user.id;

    const inquiries = await ownerInquiryService.getInquiriesByOwner(ownerId);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, inquiries));
  } catch (error) {
    next(error);
  }
}

/**
 * 점주 내 문의 상세 조회
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function getOwnerInquiriesShow(req, res, next) {
  try {
    const ownerId = req.user.id;
    const { inquiryId } = req.params;

    const inquiryDetails = await ownerInquiryService.getInquiryDetailsForOwner(Number(inquiryId), ownerId);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, inquiryDetails));
  } catch (error) {
    next(error);
  }
}

export default {
  ownerCreateInquiry,
  getOwnerInquiries,
  getOwnerInquiriesShow,
}