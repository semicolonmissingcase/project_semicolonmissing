import React from 'react';
import './ReviewShowModal.css';

export default function ReviewShowModal({ isOpen, onClose, targetData }) {
  if (!isOpen || !targetData) return null;

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span 
        key={i} 
        className={`review-view-star ${i < rating ? 'active' : ''}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="review-view-overlay" onClick={onClose}>
      <div className="review-view-content" onClick={(e) => e.stopPropagation()}>
        {/* 상단 닫기 버튼 */}
        <button className="review-view-close-x" onClick={onClose}>&times;</button>

        {/* 리뷰 작성자 또는 대상 정보 */}
        <h2 className="review-view-title">{targetData.name} 기사님 후기</h2>

        {/* 고정된 별점 표시 */}
        <div className="review-view-rating-display">
          {renderStars(targetData.rating || 0)}
          <span className="review-view-rating-num">{targetData.rating}.0</span>
        </div>

        {/* 매장 및 이용 정보 요약 */}
        <div className="review-view-info-box">
          <p><strong>이용 매장:</strong> {targetData.storeName}</p>
          <p><strong>방문 일시:</strong> {targetData.date}</p>
        </div>

        {/* 리뷰 본문 (텍스트 영역이 아닌 일반 div/p로 변경) */}
        <div className="review-view-comment-container">
          {targetData.comment || "작성된 리뷰 내용이 없습니다."}
        </div>

        {/* 첨부 파일이 있을 경우 이미지 표시 (선택사항) */}
        {targetData.imageUrl && (
          <div className="review-view-photo">
             <img src={targetData.imageUrl} alt="리뷰 사진" />
          </div>
        )}

        {/* 하단 닫기 버튼 */}
        <button className="review-view-confirm-btn" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}