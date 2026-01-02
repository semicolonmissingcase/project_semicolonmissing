import axiosInstance from "./axiosInstance.js";

const OWNER_API_URL = '/api/owners';

// 마이페이지 통계
export const getOwnerStats = async () => {
  const response = await axiosInstance.get(`${OWNER_API_URL}/mypage/stats`);
  return response.data.data;
};

// 견적 요청서
export const getOwnerReservations = async () => {
  const response = await axiosInstance.get(`${OWNER_API_URL}/reservations`);
  return response.data.data;
};

// 요청서별로 견적서
export const getEstimatesByReservationId = async (reservationId) => {
  const response = await axiosInstance.get(`/api/reservations/${reservationId}/estimates`);
  return response.data.data;
};

// 좋아요
export const toggleCleanerFavorite = async (cleanerId) => {
  const response = await axiosInstance.post(`${OWNER_API_URL}/cleaners/${cleanerId}/like`);
  return response.data.data;
};