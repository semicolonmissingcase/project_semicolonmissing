import React, { useEffect, useState } from 'react';
import './MyReviews.css';
import { getOwnerReviews } from '../../../api/axiosPost.js';
import FavoriteButton from '../../commons/FavoriteBtn.jsx';

// 내 리뷰
export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 서버에서 리뷰 데이터 가져오기
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getOwnerReviews(); // API 헬퍼 호출
        setReviews(data); // 데이터 설정
      } catch (err) {
        console.error("리뷰 목록 불러오기 실패:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []); // 컴포넌트 마운트 시 한 번만 호출

  // 로딩 중일 때
  if (loading) {
    return <div className="myreviews-tab-container"><p>리뷰 목록을 불러오는 중...</p></div>;
  }

  // 에러 발생 시
  if (error) {
    return <div className="myreviews-tab-container"><p>리뷰 목록을 불러오는데 오류가 발생했습니다: {error.message}</p></div>;
  }

  // 리뷰 목록이 없을 때
  if (!reviews || reviews.length === 0) {
    return (
      <div className="myreviews-tab-container">
        <p className="myreviews-no-items">아직 작성된 리뷰가 없습니다.</p>
      </div>
    );
  }

  // 카드 디자인
  const renderReviewCard = (item) => (
    <div key={item.id} className="myreviews-status-card">
      <div className="myreviews-not-btn">
        <div className="myreviews-avatar-circle">
          <img
            src={item.cleanerProfile ? item.cleanerProfile : "/icons/default-profile.png"}
            alt={`${item.name} 기사님`}
            className="myreviews-avatar-img"
          />
        </div>

        <div className="myreviews-text-content">
          <h4 className="myreviews-driver-name">
            {item.name} <span className="myreviews-heart-icon">
              <FavoriteButton cleanerId={item.cleanerId} initialIsFavorited={item.heart} />
            </span>
          </h4>
          <p className="myreviews-sub-info">{item.time}</p>
          <p className="myreviews-sub-info">{item.store}</p>
          <p className="myreviews-price-info">견적 금액 {item.price}</p>
        </div>
      </div>

      {/* 버튼 영역 수정 */}
      <div className="myreviews-button-group">
        {item.status === 'completed' ? (
          <button className="myreviews-action-btn myreviews-write">리뷰쓰기</button>
        ) : (
          <>
            <button className="myreviews-action-btn myreviews-view">리뷰보기</button>
            <button className="myreviews-action-btn myreviews-edit">수정하기</button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="myreviews-tab-container">
      <div className="myreviews-section-group">
        <h4 className="myreviews-section-label">리뷰 대기 중인</h4>
          <p className="myreviews-no-items">작성할 리뷰가 없습니다.</p>
      </div>

      <div className="myreviews-section-group" style={{ marginTop: '40px' }}>
        <h4 className="myreviews-section-label">리뷰 등록 완료</h4>
        {reviews.length > 0 ? (
          reviews.map(renderReviewCard)
        ) : (
          <p className="myreviews-no-items">작성 완료된 리뷰가 없습니다.</p>
        )}
      </div>
    </div>
  );
}