import axiosInstance from './axiosInstance.js';

const CLEANER_API_URL = '/api/cleaners';

// 대기 작업 목록 가져오기
export const getPendingJobs = () => 
  axiosInstance.get(`${CLEANER_API_URL}/mypage/pending`);

// 오늘 일정 목록 가져오기
export const getTodayJobs = () => 
  axiosInstance.get(`${CLEANER_API_URL}/mypage/today`);

// (추후 필요시) 작업 상세 정보 가져오기
export const getJobDetail = (reservationId) => 
  axiosInstance.get(`${CLEANER_API_URL}/reservations/${reservationId}`);