import React from 'react';
import { FaStar, FaRegStar, FaQuoteLeft } from 'react-icons/fa';
import { MdOutlineRateReview, MdEventNote } from 'react-icons/md';
import './CleanersReview.css';

  const reviewData = [
    {
      "id": 1,
      "owner_id": 1,
      "reservation_id": 3,
      "content": "청소 과정도 상세히 설명해 주시고, 평소 관리 방법까지 친절하게 알려주셔서 큰 도움이 되었습니다. 다음에도 꼭 이 기사님께 부탁드리고 싶어요.",
      "star": 5,
      "created_at": "2026-01-01 13:24:57",
    }
  ];

function CleanersReview() {
  // 2. 배열의 첫 번째 객체를 선택
  const data = reviewData[0];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} style={{ color: '#FFD700' }} />
        ) : (
          <FaRegStar key={i} style={{ color: '#DDD' }} />
        )
      );
    }
    return stars;
  };

  // 데이터가 없을 경우 처리
  if (!data) return <p>리뷰가 없습니다.</p>;

  return (
    <div className="cleaners-review-container">
      <div className="cleaners-review-card">
        <div className="cleaners-review-card-row" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', marginBottom: '10px' }}>
          <div className="completedjoblist-card-place">
            <MdOutlineRateReview style={{ fontSize: '1.2rem', color: '#FF7A00' }} />
            <div style={{ display: 'flex', gap: '2px', fontSize: '1.1rem' }}>
              {renderStars(data.star)} {/* data.star로 변경 */}
            </div>
          <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: '500' }}>
            {data.star}.0 / 5.0
          </span>
          </div>
        </div>

        <div className="cleaners-review-card-row">
          <span className="cleaners-review-card-label">
            <FaQuoteLeft style={{ fontSize: '1rem', color: '#CCC', marginRight: '1rem' }} />
          </span>
          <span className="cleaners-review-card-value" style={{ color: '#333', fontSize: '0.95rem' }}>
            {data.content} {/* data.content로 변경 */}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '8px', borderTop: '1px dashed #EEE' }}>
          <div className="cleaners-review-card-row" style={{ margin: 0 }}>
            <span className="cleaners-review-card-label" style={{ fontSize: '0.8rem' }}>
              <MdEventNote style={{ marginRight: '4px' }} /> 작성일
            </span>
            <span className="cleaners-review-card-value" style={{ fontSize: '0.8rem' }}>
              {data.created_at?.split(' ')[0]}
            </span>
          </div>
          <div className="cleaners-review-card-row" style={{ margin: 0 }}>
            <span className="cleaners-review-card-label" style={{ fontSize: '0.8rem' }}>예약번호</span>
            <span className="cleaners-review-card-value" style={{ fontSize: '0.8rem' }}>
              #{data.reservation_id}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CleanersReview;

