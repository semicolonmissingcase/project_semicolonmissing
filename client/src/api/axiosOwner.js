import axiosInstance from "./axiosInstance.js";

const OWNER_API_URL = '/api/owners';

// 마이페이지 통계
export const getOwnerStats = async () => {
  const response = await axiosInstance.get(`${OWNER_API_URL}/mypage/stats`);
  return response.data.data;
};

// 요청서 질문 조회
export const getQuestions = async () => {
  try {
    const response = await axiosInstance.get(`${OWNER_API_URL}/questionslist`);
    return response.data.data;
  } catch (error) {
    console.error(`질문 목록 조회 실패:`, error);
    throw error;
  }
}

// 견적 요청서 작성
export const createReservation = async (reservationData) => {
  try {
    const response = await axiosInstance.post(`${OWNER_API_URL}/quotations`, reservationData, {
       headers: {
        'Content-Type': 'multipart/form-data',
       }
    });
    return response.data.data;  
  } catch (error) {
    console.error('견적 요청서 생성 실패:', error);
    throw error;
  }
};

// 견적 요청서 조회
export const getOwnerReservations = async () => {
  const response = await axiosInstance.get(`${OWNER_API_URL}/reservations`);
  return response.data.data;
};

// 요청서별로 견적서
export const getEstimatesByReservationId = async (reservationId) => {
  const response = await axiosInstance.get(`/api/reservations/${reservationId}/estimates`);
  return response.data.data;
};

// 내 예약목록
export const getAcceptedEstimatesByOwnerId = async (reservationId) => {
  try {
    const response = await axiosInstance.get(`/api/reservations/estimates/accepted`);
    return response.data.data;
  } catch (error) {
    console.error(`특정 예약(${reservationId})에 대한 수락된 견적 목록 조회 실패:`, error);
    throw error;
  }
};

// 좋아요 선택
export const toggleCleanerFavorite = async (cleanerId) => {
  try {
    const response = await axiosInstance.post(`${OWNER_API_URL}/cleaners/${cleanerId}/like`);
    console.log("[DEBUG] toggleCleanerFavorite API 응답 객체:", response);
    console.log("[DEBUG] toggleCleanerFavorite API 응답 데이터:", response.data);
    console.log("[DEBUG] toggleCleanerFavorite API 실제 데이터:", response.data.data);
 
    if (response && response.data && response.data.data !== undefined) {
      return response.data.data;
    } else {
      console.error("[DEBUG][axiosOwner] toggleCleanerFavorite - 예상치 못한 응답 형식:", response);
      throw new Error("서버에서 예상치 못한 좋아요 상태 응답을 받았습니다.");
    } 
  } catch (error) {
    console.error('[DEBUG][axiosOwner] toggleCleanerFavorite - API 호출 중 에러 발생:', error.response?.data || error.message);
    throw error;
  }
};

// 좋아요 조회
export const getLikedCleaners = async () => {
  try {
    const response = await axiosInstance.get(`${OWNER_API_URL}/mypage/favorite-cleaners`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching liked cleaners:', error);
     throw error;
  }
};

// 예약 취소
export const cancelReservation = async (estimateId) => {
  try {
    const response = await axiosInstance.patch(`/api/reservations/estimates/${estimateId}/cancel`);
    return response.data;
  } catch (error) {
    console.error(`예약(${estimateId}) 취소 실패:`, error);
    throw error;
  }
};
