/**
 * @file app/services/owner/owner.inquiry.service.js
 * @description 문의글 Service
 * 260102 CK init
 */

import ownerInquiryRepository from "../../repositories/owner/owner.inquiry.repository.js";
import dayjs from "dayjs";

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
 * 리뷰 작성이 필요한 '완료'된 예약 목록 조회
 */
async function getCompletedReservationsForReview(ownerId) {
  const reservations = await ownerInquiryRepository.findCompletedReservations(ownerId);

  return reservations.map(reservation => {
    const plainReservation = reservation.get({ plain: true });
    const price = plainReservation.estimate?.estimatedAmount
        ? plainReservation.estimate.estimatedAmount.toLocaleString() : '정보없음';

    return {
      id: plainReservation.id, // 예약id
      reservationId: plainReservation.id,
      cleanerId: plainReservation.cleaner?.id,
      name: plainReservation.cleaner?.name || '기사님 정보 없음',
      cleanerProfile: plainReservation.cleaner?.profile || '/icons/default-profile.png',
      time: `${dayjs(plainReservation.date).format('YYYY-MM-DD')} ${plainReservation.time}`,
      store: plainReservation.store?.name || '매장 정보 없음',
      price: price,
      status: 'completed',
    }
  });
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
  return review;
}

/**
 * 점주 리뷰 생성
 * @param {number} ownerId 
 * @param {object} reviewBody
 * @returns 
 */
async function createReview(ownerId, reviewBody) {
  if(!ownerId) {
    throw new Error('점주 ID가 필요합니다.');
  }
  if(!reviewBody.cleanerId || !reviewBody.reservationId || !reviewBody.star || !reviewBody.content) {
    throw new Error('필수 리뷰 정보가 누락되었습니다.');
  }
  if (reviewBody.star < 1 || reviewBody.star > 5) {
    throw new Error('별점은 1점에서 5점 사이여야 합니다.');
  }

  const dataCreate = {
    ownerId: ownerId,
    cleanerId: reviewBody.cleanerId,
    reservationId: reviewBody.reservationId,
    star: reviewBody.star,
    content: reviewBody.content,
    reviewPicture1: reviewBody.reviewPicture1 || null, // TODO: 오타 수정해놓기(현재 모델에 맞춰 오타냄)
    reviewPicture2: reviewBody.reviewPicture2 || null,
  };

  const newReview = await ownerInquiryRepository.createReview(dataCreate);
  return newReview;
}


export default {
  createInquiry,
  getInquiriesByOwner,
  getInquiryDetailsForOwner,
  getAllInquiries,
  getOwnerReviews,
  getCompletedReservationsForReview,
  getReviewDetails,
  createReview,
}