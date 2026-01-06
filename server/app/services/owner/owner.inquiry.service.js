/**
 * @file app/services/owner/owner.inquiry.service.js
 * @description 문의글 Service
 * 260102 CK init
 */

import ownerInquiryRepository from "../../repositories/owner/owner.inquiry.repository.js";

/**
 * 문의 생성
 * @param {number} ownerId 
 * @param {string} title 
 * @param {string} content 
 * @returns 
 */
async function createInquiry(inquiryData) {
  const finalInquiryData = { ...inquiryData, status: '대기중' };

  console.log("--- [DEBUG] 서비스에서 레포지토리로 전달될 finalInquiryData:", finalInquiryData);
  const newInquiry = await ownerInquiryRepository.createInquiry(finalInquiryData);
  return newInquiry;
}

/**
 * 특정 점주가 작성한 모든 문의 목록 조회
 * @param {number} ownerId 
 * @returns 
 */
async function getInquiriesByOwner(ownerId) {
  const inquiries = await ownerInquiryRepository.findInquiriesByOwnerId(ownerId);
  
  if (!inquiries) {
    throw new Error('문의 목록을 찾을 수 없습니다.');
  }

  return inquiries.map(inquiry => ({
    id: inquiry.id,
    ownerId: inquiry.ownerId,
    title: inquiry.title,
    content: inquiry.content,
    status: inquiry.status,
    createdAt: inquiry.createdAt,
  }));
}

/**
 * 특정 점주가 작성한 문의 중, 특정 문의 ID를 가진 문의의 상세 정보 조회
 * @param {number}} inquiryId 
 * @param {number} ownerId 
 * @returns 
 */
async function getInquiryDetailsForOwner(inquiryId, ownerId) {
  // Repository에서 단일 객체를 가져오도록 수정 권장
  const inquiry = await ownerInquiryRepository.findInquiryByIdAndOwnerId({ inquiryId, ownerId });
  
  // 오타 수정: inquiries -> inquiry
  if (!inquiry || inquiry.length === 0) {
    throw new Error('해당 문의를 찾을 수 없거나 접근 권한이 없습니다.');
  }

  // findAll을 썼으므로 배열의 첫 번째 요소를 사용 (Repository를 findOne으로 바꾸면 더 좋음)
  const target = Array.isArray(inquiry) ? inquiry[0] : inquiry;

  return {
    id: target.id,
    ownerId: target.ownerId,
    title: target.title,
    content: target.content, // 내용 추가 필요
    status: target.status,
    createdAt: target.createdAt,
    answers: target.answers || []
  };
}

/**
 * 모든 문의 목록 조회
 */
async function getAllInquiries(page = 1, pageSize = 10) {
  const limit = parseInt(pageSize);
  const offset = (parseInt(page) - 1) * limit;

  const { count, rows } = await ownerInquiryRepository.findAllInquiries(limit, offset);
  
  return { count, rows };
}

// -----------------------리뷰관련----------------------- 
/**
 * 점주 내 리뷰 목록 조회
 */
async function getOwnerReviews(ownerId) {
  const reviews = await ownerInquiryRepository.findReviewsByOwnerId(ownerId);
  return reviews;
}

/**
 * 점주 내 리뷰 상세 조회
 * @param {number} reviewId 
 * @param {number} ownerId 
 * @returns 
 */
async function getReviewDetails(reviewId, ownerId) {
  const review = await ownerInquiryRepository.findReviewByIdAndOwnerId(reviewId, ownerId);

  if (!review) {
    throw new Error('해당 리뷰를 찾을 수 없거나 접근 권한이 없습니다.');
  }

  return {
    id: review.id,
    cleanerId: review.cleaner?.id,
    cleanerName: review.cleaner?.name,
    cleanerProfile: review.cleaner?.profile,
    reservationDate: review.reservationData?.date,
    reservationTime: review.reservationData?.time,
    storeName: review.reservationData?.store?.name,
    price: review.price,
    star: review.star,
    content: review.content,
    reviewPicture1: review.reviewPicture1,
    reviewPicture2: review.reviewPicture2,
    createdAt: review.createdAt,
  };
}

export default {
  createInquiry,
  getInquiriesByOwner,
  getInquiryDetailsForOwner,
  getAllInquiries,
  getOwnerReviews,
  getReviewDetails,
}