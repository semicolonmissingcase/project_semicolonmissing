import axiosInstance from './axiosInstance.js';

const CLEANER_API_URL = '/api/cleaners';

// 대기 작업 목록 가져오기
export const getPendingJobs = () => 
  axiosInstance.get(`${CLEANER_API_URL}/mypage/pending`);

// 오늘 일정 목록 가져오기
export const getTodayJobs = () => 
  axiosInstance.get(`${CLEANER_API_URL}/mypage/today`);

// 기사님 문의 목록 가져오기
export const getCleanerInquiries = () => 
  axiosInstance.get(`${CLEANER_API_URL}/mypage/qna`);

// 본인에게 달린 리뷰 가져오기
export const getCleanerReviews = () =>
  axiosInstance.get(`${CLEANER_API_URL}/mypage/reviews`);