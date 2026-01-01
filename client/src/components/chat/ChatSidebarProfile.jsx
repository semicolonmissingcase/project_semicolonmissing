import React from 'react';
import './ChatSidebarProfile.css';

const ChatSidebarProfile = ({ data, reviews, onClose }) => {
  if (!data) {
    return (
      <div className="ChatSidebarProfile-container">
        <p>프로필 정보를 불러오는 중...</p>
      </div>
    );
  }

  const averageRating = data.star || 0.0;
  const reviewCount = reviews?.length || 0;

  // 이름 마스킹 함수 (구조 유지)
  const maskName = (name) => {
    if (!name || name === '익명') return '고객';
    const firstChar = name.charAt(0);
    return name.length > 1 ? `${firstChar}${'*'.repeat(name.length - 1)}` : name;
  };

  // 별점 렌더링 함수 (하단 리뷰용)
  const renderStars = (star) => {
    const rating = Math.round(star);
    const fullStars = '★'.repeat(rating);
    const emptyStars = '☆'.repeat(5 - rating);
    return (
      <span className="ChatSidebarProfile-stars-visual">
        <span className="stars-full">{fullStars}</span>
        <span className="stars-empty">{emptyStars}</span>
      </span>
    );
  };

  return (
    <div className="ChatSidebarProfile-container">
      <div className="ChatSidebarProfile-header">
        <h3>기사님 정보</h3>
        <button onClick={onClose} className="ChatSidebarProfile-close-btn">✕</button>
      </div>
      
      <div className="ChatSidebarProfile-profile-section">
        <img 
          src={data.cleanerImageUrl || 'https://via.placeholder.com/64'} 
          alt={`${data.cleanerName} 프로필`} 
          className="ChatSidebarProfile-avatar" 
        />
        <div className="ChatSidebarProfile-info">
          <div className="ChatSidebarProfile-top-row">
            <div className="ChatSidebarProfile-name-group">
              <p className="ChatSidebarProfile-name">{data.cleanerName}</p>
              <p className="ChatSidebarProfile-location">{data.region || '지역 정보 없음'}</p>
            </div>
            <div className="ChatSidebarProfile-price-box">
              <span className="ChatSidebarProfile-price-label">제시 가격</span>
              <span className="ChatSidebarProfile-price-value">
                {data.price ? data.price.toLocaleString() : '0'}원
              </span>
            </div>
          </div>
        </div>
      </div>

      {data.introduction && (
        <div className="ChatSidebarProfile-description">
          <p>{data.introduction}</p>
        </div>
      )}

      {/* 통계 박스: 상단은 요청하신 대로 깔끔하게 숫자만 표시 */}
      <div className="ChatSidebarProfile-stats">
        <div className="ChatSidebarProfile-stat-item">
          <span className="ChatSidebarProfile-stat-label">고용</span>
          <span className="ChatSidebarProfile-stat-value">{data.hireCount || 0}회</span>
        </div>
        <div className="ChatSidebarProfile-stat-item">
          <span className="ChatSidebarProfile-stat-label">리뷰</span>
          <span className="ChatSidebarProfile-stat-value">
            ⭐ {averageRating.toFixed(1)} ({reviewCount})
          </span>
        </div>
      </div>

      {data.estimateContent && (
        <div className="ChatSidebarProfile-description" style={{ marginTop: '20px' }}>
          <p style={{ fontWeight: 'bold', color: '#1e3a8a', marginBottom: '8px' }}>견적 설명</p>
          <p>{data.estimateContent}</p>
        </div>
      )}

      <div className="ChatSidebarProfile-review-preview" style={{ marginTop: '30px' }}>
        <h4>리뷰 ({reviewCount})</h4>
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="ChatSidebarProfile-review-item">
              <div className="ChatSidebarProfile-review-header">
                <div className="ChatSidebarProfile-review-user-row">
                  <span className="ChatSidebarProfile-review-user">
                    {maskName(review.authorName)}님
                  </span>
                </div>
                <div className="ChatSidebarProfile-review-info-row">
                  <span className="ChatSidebarProfile-star-group">
                    {renderStars(review.star)}
                    <span className="star-number">({review.star})</span>
                  </span>
                  <span className="ChatSidebarProfile-review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="ChatSidebarProfile-review-content">{review.content}</p>
            </div>
          ))
        ) : (
          <p className="no-review-text">작성된 리뷰가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ChatSidebarProfile;