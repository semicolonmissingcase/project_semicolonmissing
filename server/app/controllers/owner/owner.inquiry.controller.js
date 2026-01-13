/**
 * @file app/controllers/owner/owner.inquiry.controller.js
 * @description 문의게시판 관련 컨트롤러
 * 260102 v1.0.0 ck init
 */

import { BAD_FILE_ERROR, BAD_REQUEST_ERROR, SUCCESS } from "../../../configs/responseCode.config.js";
import ownerInquiryService from "../../services/owner/owner.inquiry.service.js";
import { createBaseResponse } from "../../utils/createBaseResponse.util.js";
import myError from "../../errors/customs/my.error.js";

/**
 * 새로운 문의 생성(회원)
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function ownerCreateInquiry(req, res, next) {
  try {
    const { title, content, category } = req.body;

    // 유효성 검사
    if (!title || !content) {
      throw myError('제목은 필수입니다.', BAD_REQUEST_ERROR);
    }
    if (!content || content === '<p>&nbsp;</p>' || content.trim() === '') {
      throw myError('내용은 필수입니다.', BAD_REQUEST_ERROR);
    }
    if (!category || category === '카테고리 선택') {
      throw myError('카테고리를 선택해주세요.', BAD_REQUEST_ERROR);
    }

    let finalOwnerId = null;
    let finalCleanerId = null;

    // 회원인 경우
    if (req.user.role === 'OWNER') {
      finalOwnerId = req.user.id;
    } else if (req.user.role === 'CLEANER') {
      finalCleanerId = req.user.id;
    } else {
      throw myError('알 수 없는 사용자 역할입니다.', BAD_REQUEST_ERROR);
    }


    const inquiryPicture1File = req.files?.inquiryPicture1?.[0];
    const inquiryPicture2File = req.files?.inquiryPicture2?.[0];

    let inquiryPicture1 = null;
    let inquiryPicture2 = null;

    if (inquiryPicture1File) {
      inquiryPicture1 = `${process.env.APP_URL}${process.env.ACCESS_FILE_INQUIRY_IMAGE_PATH}/${inquiryPicture1File.filename}`;
    }
    if (inquiryPicture2File) {
      inquiryPicture2 = `${process.env.APP_URL}${process.env.ACCESS_FILE_INQUIRY_IMAGE_PATH}/${inquiryPicture2File.filename}`;
    }

    const newInquiry = await ownerInquiryService.createInquiry({
      ownerId: finalOwnerId,
      cleanerId: finalCleanerId,
      title,
      content,
      category,
      guestName: null,
      guestPassword: null,
      inquiryPicture1,
      inquiryPicture2,
    });

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

/**
 * 모든 문의 목록 조회
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function getAllInquiries(req, res, next) {
  try {
    const { page, pageSize } = req.query;

    const inquiries = await ownerInquiryService.getAllInquiries(page, pageSize);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, inquiries));
  } catch (error) {
    next(error);
  }
}

/**
 * CKEditor 내부 이미지 업로드 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function uploadEditorImage(req, res, next) {
  try {
    if (!req.file) {
      throw myError('업로드된 파일이 없습니다.', BAD_FILE_ERROR);
    }

    const fileUrl = `${process.env.APP_URL}/${process.env.FILE_EDITOR_IMAGE_PATH}/${req.file.filename}`;

    return res.status(SUCCESS.status).send({
      uploaded: true,
      url: fileUrl,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 문의 상세 조회 (모든 사용자 접근 가능, 본인 글만 조회)
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function getInquiryShow(req, res, next) {
  try {
    const { inquiryId } = req.params;
    const userId = req.user?.id || null;
    const userRole = req.user?.role || null;
    const password = req.query.password || null;

    if (!inquiryId) {
      throw myError('유효한 문의글 ID가 없습니다.', BAD_REQUEST);
    }

    const inquiry = await ownerInquiryService.getInquiryShow(inquiryId, userId, userRole, password);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, { inquiry }));
  } catch (error) {
    console.error("getInquiryShow 컨트롤러 에러 발생:", error);
    next(error);
  }
}

/**
 * 새로운 문의 생성(비회원)
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function guestCreateInquiry(req, res, next) {
  try {
    const { title, content, category, guestName, guestPassword } = req.body;

    // 유효성 검사
    if (!title || !content) {
      throw myError('제목은 필수입니다.', BAD_REQUEST_ERROR);
    }
    if (!content || content === '<p>&nbsp;</p>' || content.trim() === '') {
      throw myError('내용은 필수입니다.', BAD_REQUEST_ERROR);
    }
    if (!category || category === '카테고리 선택') {
      throw myError('카테고리를 선택해주세요.', BAD_REQUEST_ERROR);
    }
    if (!guestName || !guestName.trim()) {
      throw myError('비회원 이름(이메일)은 필수입니다.', BAD_REQUEST_ERROR);
    }

    const inquiryPicture1File = req.files?.inquiryPicture1?.[0];
    const inquiryPicture2File = req.files?.inquiryPicture2?.[0];
    let inquiryPicture1 = null;
    let inquiryPicture2 = null;

    if (inquiryPicture1File) {
      inquiryPicture1 = `${process.env.APP_URL}${process.env.ACCESS_FILE_INQUIRY_IMAGE_PATH}/${inquiryPicture1File.filename}`;
    }
    if (inquiryPicture2File) {
      inquiryPicture2 = `${process.env.APP_URL}${process.env.ACCESS_FILE_INQUIRY_IMAGE_PATH}/${inquiryPicture2File.filename}`;
    }

    // 서비스 호출
    const newInquiry = await ownerInquiryService.createInquiry({
      ownerId: null,
      cleanerId: null,
      title,
      content,
      category,
      guestName,
      guestPassword,
      inquiryPicture1,
      inquiryPicture2,
    });

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, newInquiry));
  } catch (error) {
    next(error);
  }
}

// -----------------------리뷰관련----------------------- 
/**
 * 점주 내 리뷰 목록 조회
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function getOwnerReviews(req, res, next) {
  try {
    const ownerId = req.user.id;

    const reviews = await ownerInquiryService.getOwnerReviews(ownerId);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, reviews));
  } catch (error) {
    next(error);
  }
}

/**
 * 리뷰 작성이 필요한 '완료'된 예약 목록 조회
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function getCompletedReservations(req, res, next) {
  try {
    const ownerId = req.user.id;
    const result = await ownerInquiryService.getCompletedReservationsForReview(ownerId);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    next(error);
  }
}

/**
 * 점주 내 쓴 리뷰 상세 조회
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function getReviewDetails(req, res, next) {
  try {
    const ownerId = req.user.id;
    const { reviewId } = req.params;

    const result = await ownerInquiryService.getReviewDetails(Number(reviewId), ownerId);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    next(error);
  }
}

/**
 * 점주 리뷰 쓰기
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function createReview(req, res, next) {
  try {
    const ownerId = req.user.id;
    const { cleanerId, reservationId, star, content } = req.body;

    // 이미지용
    const reviewPicture1 = req.files?.reviewPicture1?.[0]?.filename ? `${process.env.APP_URL}${process.env.ACCESS_FILE_REVIEW_IMAGE_PATH}/${req.files?.reviewPicture1?.[0]?.filename}` : null;
    const reviewPicture2 = req.files?.reviewPicture2?.[0]?.filename ? `${process.env.APP_URL}${process.env.ACCESS_FILE_REVIEW_IMAGE_PATH}/${req.files?.reviewPicture2?.[0]?.filename}` : null;
    console.log(reviewPicture1, reviewPicture2);
    const reviewBody = {
      cleanerId,
      reservationId,
      star,
      content,
      reviewPicture1,
      reviewPicture2,
    };
    const result = await ownerInquiryService.createReview(ownerId, reviewBody)

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    next(error);
  }
};

/**
 * 점주 리뷰 삭제
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
async function deleteReview(req, res, next) {
  try {
    const ownerId = req.user.id;
    const { reviewId } = req.params;

    await ownerInquiryService.deleteReviews(Number(reviewId), ownerId);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, null, '리뷰가 성공적으로 삭제되었습니다.'));
  } catch (error) {
    next(error);
  }
}

export default {
  ownerCreateInquiry,
  getOwnerInquiries,
  getOwnerInquiriesShow,
  getAllInquiries,
  getInquiryShow,
  uploadEditorImage,
  guestCreateInquiry,
  getOwnerReviews,
  getCompletedReservations,
  getReviewDetails,
  createReview,
  deleteReview,
}