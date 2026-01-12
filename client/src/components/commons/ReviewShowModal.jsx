import React, { useEffect, useState } from 'react';
import './ReviewShowModal.css';
import { getReviewsDetails } from '../../api/axiosPost.js';

const API_BASE_URL = import.meta.env.VITE_APP_SERVER_URL;

export default function ReviewShowModal({ isOpen, onClose, reviewId }) {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if(isOpen && reviewId) {
      const fetchReview = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await getReviewsDetails(reviewId);

          if (response && response.code === "00") {
            setReview(response.data);
          } else {
            setError(response ? response.msg : "리뷰 상세 정보를 불러오는데 실패했습니다.");
            setReview(null);
          }
        } catch (error) {
          setError("리뷰를 불러오는 중 오류가 발생했습니다.");
          setReview(null);
        } finally {
          setLoading(false);
        }
      };
      fetchReview();
    } else if (!isOpen) {
      setReview(null);
      setError(null);
    }
  }, [isOpen, reviewId]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="review-view-overlay" onClick={onClose}>
        <div className="review-view-content" onClick={(e) => e.stopPropagation()}>
          <button className="review-view-close-x" onClick={onClose}>&times;</button>
          <p>리뷰 상세 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-view-overlay" onClick={onClose}>
        <div className="review-view-content" onClick={(e) => e.stopPropagation()}>
          <button className="review-view-close-x" onClick={onClose}>&times;</button>
          <p style={{ color: 'red' }}>오류: {error}</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="review-view-overlay" onClick={onClose}>
        <div className="review-view-content" onClick={(e) => e.stopPropagation()}>
          <button className="review-view-close-x" onClick={onClose}>&times;</button>
          <p>리뷰 상세 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

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
  
  const createImageUrl = (path) => {
    if(!path) return null;
    const imageUrl = `${API_BASE_URL}/${path.replace(/\\/g, '/')}`;
    console.log("생성된 이미지 URL:", imageUrl);
    return imageUrl;
  };

  return (
    <div className="review-view-overlay" onClick={onClose}>
      <div className="review-view-content" onClick={(e) => e.stopPropagation()}>
        {/* 상단 닫기 버튼 */}
        <button className="review-view-close-x" onClick={onClose}>&times;</button>

        {/* 리뷰 작성자 또는 대상 정보 */}
        <h2 className="review-view-title">{review.cleanerName} 기사님</h2>

        {/* 고정된 별점 표시 */}
        <div className="review-view-rating-display">
          {renderStars(review.star || 0)}
          <span className="review-view-rating-num">{review.star}.0</span>
        </div>

        {/* 매장 및 이용 정보 요약 */}
        <div className="review-view-info-box">
          <p>{review.storeName || '정보 없음'}</p>
          <p>{review.reservationDate ? new Date(review.reservationDate).toLocaleDateString() : '정보 없음'}</p>
          <p>{review.price}원</p>
        </div>

        {/* 리뷰 본문 */}
        <div className="review-view-comment-container">
          {review.content || "작성된 리뷰 내용이 없습니다."}
        </div>

        {/* 첨부 파일이 있을 경우 이미지 표시 */}
        <div className="review-view-photos-container">
          {review.reviewPicture1 && (
            <div className="review-view-photo">
              <img src={createImageUrl(review.reviewPicture1)} alt="리뷰 사진" />
            </div>
          )}
          {review.reviewPicture2 && (
            <div className="review-view-photo">
              <img src={createImageUrl(review.reviewPicture2)} alt="리뷰 사진" />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}