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
              <p className="ChatSidebarProfile-location">{data.region}</p>
            </div>
            <div className="ChatSidebarProfile-price-box">
              <span className="ChatSidebarProfile-price-label">제시 가격</span>
              <span className="ChatSidebarProfile-price-value">{data.price ? data.price.toLocaleString() : '0'}원</span>
            </div>
          </div>
        </div>
      </div>

      {data.introduction && (
        <div className="ChatSidebarProfile-description">
          <p>{data.introduction}</p>
        </div>
      )}

      <div className="ChatSidebarProfile-stats">
        <div className="ChatSidebarProfile-stat-item">
          <span className="ChatSidebarProfile-stat-label">고용</span>
          <span className="ChatSidebarProfile-stat-value">{data.hireCount || 0}회</span>
        </div>
        <div className="ChatSidebarProfile-stat-item">
          <span className="ChatSidebarProfile-stat-label">리뷰</span>
          <span className="ChatSidebarProfile-stat-value">⭐{averageRating.toFixed(1)}({reviewCount})</span>
        </div>
      </div>

      {/* ===== estimateContent 표시 부분 추가 ===== */}
      {data.estimateContent && (
        <div className="ChatSidebarProfile-description" style={{ marginTop: '20px' }}>
          <p style={{ fontWeight: 'bold', color: 'var(--color-dark-blue)', marginBottom: '8px' }}>견적 설명</p>
          <p>{data.estimateContent}</p>
        </div>
      )}
      {/* ======================================= */}

      <div className="ChatSidebarProfile-review-preview" style={{ marginTop: '30px' }}>
        <h4>리뷰 ({reviewCount})</h4>
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="ChatSidebarProfile-review-item">
              <p className="ChatSidebarProfile-review-user">{review.authorName || '고객'}님</p>
              <p>{review.content}</p>
            </div>
          ))
        ) : (
          <p>작성된 리뷰가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ChatSidebarProfile;