import React, { useState, useEffect } from 'react';
import './ReviewModal.css';

// mode: 'write' 또는 'edit'
export default function ReviewModal({ isOpen, onClose, targetData, mode = 'write' }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // [추가] 수정 모드일 경우 기존 데이터 세팅
  useEffect(() => {
    if (isOpen && mode === 'edit' && targetData) {
      setRating(targetData.star || 5);
      setComment(targetData.comment || '');
    } else if (isOpen && mode === 'write') {
      // 작성 모드로 새로 열릴 때는 초기화
      setRating(5);
      setComment('');
    }
  }, [isOpen, mode, targetData]);

  if (!isOpen) return null;

  const handleRatingClick = (index) => {
    setRating(index + 1);
  };

  const handleSubmit = () => {
    const reviewData = {
      cleanerId: targetData?.cleanerId || targetData?.id,
      rating: rating,
      comment: comment,
      // 수정 모드일 때는 리뷰 ID가 필요할 수 있음
      reviewId: targetData?.reviewId 
    };
    
    if (mode === 'edit') {
      console.log("리뷰 수정 전송:", reviewData);
      // axios.patch / put 로직
    } else {
      console.log("리뷰 신규 등록 전송:", reviewData);
      // axios.post 로직
    }
    onClose();
  };

  return (
    <div className="reviewmodal-overlay" onClick={onClose}>
      <div className="reviewmodal-content" onClick={(e) => e.stopPropagation()}>
        <button className="reviewmodal-close-x" onClick={onClose}>X</button>

        {/* 모드에 따라 타이틀 변경 */}
        <h2 className="reviewmodal-title">
          {targetData?.name || '기사님'} {mode === 'edit' ? '리뷰 수정' : '리뷰 작성'}
        </h2>

        <div className="reviewmodal-rating-container">
          {[...Array(5)].map((_, i) => (
            <span 
              key={i} 
              className={`reviewmodal-star ${i < rating ? 'active' : ''}`}
              onClick={() => handleRatingClick(i)}
            >
              ★
            </span>
          ))}
          <span className="reviewmodal-dropdown-icon">▼</span>
        </div>

        <div className="reviewmodal-info-text">
          <p>{targetData?.store || targetData?.storeName || '매장 정보 없음'}</p>
          <p>{targetData?.time || targetData?.date || '일시 정보 없음'}</p>
          <p className="reviewmodal-price">
            견적 금액 {targetData?.price?.toLocaleString() || '0'}원
          </p>
        </div>

        <button className="reviewmodal-file-btn">첨부파일</button>

        <textarea 
          className="reviewmodal-textarea"
          placeholder="리뷰 내용을 입력해주세요."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button className="reviewmodal-submit-btn" onClick={handleSubmit}>
          {mode === 'edit' ? '수정 완료' : '등록하기'}
        </button>
      </div>
    </div>
  );
}