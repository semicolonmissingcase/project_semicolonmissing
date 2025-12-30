import React from 'react';
import './MyReviews.css';

// 내 리뷰
export default function MyReviews() {
  const reviews = [
    { id: 1, status: 'pending', name: 'OOO 기사님', heart: true },
    { id: 2, status: 'pending', name: 'OOO 기사님', heart: false },
    { id: 3, status: 'completed', name: 'OOO 기사님', heart: false },
  ];

  const renderReviewCard = (item) => (
    <div key={item.id} className="myreviews-status-card">
      {/* 실제 이미지가 들어갈 원형 박스 */}
      <div className="myreviews-avatar-circle">
        <img 
          src="https://via.placeholder.com/80" 
          alt="기사님" 
          className="myreviews-avatar-img" 
        />
      </div>
      
      <div className="myreviews-text-content">
        <h4 className="myreviews-driver-name">
          {item.name} {item.heart ? <span className="myreviews-heart-red">❤</span> : <span className="myreviews-heart-empty">♡</span>}
        </h4>
        <p className="myreviews-sub-info">2025-10-25 16:00 ~ 17:00</p>
        <p className="myreviews-sub-info">B매장</p>
        <p className="myreviews-price-info">견적 금액 150,000원</p>
      </div>

      <button className={`myreviews-action-btn ${item.status === 'completed' ? 'myreviews-edit' : 'myreviews-write'}`}>
        {item.status === 'completed' ? '수정하기' : '리뷰 쓰기'}
      </button>
    </div>
  );

  return (
    <div className="myreviews-tab-container">
      <div className="myreviews-section-group">
        <h4 className="myreviews-section-label">리뷰 대기 중인 기사님</h4>
        {reviews.filter(r => r.status === 'pending').map(renderReviewCard)}
      </div>
      
      <div className="myreviews-section-group" style={{ marginTop: '40px' }}>
        <h4 className="myreviews-section-label">리뷰 등록 완료 기사님</h4>
        {reviews.filter(r => r.status === 'completed').map(renderReviewCard)}
      </div>
    </div>
  );
}