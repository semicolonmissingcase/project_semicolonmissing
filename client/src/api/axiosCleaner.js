import axiosInstance from './axiosInstance.js';

const CLEANER_API_URL = '/api/cleaners';

// 대기 작업 목록 가져오기
export const getPendingJobs = (config = {}) => 
  axiosInstance.get(`${CLEANER_API_URL}/mypage/pending`, config);

// 오늘 일정 목록 가져오기
export const getTodayJobs = (config = {}) => 
  axiosInstance.get(`${CLEANER_API_URL}/mypage/today`, config);

// 기사님 문의 목록 가져오기
export const getCleanerInquiries = (config = {}) => 
  axiosInstance.get(`${CLEANER_API_URL}/mypage/qna`, config);

// 본인에게 달린 리뷰 가져오기
export const getCleanerReviews = (config = {}) =>
  axiosInstance.get(`${CLEANER_API_URL}/mypage/reviews`, config);

// 정산 대기 목록 불러오기
export const getSettlementSummary = (config = {}) =>
  axiosInstance.get(`${CLEANER_API_URL}/mypage/settlement`, config);

// 계좌 목록 불러오기
export const getAccountThunk = (config = {}) =>
  axiosInstance.get(`${CLEANER_API_URL}/accountinfo`, config);

// 의뢰 상세 내역 조회 (상태값 상관없이 조회 가능)
export const getCleanerJobDetail = (id, config = {}) => 
  axiosInstance.get(`${CLEANER_API_URL}/mypage/job/${id}`, config);

// 작업 완료 처리 (상태 변경 및 정산 데이터 생성)
export const completeJob = (id, config = {}) => 
  axiosInstance.patch(`${CLEANER_API_URL}/mypage/job/${id}/complete`, {}, config);

// 지역 목록 불러오기
export const getLocationsThunk = (config = {}) =>
  axiosInstance.get(`${CLEANER_API_URL}/locations`, config);