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
async function  getInquiryDetailsForOwner(inquiryId, ownerId) {
  const inquiry = await ownerInquiryRepository.findInquiryByIdAndOwnerId({ inquiryId, ownerId });
  
  if (!inquiries) {
    throw new Error('해당 문의를 찾을 수 없거나 접근 권한이 없습니다.');
  }

  return {
    id: inquiry.id,
    ownerId: inquiry.ownerId,
    title: inquiry.title,
    status: inquiry.status,
    createdAt: inquiry.createdAt,
    updateAt: inquiry.updateAt,
    answers: inquiry.answers ? inquiry.answers.map(answer => ({
      id: answer.id,
      adminId: answer.adminId,
      content: answer.content,
      createdAt: answer.createdAt,
    })) : [],
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

/**
 * 점주 내 리뷰 목록 조회
 */
async function getOwnerReviews(ownerId) {
  const reviews = await ownerInquiryRepository.findReviewsByOwnerId(ownerId);
  return reviews;
}

export default {
  createInquiry,
  getInquiriesByOwner,
  getInquiryDetailsForOwner,
  getAllInquiries,
  getOwnerReviews,
}