import axiosInstance from "./axiosInstance.js";

const POST_API_URL = '/api/posts';

// 문의사항 작성(회원)
export const createInquiry = async (formData) => {
  const response = await axiosInstance.post(`${POST_API_URL}/inquiries`, formData);
  return response.data.data;
};

// 문의사항 생성(비회원)
export const createGuestInquiry = async (formData) => {
  const response = await axiosInstance.post(`${POST_API_URL}/inquiries/guest`, formData);
  return response.data.data;
};

// 특정 사용자의 문의 목록 조회(회원 본인)
export const getMyInquiry = async () => {
  const response = await axiosInstance.get(`${POST_API_URL}/owner/inquiries`);
  return response.data.data;
};

// 특정 문의 상세 조회(본인, 관리자)
export const getInquiryDetails = async (inquiryId) => {
  const response = await axiosInstance.get(`${POST_API_URL}/owner/inquiries/${inquiryId}`);
  return response.data.data;
};

// 문의에 대한 답변 생성(관리자전용)
export const createAnswer = async (inquiryId, answerData) => {
  const response = await axiosInstance.post(`${POST_API_URL}/inquiries/${inquiryId}/answers`, answerData);
  return response.data.data;
};

// 마이페이지 통계 정보 가져오기
export const getAllInquiries = async (page = 1, pageSize = 10) => {
  try {
    const response = await axiosInstance.get(`${POST_API_URL}/inquiries`, {params: { page, pageSize }});
    
    return response.data;
  } catch (error) {
    console.error("모든 문의 목록 조회 실패:", error);
    throw error;
  }
};

// ---------------------------
// 리뷰 관련
// ---------------------------
// 리뷰 조회
export const getOwnerReviews = async () => {
  try {
    const response = await axiosInstance.get(`${POST_API_URL}/owner/reviews`);
    return response.data.data;
  } catch (error) {
    console.error(`점주 리뷰 목록 조회 실패:`, error);
    throw error;
  }
};

// 리뷰 개별 조회
export const getReviewsDetails = async (reviewId) => {
  const response = await axiosInstance.get(`${POST_API_URL}/owner/reviews/${reviewId}`);
  return response.data;
};

// 리뷰 작성 전 목록 조회
export const getCompletedReservations = async () => {
  try {
    const response = await axiosInstance.get(`${POST_API_URL}/owner/reservations/completed`);
    return response.data;
  } catch (error) {
    console.error("완료된 예약 목록 조회 실패:", error);
    throw error;
  }
}

// 리뷰 생성
export const createReview = async (formData) => {
  try {
    const response = await axiosInstance.post(`${POST_API_URL}/owner/reviews`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 리뷰 삭제
export const deleteReview = async (reviewId) => {
  try {
    const response = await axiosInstance.delete(`${POST_API_URL}/owner/reviews/${reviewId}`)
    return response.data;
  } catch (error) {
    console.error(`리뷰(${reviewId}) 삭제 실패:`, error);
    throw error;
  }
};