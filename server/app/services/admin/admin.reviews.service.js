/**
 * @file app/services/admin/admin.reviews.service.js
 * @description 관리자 reviews service
 * 260113 v1.0.0 jae init
 */

import adminReviewsRepositorie from '../../repositories/admin/admin.reviews.repositorie.js';
import dayjs from 'dayjs';

/**
 * 테이블용 리뷰 리스트 조회
 */
async function getReviewList({ limit, offset }) {
  const { rows, count } = await adminReviewsRepositorie.findReviews(null, {
    limit,
    offset
  });

  return {
    total: count,
    reviews: rows.map(item => ({
      id: item.id,
      ownerName: item.dataValues?.ownerName || '알 수 없음', // 작성자 (서브쿼리 결과)
      createdAt: item.createdAt,                          // 작성날짜
      star: item.star,                                    // 별점
      cleanerName: item.dataValues?.cleanerName || '미지정'  // 대상 기사님 (서브쿼리 결과)
    }))
  };
}

/**
 * 상단 통계용 데이터 집계 (오늘 기준)
 */
async function getStatistics() {
  // 시안 이미지의 기준에 맞춰 '오늘' 날짜와 '삭제 리뷰' 등을 집계합니다.
  const stats = await adminReviewsRepositorie.getReviewStatistics(null);

  return {
    todayWorkCnt: stats.todayWorkCnt,     // 오늘 작업 수
    newReviewCnt: stats.newReviewCnt,     // 새 리뷰 (오늘 작성)
    deletedReviewCnt: stats.deletedReviewCnt // 삭제 리뷰 (누적 또는 특정 기간)
  };
}

export default {
  getReviewList,
  getStatistics,
};