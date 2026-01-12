/**
 * @file app/services/admin/admin.inquiry.service.js
 * @description 관리자 문의 관리 비즈니스 로직 Service
 * 260112 v1.0.0 seon init
 */
import adminInquiryRepository from "../../repositories/admin/admin.inquiry.repository.js";

/**
 * 문의 관리 메인 데이터 조회 (목록 + 상단 통계)
 * @param {Object} params { page, limit, search }
 * @returns {Promise<Object>} 프론트엔드 전달용 통합 객체
 */
async function getInquiryManagementData({ page, limit, search }) {
  const offset = (page - 1) * limit;

  const [listResult, statistics] = await Promise.all([
    adminInquiryRepository.findInquiryList({ limit, offset, search }),
    adminInquiryRepository.findInquiryStats()
  ]);

  return {
    total: listResult.count,        // 총 게시글 수
    currentPage: page,             // 현재 페이지
    inquiries: listResult.inquiries, // 문의 목록 배열
    statistics: statistics          // 통계 데이터 (오늘, 답변완료, 대기중)
  };
}
/**
 * 문의 상세 데이터 조회 (답변 팝업용)
 * @param {number|string} inquiryId 문의 PK
 * @returns {Promise<Object>} 문의 상세 정보 객체
 */
async function getInquiryDetail(inquiryId) {
  const inquiry = await adminInquiryRepository.findInquiryById(inquiryId);
  if (!inquiry) {
    const error = new Error("해당 문의를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  return inquiry;
}

/**
 * 문의 답변 저장 로직
 * @param {Object} replyData { inquiryId, adminId, content }
 */
async function saveInquiryAnswer(inquiryId, adminId, content) {
  return await adminInquiryRepository.createAnswerAndUpdateStatus({ 
    inquiryId, 
    adminId, 
    content 
  });
}

export default {
  getInquiryManagementData,
  saveInquiryAnswer,
  getInquiryDetail
};