import React, { useState } from 'react';
import './ReviewShowModal.css';

export default function ReviewShowModal({ isOpen, onClose, targetData }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleRatingClick = (index) => {
    setRating(index + 1);
  };

  const handleSubmit = () => {
    const reviewData = {
      cleanerId: targetData?.id,
      rating: rating,
      comment: comment
    };
    console.log("리뷰 제출 데이터:", reviewData);
    // TODO: 서버 전송 로직 (axios.post 등)
    onClose();
  };

  return (
    <div className="reviewshowmodal-overlay" onClick={onClose}>
      <div className="reviewshowmodal-content" onClick={(e) => e.stopPropagation()}>
        {/* 상단 닫기 버튼 */}
        <button className="reviewshowmodal-close-x" onClick={onClose}>X</button>

        {/* 대상 기사님 정보 */}
        <h2 className="reviewshowmodal-title">{targetData?.name || 'OOOO'}기사님</h2>

        {/* 별점 선택 영역 */}
        <div className="reviewshowmodal-rating-container">
          {[...Array(5)].map((_, i) => (
            <span 
              key={i} 
              className={`reviewshowmodal-star ${i < rating ? 'active' : ''}`}
              onClick={() => handleRatingClick(i)}
            >
              ★
            </span>
          ))}
          <span className="reviewshowmodal-dropdown-icon">▼</span>
        </div>

        {/* 매장 및 일시 정보 */}
        <div className="reviewshowmodal-info-text">
          <p>{targetData?.storeName || 'B매장'}</p>
          <p>{targetData?.date || '2025-10-25 16:00 ~ 17:00'}</p>
          <p className="reviewshowmodal-price">견적 금액 {targetData?.price?.toLocaleString() || '150,000'}원</p>
        </div>

        {/* 첨부파일 버튼 */}
        <button className="reviewshowmodal-file-btn">첨부파일</button>

        {/* 리뷰 텍스트 영역 */}
        <textarea 
          className="reviewshowmodal-textarea"
          placeholder="리뷰 내용을 입력해주세요."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* 하단 확인 버튼 */}
        <button className="reviewshowmodal-submit-btn" onClick={handleSubmit}>
          확인
        </button>
      </div>
    </div>
  );
}